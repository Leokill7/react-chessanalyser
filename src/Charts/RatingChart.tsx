import ReactECharts from "echarts-for-react";
import { useGlobal } from "../GlobalContext";
import {useEffect, useRef} from "react";

type RatingPoint = {
    value: [number, number];
    url: string;
};

export default function RatingChart() {
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

    //0 = blitz, 1 = bullet, 2 = rapid, 3 = daily
    const data: { data: RatingPoint[], title: string, color: string}[] = [
        {title:"Blitz", data:[], color:"#60a5fa"},
        {title:"Bullet", data:[], color:"#f87171"},
        {title:"Rapid", data:[], color:"#86efac"},
        {title:"Daily", data:[], color:"#facc15"}
    ]

    global.foundGames.forEach((game) => {
        if (!username) return;
        if (!game.rated) return;
        if (game.rules !== "chess") return;

        const isBlack = game.black.username.toLowerCase() === username;
        const isWhite = game.white.username.toLowerCase() === username;

        if (!isBlack && !isWhite) return;

        const rating = isBlack ? game.black.rating : game.white.rating;

        const x =
            game.time_class === "bullet"
                ? data[1].data.length + 1
                : game.time_class === "blitz"
                    ? data[0].data.length + 1
                    : game.time_class === "rapid"
                        ? data[2].data.length + 1
                        : data[3].data.length + 1;

        const point: RatingPoint = {
            value: [x, rating],
            url: game.url,
        };

        switch (game.time_class) {
            case "bullet":
                data[1].data.push(point);
                break;
            case "blitz":
                data[0].data.push(point);
                break;
            case "rapid":
                data[2].data.push(point);
                break;
            case "daily":
                data[3].data.push(point);
                break;
        }
    });

    const maxX = Math.max(
        data[0].data.length,
        data[1].data.length,
        data[2].data.length,
        data[3].data.length,
        1
    );

    const option = {
        backgroundColor: "transparent",
        animation: false,
        grid: {
            top: 50,
            right: 40,
            bottom: 45,
            left: 45,
        },
        legend: {
            top: 10,
            textStyle: {
                color: "#d1d5db",
            },
            icon: "circle",
        },
        tooltip: {
            trigger: "item",
            formatter: (params: any) => {
                const [x, y] = params.data.value;
                return `${params.seriesName}<br/>Game ${x}<br/>Rating: ${y}`;
            },
        },
        xAxis: {
            type: "value",
            min: 1,
            max: maxX + 1,
            name: "Games",
            nameLocation: "middle",
            nameGap: 30,
            axisLabel: {
                color: "#9ca3af",
            },
            nameTextStyle: {
                color: "#9ca3af",
            },
            splitLine: {
                lineStyle: {
                    color: "rgba(255,255,255,0.06)",
                },
            },
        },
        yAxis: {
            type: "value",
            name: "Rating",
            nameLocation: "middle",
            nameGap: 35,
            axisLabel: {
                color: "#9ca3af",
            },
            nameTextStyle: {
                color: "#9ca3af",
            },
            splitLine: {
                lineStyle: {
                    color: "rgba(255,255,255,0.06)",
                },
            },
        },
        series: data.map((r: { data: RatingPoint[], title: string, color: string}) => {
            return {
                name: r.title,
                type: "line",
                data: r.data,
                symbol: "circle",
                symbolSize: (window.innerWidth > 800?5:1),
                showSymbol: true,
                lineStyle: {
                    width: 3,
                    color: r.color,
                },
                itemStyle: {
                    color: r.color,
                },
                endLabel: {
                    show: r.data.length > 0,
                    formatter: ({ value }: any) => `${value[1]}`,
                    color: r.color,
                    padding: 5,
                    border: "1px solid",
                    borderRadius: 5,
                    backgroundColor: "#424242",
                    offset: [-20, -20],
                },
                labelLayout: {
                    moveOverlap: "shiftY",
                },
                emphasis: {
                    scale: true,
                    itemStyle: {
                        symbolSize: 12,
                        borderWidth: 2,
                        borderColor: r.color,
                        color: "#1f2937",
                        shadowBlur: 6,
                        shadowColor: r.color,
                    },
                },
            }
        }),
    };

    const onEvents = {
        click: (params: any) => {
            const url = params?.data?.url;
            if (url) {
                window.open(url, "_blank", "noopener,noreferrer");
            }
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