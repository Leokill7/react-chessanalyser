import ReactECharts from "echarts-for-react";
import { useGlobal } from "../GlobalContext";
import {useEffect, useRef} from "react";

type AccuracyPoint = {
    value: [number, number];
    url: string;
};

export default function WinsChart() {
    const { global } = useGlobal();
    const chartRef = useRef<ReactECharts>(null);

    useEffect(() => {
        const handleResize = () => {
            chartRef.current?.getEchartsInstance().resize();
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    const username = global.player1Profile?.username.toLowerCase();

    const data: { data: AccuracyPoint[], title: string, color: string }[] = [
        { title: "Win/Loss", data: [], color: "#6A994D" }
    ];

    let winLooseCount = 0;

    global.foundGames.forEach((game) => {
        if (!username) return;

        const isBlack = game.black.username.toLowerCase() === username;
        const isWhite = game.white.username.toLowerCase() === username;

        if (!isBlack && !isWhite) return;

        const blackWon = game.black.result === "win";
        const whiteWon = game.white.result === "win";

        if((blackWon && isBlack) || (isWhite && whiteWon)){
            winLooseCount ++;
        }else if((whiteWon && isBlack) || (isWhite && blackWon)){
            winLooseCount --;
        }

        const value = winLooseCount;
        const point: AccuracyPoint = {
            value: [data[0].data.length + 1, value],
            url: game.url,
        };

        data[0].data.push(point);
    });

    const maxX = Math.max(data[0].data.length, 1);

    const option = {
        backgroundColor: "transparent",
        animation: false,
        grid: { top: 50, right: 40, bottom: 45, left: 45 },
        legend: {
            show: false,
        },
        tooltip: {
            trigger: "item",
            formatter: (params: any) => {
                const [x, y] = params.data.value;
                return `Game ${x}<br/>Accuracy: ${y}%`;
            },
        },
        xAxis: {
            type: "value",
            min: 1,
            max: maxX + 1,
            name: "Games",
            nameLocation: "middle",
            nameGap: 30,
            axisLabel: { color: "#9ca3af" },
            nameTextStyle: { color: "#9ca3af" },
            splitLine: { lineStyle: { color: "rgba(255,255,255,0.06)" } },
        },
        yAxis: {
            type: "value",
            name: "Win/Loss",
            nameLocation: "middle",
            nameGap: 35,
            axisLabel: { color: "#9ca3af" },
            nameTextStyle: { color: "#9ca3af" },
            splitLine: { lineStyle: { color: "rgba(255,255,255,0.06)" } },
        },
        series: data.map((r) => ({
            name: r.title,
            type: "line",
            data: r.data,
            symbol: "circle",
            symbolSize: (window.innerWidth > 800?5:1),
            showSymbol: true,
            lineStyle: { width: 3, color: r.color },
            itemStyle: { color: r.color },
            labelLayout: { moveOverlap: "shiftY" },
            emphasis: {
                scale: true,
                itemStyle: {
                    borderWidth: 2,
                    borderColor: r.color,
                    color: "#1f2937",
                    shadowBlur: 6,
                    shadowColor: r.color,
                },
            },
        })),
    };

    const onEvents = {
        click: (params: any) => {
            const url = params?.data?.url;
            if (url) window.open(url, "_blank", "noopener,noreferrer");
        },
    };

    return (
            <ReactECharts
                ref={chartRef}
                option={option}
                onEvents={onEvents}
                style={{ width: "100%", height: "100%" }}
            />
    );
}