import React, {useEffect, useState} from "react"
import {GetFlagCoordinates, GetDataFrom, formatUnixTimestamp} from "../commonFunctions";
import {useGlobal} from "../GlobalContext";
import {ChessGame, ChessPlayerProfile} from "../types";

import wkIcon from "../Icons/wk.png";
import bkIcon from "../Icons/bk.png";

import bronzeLeagueIcon from "../Icons/LeagueIcons/bronzeleagueIcon.svg";
import championLeagueIcon from "../Icons/LeagueIcons/championleagueIcon.svg";
import crystalLeagueIcon from "../Icons/LeagueIcons/crystalleagueIcon.svg";
import eliteLeagueIcon from "../Icons/LeagueIcons/eliteleagueIcon.svg";
import legendLeagueIcon from "../Icons/LeagueIcons/legendleagueIcon.svg";
import silverLeagueIcon from "../Icons/LeagueIcons/silverleagueIcon.svg";
import stoneLeagueIcon from "../Icons/LeagueIcons/stoneleagueIcon.svg";
import woodLeagueIcon from "../Icons/LeagueIcons/woodleagueIcon.svg";
import glassesIcon from "../Icons/glassesIcon.png";

import dailyIcon from "../Icons/TimeClassIcons/dailyIcon.png";
import rapidIcon from "../Icons/TimeClassIcons/rapidIcon.png";
import blitzIcon from "../Icons/TimeClassIcons/blitzIcon.png";
import bulletIcon from "../Icons/TimeClassIcons/bulletIcon.png";

