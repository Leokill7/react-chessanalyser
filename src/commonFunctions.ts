import {ChessPlayerProfile} from "./types";
import bronzeLeagueIcon from "./Icons/LeagueIcons/bronzeleagueIcon.svg";
import championLeagueIcon from "./Icons/LeagueIcons/championleagueIcon.svg";
import crystalLeagueIcon from "./Icons/LeagueIcons/crystalleagueIcon.svg";
import eliteLeagueIcon from "./Icons/LeagueIcons/eliteleagueIcon.svg";
import legendLeagueIcon from "./Icons/LeagueIcons/legendleagueIcon.svg";
import silverLeagueIcon from "./Icons/LeagueIcons/silverleagueIcon.svg";
import stoneLeagueIcon from "./Icons/LeagueIcons/stoneleagueIcon.svg";
import woodLeagueIcon from "./Icons/LeagueIcons/woodleagueIcon.svg";
export async function GetDataFrom(link:string) {
    const response = await fetch(link);

    if (!response.ok) {
        throw new Error(`Request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
}
export function formatUnixTimestamp(unixTimestamp:number) {
    const date = new Date(unixTimestamp * 1000);

    const year = date.getFullYear() -2000;
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${hours}:${minutes} ${day}.${month}.${year}`;
}
export function getDateFromUnitTimestamp(unixTimestamp:number) {
    const date = new Date(unixTimestamp * 1000);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${day}.${month}.${year}`;
}
export function GetFlagCoordinates(flagID:string | undefined ) {
    if(flagID === "" || flagID === undefined){
        return;
    }

    var countries = [
        ["filler","ad","ae","af","ag","ai","al","am","ao","ar","as"],
        ["at","au","aw","ax","az","ba","bb","bd","be","bf","bg"],
        ["bh","bi","bj","bm","bn","bo","br","bs","bt","bw","by"],
        ["bz","ca","cd","cf","cg","ch","ci","cl","cm","cn","co"],
        ["cr","cu","cv","cw","cy","cz","de","dj","dk","dm","do"],
        ["dz","ec","ee","eg","eh","er","es","et","eu","filler","fi"],
        ["fj","fk","fm","fo","fr","ga","xe","xs","gb","xw","gd",],
        ["ge","gf","gg","gh","gi","gl","gm","gn","gp","gq","gr"],
        ["gs","gt","gu","gw","gy","hk","hn","hr","ht","hu","id"],
        ["ie","il","im","in","iq","ir","is","it","je","jm","jo"],
        ["jp","kg","kh","ki","km","ke","kn","kp","kr","kw","ky"],
        ["kz","la","lb","lc","li","lk","lr","ls","lt","lu","lv"],
        ["ly","ma","mc","md","me","mg","mh","mk","ml","mm","mn"],
        ["mo","mq","mr","ms","mt","mu","mv","mw","mx","my","mz"],
        ["na","nc","ne","ng","ni","nl","no","np","nr","nu","nz"],
        ["om","pa","pe","pf","pg","ph","pk","pl","pm","pr","ps"],
        ["pt","pw","py","qa","re","ro","rs","ru","rw","sa","sb"],
        ["sc","sd","se","sg","si","sk","sl","sm","sn","so","sr"],
        ["ss","st","sv","sx","sy","sz","tc","td","tg","th","tj"],
        ["tl","tm","tn","to","tr","tt","tv","tw","tz","ua","ug"],
        ["us","uy","uz","va","vc","ve","vg","vi","vn","vu","ws"],
        ["xa","xb","xc","xg","xk","xt","ye","yt","za","zm","zw"],
        ["xx"]]

    let out = "0% 0%"
    let k = 0
    let j = 0
    if(flagID!=="filler"){
        for(let i=0;i<countries.length;i++){

            j = countries[i].indexOf(flagID.toLowerCase())
            k = i;
            if(j !== -1){
                break;
            }
        }
        out = j*10 + "% " + k*4+"%"
    }

    return out
}

export function GetPlayerName(playerProfile:ChessPlayerProfile|undefined){
    if(!playerProfile){return "???"}
    return playerProfile.url.split("member/")[1];
}

export function GetLeagueIcon(playerProfile:ChessPlayerProfile|undefined): string {
    switch (playerProfile?.league) {
        case "Bronze":
            return bronzeLeagueIcon;
        case "Champion":
            return championLeagueIcon;
        case "Crystal":
            return crystalLeagueIcon;
        case "Elite":
            return eliteLeagueIcon;
        case "Legend":
            return legendLeagueIcon;
        case "Silver":
            return silverLeagueIcon;
        case "Stone":
            return stoneLeagueIcon;
        case "Wood":
            return woodLeagueIcon;
    }
    return woodLeagueIcon;
}