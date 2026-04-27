import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    LinearScale,
    TimeScale,
    Tooltip,
    Legend,
    CategoryScale,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { Line } from "react-chartjs-2";
import {useGlobal} from "../GlobalContext";
import type { ChartOptions } from "chart.js";

ChartJS.register(
    LineElement,
    PointElement,
    LinearScale,
    TimeScale,
    Tooltip,
    Legend,
    CategoryScale
);

export default function RatingChart() {
    const { global } = useGlobal();

    const username = global.player1Profile?.username.toLowerCase();

    let labels = []
    let ratingData: { daily: number|undefined, rapid: number|undefined, blitz: number|undefined, bullet: number|undefined ,gameNumber: number}[] = [];
    let blitzRatings: { x: number; y: number; url: string }[] = [];
    let bulletRatings: { x: number; y: number; url: string }[] = [];
    let rapidRatings: { x: number; y: number; url: string }[] = [];
    let dailyRatings: { x: number; y: number; url: string }[] = [];

    global.foundGames.forEach((game) => {
        if (!username) return null;
        if(!game.rated) return null;
        if(game.rules != "chess") return null;

        const isBlack = game.black.username.toLowerCase() === username;
        const isWhite = game.white.username.toLowerCase() === username;

        if (!isBlack && !isWhite) return null;

        const rating = isBlack ? game.black.rating : game.white.rating;

        const point = {
            x:
                game.time_class === "bullet" ? bulletRatings.length + 1 :
                    game.time_class === "blitz" ? blitzRatings.length + 1 :
                        game.time_class === "rapid" ? rapidRatings.length + 1 :
                            dailyRatings.length + 1,
            y: rating,
            url: game.url,
        };

        switch (game.time_class) {
            case "bullet":
                bulletRatings.push(point);
                break;
            case "blitz":
                blitzRatings.push(point);
                break;
            case "rapid":
                rapidRatings.push(point);
                break;
            case "daily":
                dailyRatings.push(point);
                break;
        }
    })


    const data = {
        datasets: [
            {
                label: "Daily",
                data: dailyRatings,
                parsing: false as const,
                borderColor: "#facc15",
                backgroundColor: "#facc15",
                pointRadius: 3,
                tension: 0.2,
            },
            {
                label: "Rapid",
                data: rapidRatings,
                parsing: false as const,
                borderColor: "#86efac",
                backgroundColor: "#86efac",
                pointRadius: 3,
                tension: 0.2,
            },
            {
                label: "Blitz",
                data: blitzRatings,
                parsing: false as const,
                borderColor: "#60a5fa",
                backgroundColor: "#60a5fa",
                pointRadius: 3,
                tension: 0.2,
            },
            {
                label: "Bullet",
                data: bulletRatings,
                parsing: false as const,
                borderColor: "#f87171",
                backgroundColor: "#f87171",
                pointRadius: 3,
                tension: 0.2,
            },
        ],
    };

    const maxX = Math.max(
        ...dailyRatings.map((p) => p.x),
        ...rapidRatings.map((p) => p.x),
        ...blitzRatings.map((p) => p.x),
        ...bulletRatings.map((p) => p.x)
    );

    const options: ChartOptions<"line"> = {
        responsive: true,
        maintainAspectRatio: false,
        parsing: false,
        onClick: (event, elements, chart) => {
            if (!elements.length) return;

            const { datasetIndex, index } = elements[0];
            const dataset = chart.data.datasets[datasetIndex];
            const point = dataset.data[index] as { x: number; y: number; url: string };

            window.open(point.url, "_blank", "noopener,noreferrer");
        },
        scales: {
            x: {
                type: "linear",
                min: 1,
                max: maxX+1,
                title: {
                    display: true,
                    text: "Games",
                },
            },
            y: {
                title: {
                    display: true,
                    text: "Rating",
                },
            },
        },
        plugins: {
            legend: {
                display: true,
                position: "top",
            },
        },
    };

    return (
        <div style={{ width: "100%", height: "320px"}}>
            <Line data={data} options={options} />
        </div>
    );
}