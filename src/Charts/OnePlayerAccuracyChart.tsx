import ReactECharts from "echarts-for-react";
import { useGlobal } from "../GlobalContext";

type AccuracyPoint = {
    value: [number, number];
    url: string;
};

export default function OnePlayerAccuracyChart() {
    const { global } = useGlobal();
    const username = global.player1Profile?.username.toLowerCase();

    const data: { data: AccuracyPoint[], title: string, color: string }[] = [
        { title: "Accuracy", data: [], color: "#6A994D" }
    ];

    global.foundGames.forEach((game) => {
        if (!username) return;
        if (!game.accuracies) return;

        const isBlack = game.black.username.toLowerCase() === username;
        const isWhite = game.white.username.toLowerCase() === username;

        if (!isBlack && !isWhite) return;

        const accuracy = isBlack ? game.accuracies.black : game.accuracies.white;
        if (!accuracy) return;

        const point: AccuracyPoint = {
            value: [data[0].data.length + 1, accuracy],
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
            min: 0,
            max: 100,
            name: "Accuracy %",  // ← korrigiert
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
            symbolSize: 5,
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
        <div style={{ width: "100%", height: "320px" }}>
            <ReactECharts
                option={option}
                onEvents={onEvents}
                style={{ width: "100%", height: "100%" }}
            />
        </div>
    );
}