import React, {RefObject, useState} from "react";
import "./SearchFilter.css"
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
    filterWhiteCheckbox: InputRef;
    filterBlackCheckbox: InputRef;
    filterDailyCheckbox: InputRef;
    filterRapidCheckbox: InputRef;
    filterBlitzCheckbox: InputRef;
    filterBulletCheckbox: InputRef;
    filterBughouseCheckbox: InputRef;
    filter960ChessCheckbox: InputRef;
    filterThreeCheckCheckbox: InputRef;
    filterKotHCheckbox: InputRef;
    filterCrazyhouseCheckbox: InputRef;
    filterGameAmountSlider: InputRef;
};

export default function SearchFilter({
                                         filterWhiteCheckbox,
                                         filterBlackCheckbox,
                                         filterDailyCheckbox,
                                         filterRapidCheckbox,
                                         filterBlitzCheckbox,
                                         filterBulletCheckbox,
                                         filterBughouseCheckbox,
                                         filter960ChessCheckbox,
                                         filterThreeCheckCheckbox,
                                         filterKotHCheckbox,
                                         filterCrazyhouseCheckbox,
                                         filterGameAmountSlider,
                                     }: SearchFilterProps) {
    return (
        <div id="optionscontainer" style={{ textAlign: "center" }}>

            <div className="filter-container">
                <h6 className={"filter-header"}>Colors:</h6>
                {
                    [
                        {imageSrc:wkIcon,imageTitle:"White",checkboxID:"WhiteCheckbox",ref:filterWhiteCheckbox},
                        {imageSrc:bkIcon,imageTitle:"Black",checkboxID:"BlackCheckbox",ref:filterBlackCheckbox}

                    ].map((item,index) => {
                        return (
                            <div className="filter-icon-checkbox-container" key={index}>
                                <input type="checkbox" id={item.checkboxID}  defaultChecked ref={item.ref}/>
                                <img title={item.imageTitle} className="filter-icon" src={item.imageSrc}  alt={item.imageTitle} />
                            </div>
                        )
                    })
                }
            </div>

            <br />

            <div className="filter-container">
                <h6 className={"filter-header"}>Game Types:</h6>
                {
                    [
                        {imageSrc:dailyIcon,imageTitle:"Daily",checkboxID:"dailyCheckbox",ref:filterDailyCheckbox},
                        {imageSrc:rapidIcon,imageTitle:"Rapid",checkboxID:"rapidCheckbox",ref:filterRapidCheckbox},
                        {imageSrc:blitzIcon,imageTitle:"Blitz",checkboxID:"blitzCheckbox",ref:filterBlitzCheckbox},
                        {imageSrc:bulletIcon,imageTitle:"Bullet",checkboxID:"bulletCheckbox",ref:filterBulletCheckbox}

                    ].map((item,index) => {
                        return (
                            <div className="filter-icon-checkbox-container" key={index}>
                                <input type="checkbox" id={item.checkboxID}  defaultChecked  ref={item.ref}/>
                                <img title={item.imageTitle} className="filter-icon" src={item.imageSrc}   alt={item.imageTitle}/>
                            </div>
                        )
                    })
                }
            </div>

            <br />

            <div className="filter-container">
                <h6 className={"filter-header"}>Game Types:</h6>
                {
                    [
                        {imageSrc:bughouseIcon,imageTitle:"Bughouse",checkboxID:"bughouseCheckbox",ref:filterBughouseCheckbox},
                        {imageSrc:chess960Icon,imageTitle:"960Chess",checkboxID:"chess960Checkbox",ref:filter960ChessCheckbox},
                        {imageSrc:threeCheckIcon,imageTitle:"Three-Check",checkboxID:"threecheckCheckbox",ref:filterThreeCheckCheckbox},
                        {imageSrc:kingOfTheHillIcon,imageTitle:"King of the hill",checkboxID:"kingofthehillCheckbox",ref:filterKotHCheckbox},
                        {imageSrc:crazyhouseIcon,imageTitle:"Crazyhouse",checkboxID:"crazyhouseCheckbox",ref:filterCrazyhouseCheckbox}
                    ].map((item,index) => {
                        return (
                            <div className="filter-icon-checkbox-container"  key={index}>
                                <input type="checkbox" id={item.checkboxID}  defaultChecked  ref={item.ref}/>
                                <img title={item.imageTitle} className="filter-icon" src={item.imageSrc}  alt={item.imageTitle}/>
                            </div>
                        )
                    })
                }
            </div>

            <br />

            <div className="filter-container">
                <h6 className={"filter-header"}>Game Amount:</h6>
                <h6 id="gameAmountSliderValue" style={{ marginTop: 6 }}>All</h6>
                <input
                    type="range"
                    id="gameAmountSlider"
                    min="0"
                    max="100"
                    defaultValue="100"
                    style={{ marginBottom: 10 }}
                    ref={filterGameAmountSlider}
                />
            </div>
        </div>
    );
}

