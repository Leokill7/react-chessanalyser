import ReactECharts from "echarts-for-react";
import { useGlobal } from "../GlobalContext";
import {useEffect, useRef} from "react";

export default function OpponentsChart() {
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

    const opponentCounts: Record<string, number> = {};

    global.foundGames.forEach((game) => {
        if (!username) return;

        const isBlack = game.black.username.toLowerCase() === username;
        const isWhite = game.white.username.toLowerCase() === username;

        if (!isBlack && !isWhite) return;

        const opponent = isBlack
            ? game.white.username
            : game.black.username;

        opponentCounts[opponent] = (opponentCounts[opponent] ?? 0) + 1;
    });

    // Sortieren und Top 10 + "Sonstige"
    const sorted = Object.entries(opponentCounts)
        .sort((a, b) => b[1] - a[1]);

    const top10 = sorted.slice(0, 10);
    const others = sorted.slice(10).reduce((sum, [, count]) => sum + count, 0);

    const colors = [
        "#60a5fa", "#f87171", "#86efac", "#facc15", "#c084fc",
        "#fb923c", "#34d399", "#f472b6", "#38bdf8", "#a3e635",
    ];

    const pieData = [
        ...top10.map(([name, value], i) => ({
            name,
            value,
            itemStyle: { color: colors[i] },
        })),
        ...(others > 0 ? [{ name: "Others", value: others, itemStyle: { color: "#6b7280" } }] : []),
    ];

    const option = {
        backgroundColor: "transparent",
        animation: false,
        legend: {
            show: false,
        },
        tooltip: {
            trigger: "item",
            formatter: (params: any) =>
                `${params.name}<br/>${params.value} Games (${params.percent}%)`,
        },
        series: [
            {
                type: "pie",
                radius: ["30%", "70%"],
                center: ["50%", "55%"],
                data: pieData,
                label: {
                    color: "#d1d5db",
                    formatter: "{b}: {d}%",
                },
                labelLine: {
                    lineStyle: { color: "#4b5563" },
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: "rgba(0,0,0,0.5)",
                    },
                },
            },
        ],
    };

    return (
            <ReactECharts
                ref={chartRef}
                option={option}
                style={{ width: "100%", height: "100%" }}
            />
    );
}