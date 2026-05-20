import {useGlobal} from "../GlobalContext";
import RatingChart from "./RatingChart";
import React, {useEffect} from "react";
import Graph from "echarts/types/src/data/Graph";
import OnePlayerAccuracyChart from "./OnePlayerAccuracyChart";
import TwoPlayerAccuracyChart from "./TwoPlayerAccuracyChart";
import {ChessPlayerProfile} from "../types";
import {GetDataFrom} from "../commonFunctions";
import TimeClassChart from "./TimeClassChart";
import RulesChart from "./RulesChart";

export default function ChartWrapper() {
    const [selectedGraph, setSelectedGraph] = React.useState("ranked");
    const { global } = useGlobal();


    return(
        <div>
            <div className="games-played-text">Analytics</div>
            <select className="graph-select" onChange={(e) => setSelectedGraph((e.target.value))}>
                <option value={"ranked"}>Ranked</option>
                <option value={"accuracy"}>Accuracy</option>
                <option value={"timeclass"}>Timeclasses</option>
                <option value={"rules"}>Rules</option>
            </select>
            {
                selectedGraph === "ranked" ?
                    <RatingChart/>
                    :
                    selectedGraph === "accuracy" ?
                        (!global.player2Profile) ?
                            <OnePlayerAccuracyChart/>
                            :
                            <TwoPlayerAccuracyChart/>
                        :
                        selectedGraph === "timeclass" ?
                            <TimeClassChart/>
                            :
                            selectedGraph === "rules" ?
                                <RulesChart/>
                                :
                        <></>
            }

        </div>

    )
}