import {ChessGame} from "./types";
export async function GetDataFrom(link:string) {
    return await fetch(link)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            return response.json();
        })
        .then(data => {
            return data
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}
export function formatUnixTimestamp(unixTimestamp:number) {
    const date = new Date(unixTimestamp * 1000);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}.${month}.${day} ${hours}:${minutes}`;
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
            if(j != -1){
                break;
            }
        }
        out = j*10 + "% " + k*4+"%"
    }

    return out
}