import {useGlobal} from "../GlobalContext";
import RatingChart from "./RatingChart";
import React, {useEffect} from "react";
import OnePlayerAccuracyChart from "./OnePlayerAccuracyChart";
import TwoPlayerAccuracyChart from "./TwoPlayerAccuracyChart";
import TimeClassChart from "./TimeClassChart";
import RulesChart from "./RulesChart";
import WinsChart from "./WinsChart";
import OpponentsChart from "./OpponentsChart";

export default function ChartWrapper() {
    const { global } = useGlobal();
    const [selectedGraph, setSelectedGraph] = React.useState(
        localStorage.getItem(global.twoPlayerSelected ? "selectedGraphMulti" : "selectedGraphSingle") ?? (global.twoPlayerSelected ? "accuracy" : "ranked")
    );

    const handleGraphChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSelectedGraph(value);
        localStorage.setItem(global.twoPlayerSelected ? "selectedGraphMulti" : "selectedGraphSingle", value);
    };

    useEffect(() => {
        setSelectedGraph(localStorage.getItem(global.twoPlayerSelected ? "selectedGraphMulti" : "selectedGraphSingle") ?? (global.twoPlayerSelected ? "accuracy" : "ranked"))
    }, [global.twoPlayerSelected]);

    return(
        <div>
            <div className="header-2">Analytics</div>
            <select
                className="select"
                value={selectedGraph}
                onChange={handleGraphChange}
                id="graph-select"
            >
                {!global.player2Profile && <option value="ranked">Ranked</option>}
                <option value="accuracy">Accuracy</option>
                <option value="timeclass">Timeclasses</option>
                <option value="rules">Rules</option>
                {!global.player2Profile && <option value="wins">Wins</option>}
                {!global.player2Profile && <option value="opponents">Opponents</option>}
            </select>
            <div style={{ width: "100%", height: "var(--graph-height)"}}>
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
                                selectedGraph === "wins" ?
                                    <WinsChart/>
                                    :
                                    selectedGraph === "opponents" ?
                                        <OpponentsChart/>
                                        :
                        <></>
            }
            </div>
        </div>

    )
}