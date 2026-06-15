import {GetFlagCoordinates} from "../commonFunctions";
import React from "react";

export default function FlagIcon({countryISOCode}: { countryISOCode: string | undefined }) {
    if(countryISOCode === undefined) {
        return (<></>);
    }
    return (
        <div
            style={{backgroundPosition: GetFlagCoordinates(countryISOCode)}}
            className="flag-div"
        />
    );
}