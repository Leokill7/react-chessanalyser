import {useGlobal} from "../GlobalContext";
import RatingChart from "./RatingChart";
import React from "react";
import Graph from "echarts/types/src/data/Graph";

export default function ChartWrapper() {
    const { global } = useGlobal();
    const [selectedGraph, setSelectedGraph] = React.useState("");

    return(
        <div>
            <select className="graph-select" onChange={(e) => setSelectedGraph((e.target.value))}>
                <option value={"ranked"}>Ranked</option>
                <option value={"accuracy"}>Accuracy</option>
            </select>
            <RatingChart/>
        </div>

    )
}