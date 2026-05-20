import ReactECharts from "echarts-for-react";
import { useGlobal } from "../GlobalContext";

export default function TimeClassChart() {
    const { global } = useGlobal();
    const username = global.player1Profile?.username.toLowerCase();

    const counts: Record<string, number> = {
        blitz: 0,
        bullet: 0,
        rapid: 0,
        daily: 0,
    };

    global.foundGames.forEach((game) => {
        if (!username) return;
        const isBlack = game.black.username.toLowerCase() === username;
        const isWhite = game.white.username.toLowerCase() === username;
        if (!isBlack && !isWhite) return;

        if (game.time_class in counts) {
            counts[game.time_class]++;
        }
    });

    const pieData = [
        { value: counts.blitz,  name: "Blitz",  itemStyle: { color: "#60a5fa" } },
        { value: counts.bullet, name: "Bullet", itemStyle: { color: "#f87171" } },
        { value: counts.rapid,  name: "Rapid",  itemStyle: { color: "#86efac" } },
        { value: counts.daily,  name: "Daily",  itemStyle: { color: "#facc15" } },
    ].filter(d => d.value > 0); // leere Typen ausblenden

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