function GetLeagueIcon(leagueName: string | undefined): string {
    switch (leagueName) {
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

function GetTimeClassIcon(timeClass: string): string {
    switch (timeClass) {
        case "bullet":
            return bulletIcon;
        case "blitz":
            return blitzIcon;
        case "daily":
            return dailyIcon;
        case "rapid":
            return rapidIcon;
    }
    return rapidIcon;
}

export default function MatchHistory() {
    const { global } = useGlobal();
    const [matchHistorySize, setMatchHistorySize] = useState(5);
    const [gamesToRender, setGamesToRender] = useState<{game:ChessGame,player2Profile:ChessPlayerProfile|undefined}[]>([]);
    const [visible, setVisible] = useState<boolean>(false);

    useEffect(() => {
        setVisible(false);
        let cancelled = false;
        async function GetGamesToRender() {
            let reversedGames = [...global.foundGames].reverse();

            let nextGamesToRender = (await Promise.all(
                reversedGames.slice(0, matchHistorySize).map(async (game, index) => {
                    if (global.twoPlayerSelected) {
                        return {game: game, player2Profile:global.player2Profile };
                    }else{
                        const player1IsBlack = game.black.username.toLowerCase() === global.player1Profile?.username.toLowerCase();
                        const player2Username = player1IsBlack
                            ? game.white.username
                            : game.black.username;

                        const player2ProfileInfo: ChessPlayerProfile = await GetDataFrom(
                            "https://api.chess.com/pub/player/" + player2Username.trim().toLowerCase()
                        );
                        return {game: game, player2Profile:player2ProfileInfo };
                    }
                })
            ))

            if (!cancelled) {
                setVisible(true);
                setGamesToRender(nextGamesToRender);
            }
        }
        GetGamesToRender();
        return () => {
            cancelled = true;
        };
    }, [global, matchHistorySize]);

    return (
        <div>
            <div className="games-played-text">MatchHistory</div>

            <select className="graph-select" onChange={(e) => setMatchHistorySize(Number(e.target.value))}>
                <option value={5}>5 Games</option>
                <option value={25}>25 Games</option>
                <option value={50}>50 Games</option>
                <option value={100}>100 Games</option>
            </select>

            <div style={{display: visible?"block":"none", border: "1px solid black", borderRadius: "10px", overflow:"hidden"}}>
                <div className="match-history-descr">
                    <div>Flag</div>
                    <div>League</div>
                    <div>Name/Date</div>
                    <div>Rating</div>
                    <div>Color</div>
                    <div>Acc</div>
                    <div>Mode</div>
                    <div>Moves</div>
                    <div>Result</div>
                </div>

                <div className="match-history-list-container">
                    {gamesToRender.map((gameInfo, index) =>
                    {
                        return(
                            <MatchHistoryElement
                                key={index}
                                game={gameInfo.game}
                                player2Profile={gameInfo.player2Profile}
                                gameIndex={index}
                            />
                        )
                    })}
                </div>
            </div>

        </div>)
}

function MatchHistoryElement({game, player2Profile,gameIndex}: { game: ChessGame, player2Profile: ChessPlayerProfile|undefined, gameIndex: number}) {
    const {global} = useGlobal();

    type PlayerGameInfo = {
        colorIcon: string;
        accuracy: number | undefined;
        rating: number | undefined;
    }

    const player1IsBlack = game.black.username.toLowerCase() === global.player1Profile?.username.toLowerCase();

    let result = 0;
    if (player1IsBlack) {
        if (game.black.result === "win") result = 1;
        else if (game.white.result === "win") result = 2;
    } else {
        if (game.white.result === "win") result = 1;
        else if (game.black.result === "win") result = 2;
    }

    const backgroundColor =
        result === 1
            ? "rgb(57, 103, 66)"
            : result === 2
                ? global.twoPlayerSelected
                    ? "#004F80"
                    : "rgb(198,65,65)"
                : "gray"


    const player1GameInfo: PlayerGameInfo ={
        colorIcon: player1IsBlack ? bkIcon : wkIcon,
        accuracy: player1IsBlack ? game.accuracies?.black : game.accuracies?.white,
        rating: game.rated ? player1IsBlack ? game.black.rating: game.white.rating : undefined,
    }
    const player2GameInfo: PlayerGameInfo = {
        colorIcon: player1IsBlack ? wkIcon : bkIcon,
        accuracy: player1IsBlack ? game.accuracies?.white : game.accuracies?.black,
        rating: game.rated ? player1IsBlack ? game.white.rating: game.black.rating : undefined,
    }

    let gainedRR:number |undefined = undefined;
    if(game.rated){
        let reversedGames = [...global.foundGames].reverse()
        for (let i = gameIndex+1; i < reversedGames.length; i++) {
            const gameInfo = reversedGames[i];
            if (gameInfo.rated && game.rules === gameInfo.rules && game.time_class === gameInfo.time_class) {
                const player1IsBlackInPrevious = gameInfo.black.username.toLowerCase() === global.player1Profile?.username.toLowerCase();
                const previousRR = player1IsBlackInPrevious ? gameInfo.black.rating : gameInfo.white.rating;
                if(player1GameInfo?.rating!=undefined){
                    gainedRR = player1GameInfo?.rating - previousRR;
                    break;
                }
            }
        }
    }


    function FlagIcon({countryISOCode}: { countryISOCode: string | undefined }) {
        return (
            <div
                style={{backgroundPosition: GetFlagCoordinates(countryISOCode)}}
                className="flag-div"
            />
        );
    }

    return (
        <div
            className="match-history-element"
            style={{display: "grid", backgroundColor: backgroundColor}}
        >
            <FlagIcon countryISOCode={global.player1Profile?.country.split("country/")[1]}/>

            <img
                style={{margin: "auto"}}
                className="player-league-img"
                src={GetLeagueIcon(global.player1Profile?.league)}
                alt="LeagueIcon"
            />

            <a style={{margin:"auto"}}>{global.player1Profile?.url.split("member/")[1]}</a>

            <div style={{display: "flex",justifyContent:"center",alignItems:"center",gap:"4px"}}>
                <div>{player1GameInfo?.rating ?? player1GameInfo?.rating}</div>
                {
                    gainedRR !== undefined &&
                    <div>
                        {player1GameInfo?.rating?"("+(gainedRR>0?"+":"")+gainedRR+")":""}
                    </div>
                }
            </div>

            <img
                className="player-color-img"
                style={{margin: "auto"}}
                src={player1GameInfo?.colorIcon}
                alt="ColorIcon"
            />

            <p>{player1GameInfo?.accuracy ?? "--"}</p>

            <div></div>
            <div></div>

            <p style={{margin:"auto"}} >{result === 0 ? "draw" : result === 1 ? "Win" : "Loose"}</p>

            <div></div>
            <div></div>

            <p style={{margin:"auto"}}>{formatUnixTimestamp(game.end_time)}</p>

            <a
                title="Watch game"
                href={game.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{margin:"auto"}}
            >
                <img
                    style={{height: "18px", width: "18px", marginTop: "2px"}}
                    src={glassesIcon}
                    alt="Watch game"
                />
            </a>

            <div></div>
            <div></div>

            <div style={{margin:"auto"}}>
                <img
                    title={game.time_class}
                    style={{height: "20px", width: "20px"}}
                    src={GetTimeClassIcon(game.time_class)}
                    alt={game.time_class}
                />
            </div>

            <p style={{margin:"auto"}}>{game.pgn.split("\n\n")[1].split(". ").length - 1}</p>
            <p></p>

            <FlagIcon countryISOCode={player2Profile?.country.split("country/")[1]}/>

            <img
                style={{margin: "auto"}}
                className="player-league-img"
                src={GetLeagueIcon(player2Profile?.league)}
                alt="LeagueIcon"
            />

            <a style={{margin:"auto"}}>{player2Profile ? player2Profile.url.split("member/")[1] : ""}</a>

            <div style={{margin:"auto"}}>{player2GameInfo?.rating===Number.MAX_SAFE_INTEGER?"":player2GameInfo?.rating}</div>

            <img
                className="player-color-img"
                style={{margin: "auto"}}
                src={player2GameInfo?.colorIcon}
                alt="ColorIcon"
            />

            <p style={{margin:"auto"}}>{player2GameInfo?.accuracy ?? "--"}</p>

            <div></div>
            <div></div>

            <p style={{margin:"auto"}}>{result === 0 ? "draw" : result === 1 ?"Loose":"Win"}</p>
        </div>)
}