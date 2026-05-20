import React, {RefObject, useEffect, useState} from "react";
import "./SearchFilter.css"
import rankIcon from "../Icons/rankIcon.png";

import wkIcon from "../Icons/wk.png";
import bkIcon from "../Icons/bk.png";

import dailyIcon from "../Icons/TimeClassIcons/dailyIcon.png";
import rapidIcon from "../Icons/TimeClassIcons/rapidIcon.png";
import blitzIcon from "../Icons/TimeClassIcons/blitzIcon.png";
import bulletIcon from "../Icons/TimeClassIcons/bulletIcon.png";

import bughouseIcon from "../Icons/bughouseIcon.png";
import chess960Icon from "../Icons/chess960Icon.png";
import threeCheckIcon from "../Icons/threeCheckIcon.png";
import kingOfTheHillIcon from "../Icons/kingOfTheHillIcon.png";
import crazyhouseIcon from "../Icons/crazyhouseIcon.png";
type InputRef = RefObject<HTMLInputElement | null>;

type SearchFilterProps = {
    rankedChecked: boolean;
    setRankedChecked: (arg0: boolean) => void;
    nonRankedChecked: boolean;
    setNonRankedChecked: (arg0: boolean) => void;
    whiteChecked: boolean;
    setWhiteChecked: (arg0: boolean) => void;
    blackChecked: boolean;
    setBlackChecked: (arg0: boolean) => void;
    dailyChecked: boolean;
    setDailyChecked: (arg0: boolean) => void;
    rapidChecked: boolean;
    setRapidChecked: (arg0: boolean) => void;
    blitzChecked: boolean;
    setBlitzChecked: (arg0: boolean) => void;
    bulletChecked: boolean;
    setBulletChecked: (arg0: boolean) => void;
    bughouseChecked: boolean;
    setBughouseChecked: (arg0: boolean) => void;
    chess960Checked: boolean;
    setChess960Checked: (arg0: boolean) => void;
    threeCheckChecked: boolean;
    setThreeCheckChecked: (arg0: boolean) => void;
    kotHChecked: boolean;
    setKotHChecked: (arg0: boolean) => void;
    crazyhouseChecked: boolean;
    setCrazyhouseChecked: (arg0: boolean) => void;
    gameAmountSliderValue: number;
    setGameAmountSliderValue: (arg0: number) => void;
};

