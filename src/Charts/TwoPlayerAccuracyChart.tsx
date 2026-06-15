import ReactECharts from "echarts-for-react";
import { useGlobal } from "../GlobalContext";
import {GetPlayerName} from "../commonFunctions";
import {useEffect, useRef} from "react";

type AccuracyPoint = {
    value: [number, number];
    url: string;
};

export default function TwoPlayerAccuracyChart() {
    const { global } = useGlobal();
    const chartRef = useRef<ReactECharts>(null);

    useEffect(() => {
        const handleResize = () => {
            chartRef.current?.getEchartsInstance().resize();
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const data: { data: AccuracyPoint[], title: string, color: string }[] = [
        { title: GetPlayerName(global.player1Profile) + "'s accuracy", data: [], color: "#6A994D" },
        { title: GetPlayerName(global.player2Profile) + "'s accuracy", data: [], color: "#266999" }
    ];

    global.foundGames.forEach((game) => {
        if (!global.player1Profile?.username) return;
        if (!game.accuracies) return;

        const p1isBlack = game.black.username.toLowerCase() === global.player1Profile?.username.toLowerCase();
        const p1isWhite = game.white.username.toLowerCase() === global.player1Profile?.username.toLowerCase();

        if (!p1isBlack && !p1isWhite) return;

        const p1accuracy = p1isBlack ? game.accuracies.black : game.accuracies.white;
        if (!p1accuracy) return;

        const p1point: AccuracyPoint = {
            value: [data[0].data.length + 1, p1accuracy],
            url: game.url,
        };

        data[0].data.push(p1point);

        const p2accuracy = p1isBlack ? game.accuracies.white : game.accuracies.black;
        if (!p2accuracy) return;

        const p2point: AccuracyPoint = {
            value: [data[1].data.length + 1, p2accuracy],
            url: game.url,
        };

        data[1].data.push(p2point);
    });
console.log(data);
    const maxX = Math.max(data[0].data.length, data[1].data.length);

    const option = {
        backgroundColor: "transparent",
        animation: false,
        grid: { top: 50, right: 40, bottom: 45, left: 45 },
        legend: {
            top: 10,
            textStyle: { color: "#d1d5db" },
            icon: "circle",
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
            min: 0,
            max: 100,
            name: "Accuracy %",
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