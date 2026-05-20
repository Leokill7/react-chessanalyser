import ReactECharts from "echarts-for-react";
import { useGlobal } from "../GlobalContext";

export default function RulesChart() {
    const { global } = useGlobal();
    const username = global.player1Profile?.username.toLowerCase();

    const counts: Record<string, number> = {
        bughouse: 0,
        chess960: 0,
        threecheck: 0,
        kingofthehill: 0,
        crazyhouse: 0,
        chess: 0,
    };

    global.foundGames.forEach((game) => {
        if (!username) return;
        const isBlack = game.black.username.toLowerCase() === username;
        const isWhite = game.white.username.toLowerCase() === username;
        if (!isBlack && !isWhite) return;

        if (game.rules in counts) {
            counts[game.rules]++;
        }
    });

    const pieData = [
        { value: counts.chess,        name: "Chess",          itemStyle: { color: "#60a5fa" } },
        { value: counts.bughouse,     name: "Bughouse",       itemStyle: { color: "#f87171" } },
        { value: counts.chess960,     name: "960",            itemStyle: { color: "#86efac" } },
        { value: counts.threecheck,   name: "Three-Check",    itemStyle: { color: "#facc15" } },
        { value: counts.kingofthehill,name: "King of the Hill",itemStyle: { color: "#c084fc" } },
        { value: counts.crazyhouse,   name: "Crazyhouse",     itemStyle: { color: "#fb923c" } },
    ].filter(d => d.value > 0);

    const option = {
        backgroundColor: "transparent",
        animation: false,
        legend: {
            top: 10,
            textStyle: { color: "#d1d5db" },
            icon: "circle",
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
        <div style={{ width: "100%", height: "320px" }}>
            <ReactECharts
                option={option}
                style={{ width: "100%", height: "100%" }}
            />
        </div>
    );
}