export default function SearchFilter({
                                         rankedChecked,
                                         setRankedChecked,
                                         nonRankedChecked,
                                         setNonRankedChecked,
                                         whiteChecked,
                                         setWhiteChecked,
                                         blackChecked,
                                         setBlackChecked,
                                         dailyChecked,
                                         setDailyChecked,
                                         rapidChecked,
                                         setRapidChecked,
                                         blitzChecked,
                                         setBlitzChecked,
                                         bulletChecked,
                                         setBulletChecked,
                                         bughouseChecked,
                                         setBughouseChecked,
                                         chess960Checked,
                                         setChess960Checked,
                                         threeCheckChecked,
                                         setThreeCheckChecked,
                                         kotHChecked,
                                         setKotHChecked,
                                         crazyhouseChecked,
                                         setCrazyhouseChecked,
                                         gameAmountSliderValue,
                                         setGameAmountSliderValue,
                                     }: SearchFilterProps) {

    function ImageCheckboxPair({key,value,setter,imgSrc,imgTitle}:{key:number,value:boolean,setter:(arg0:boolean) => void,imgSrc:string,imgTitle:string}){
        return (
            <div className="filter-icon-checkbox-container" key={key}>
                <img title={imgTitle} className="filter-icon" src={imgSrc}  alt={imgTitle} />
                <input type="checkbox" checked={value} onChange={e => {setter(e.target.checked)}}/>
            </div>
        )
    }

    function GetGameAmountText(){
        switch (gameAmountSliderValue){
            case 0: return 1;
            case 1: return 10;
            case 2: return 50;
            case 3: return 100;
            case 4: return 500;
            case 5: return "All";
        }
    }

    return (
        <div
             style={{
                 display: "grid",
                 gap:"15px",
                 padding:"5px",
                 width: "80%",
                 margin: "auto",
                 backgroundColor: "var(--button-background-color)",
                 border: "var(--button-border-color) 1px solid",
                 borderRadius: "10px"
            }}
        >
            <div style={{display:"flex", justifyContent: "space-around"}}>
                <div className="filter-container">
                    <h6 className={"filter-header"}>Ranked</h6>
                    <div>
                        <div className="filter-icon-checkbox-container">
                            <div>Ranked</div>
                            <input
                                type="checkbox"
                                checked={rankedChecked}
                                onChange={e => {setRankedChecked(e.target.checked)}}
                            />
                        </div>
                        <div className="filter-icon-checkbox-container">
                            <div>Non-Ranked</div>
                            <input
                                type="checkbox"
                                checked={nonRankedChecked}
                                onChange={e => {setNonRankedChecked(e.target.checked)}}
                            />
                        </div>
                    </div>
                </div>
                <div className="filter-container">
                    <h6 className={"filter-header"}>Game Amount:</h6>
                    <div style={{display:"flex", justifyContent:"space-around", alignItems:"center"}}>
                        <input
                            type="range"
                            min={0}
                            max={5}
                            step={1}
                            value={gameAmountSliderValue}
                            onChange={(e) => setGameAmountSliderValue(Number(e.target.value))}
                        />
                        <div>{GetGameAmountText()}</div>
                    </div>

                </div>
            </div>
            <div style={{display:"flex", justifyContent: "space-around"}}>
                <div className="filter-container">
                    <h6 className={"filter-header"}>Color:</h6>
                    {
                        [
                            {imageSrc:wkIcon,imageTitle:"White",checkboxID:"WhiteCheckbox",value: whiteChecked, setter:setWhiteChecked},
                            {imageSrc:bkIcon,imageTitle:"Black",checkboxID:"BlackCheckbox",value: blackChecked, setter:setBlackChecked}

                        ].map((item,index) =>
                            ImageCheckboxPair({imgSrc: item.imageSrc, imgTitle: item.imageTitle, key: index, value: item.value, setter: item.setter})
                        )
                    }

                </div>
                <div className="filter-container">
                    <h6 className={"filter-header"}>Timeclass:</h6>
                    <div style={{display:"grid", gridTemplateColumns:'repeat(2,1fr)'}}>
                        {
                            [
                                {imageSrc:dailyIcon,imageTitle:"Daily",checkboxID:"dailyCheckbox",value: dailyChecked, setter:setDailyChecked},
                                {imageSrc:rapidIcon,imageTitle:"Rapid",checkboxID:"rapidCheckbox",value: rapidChecked, setter:setRapidChecked},
                                {imageSrc:blitzIcon,imageTitle:"Blitz",checkboxID:"blitzCheckbox",value: blitzChecked, setter:setBlitzChecked},
                                {imageSrc:bulletIcon,imageTitle:"Bullet",checkboxID:"bulletCheckbox",value: bulletChecked, setter:setBulletChecked}

                            ].map((item,index) =>
                                ImageCheckboxPair({imgSrc: item.imageSrc, imgTitle: item.imageTitle, key: index, value: item.value, setter: item.setter})
                            )
                        }
                    </div>

                </div>
                <div className="filter-container">
                    <h6 className={"filter-header"}>Rules:</h6>
                    <div style={{display:"grid", gridTemplateColumns:'repeat(3,1fr)'}}>
                        {
                            [
                                {imageSrc:bughouseIcon,imageTitle:"Bughouse",checkboxID:"bughouseCheckbox",value: bughouseChecked, setter:setBughouseChecked},
                                {imageSrc:chess960Icon,imageTitle:"960Chess",checkboxID:"chess960Checkbox",value: chess960Checked, setter:setChess960Checked},
                                {imageSrc:threeCheckIcon,imageTitle:"Three-Check",checkboxID:"threecheckCheckbox",value: threeCheckChecked, setter:setThreeCheckChecked},
                                {imageSrc:kingOfTheHillIcon,imageTitle:"King of the hill",checkboxID:"kingofthehillCheckbox",value: kotHChecked, setter:setKotHChecked},
                                {imageSrc:crazyhouseIcon,imageTitle:"Crazyhouse",checkboxID:"crazyhouseCheckbox",value: crazyhouseChecked, setter:setCrazyhouseChecked}
                            ].map((item,index) =>
                                ImageCheckboxPair({imgSrc: item.imageSrc, imgTitle: item.imageTitle, key: index, value: item.value, setter: item.setter})
                            )
                        }
                    </div>
                </div>
            </div>


        </div>
    );
}

