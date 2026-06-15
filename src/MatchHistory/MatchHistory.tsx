import React, {useEffect, useState} from "react"
import { GetDataFrom, formatUnixTimestamp, GetPlayerName, GetLeagueIcon} from "../commonFunctions";
import {useGlobal} from "../GlobalContext";
import {ChessGame, ChessPlayerProfile} from "../types";

import wkIcon from "../Icons/wk.png";
import bkIcon from "../Icons/bk.png";

import glassesIcon from "../Icons/glassesIcon.png";

import dailyIcon from "../Icons/TimeClassIcons/dailyIcon.png";
import rapidIcon from "../Icons/TimeClassIcons/rapidIcon.png";
import blitzIcon from "../Icons/TimeClassIcons/blitzIcon.png";
import bulletIcon from "../Icons/TimeClassIcons/bulletIcon.png";
import FlagIcon from "../Components/FlagIcon";

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
    const [matchHistorySize, setMatchHistorySize] = useState(() => {
        const stored = Number(localStorage.getItem("selectedMatchHistorySize"));
        return stored || 5;
    });
    const [gamesToRender, setGamesToRender] = useState<{game:ChessGame,player2Profile:ChessPlayerProfile|undefined}[]>([]);
    const [visible, setVisible] = useState<boolean>(false);

    useEffect(() => {
        setVisible(false);
        let cancelled = false;
        async function GetGamesToRender() {
            let reversedGames = [...global.foundGames].reverse();

            let nextGamesToRender = (await Promise.all(
                reversedGames.slice(0, matchHistorySize).map(async (game) => {
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
    }, [global.player2Profile,
        global.player1Profile,
        global.twoPlayerSelected,
        global.foundGames,
        matchHistorySize]);

    const handleGraphChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = Number(e.target.value);
        setMatchHistorySize(value);
        localStorage.setItem("selectedMatchHistorySize", value.toString());
    };

    return (
        <div>
            <div className="header-2">MatchHistory</div>

            <select
                className="select"
                onChange={handleGraphChange}
                value={matchHistorySize}
                id={"matchHistorySizeSelect"}
            >
                <option value={5}>5 Games</option>
                <option value={25}>25 Games</option>
                <option value={50}>50 Games</option>
                <option value={100}>100 Games</option>
            </select>
            <div style={{
                height: "var(--match-history-height)",
                ...(!visible ? {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                } : {})
            }}>
                <div className="spinner" style={{ display: visible?"none":"block" }} />
                <div className="match-history-container" style={{display: visible?"block":"none"}}>
                    <div className="match-history-descr">
                        <div></div>
                        <div></div>
                        <div>Name</div>
                        <div title={"Rating points"}>RP</div>
                        <div>Acc</div>
                        <div>Moves</div>
                        <div></div>
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
            </div>


        </div>)
}

function MatchHistoryElement({game, player2Profile,gameIndex}: { game: ChessGame, player2Profile: ChessPlayerProfile|undefined, gameIndex: number}) {
    const {global, setGlobal} = useGlobal();

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
                if(player1GameInfo?.rating!==undefined){
                    gainedRR = player1GameInfo?.rating - previousRR;
                    break;
                }
            }
        }
    }

    return (
        <div
            className="match-history-element"
            style={{ backgroundColor: backgroundColor}}
        >
            <FlagIcon countryISOCode={global.player1Profile?.country.split("country/")[1]}/>

            <img
                style={{margin: "auto"}}
                className="player-league-img"
                src={GetLeagueIcon(global.player1Profile)}
                alt="LeagueIcon"
            />

            <div
                style={{margin:"auto", cursor: "pointer"}}
                onClick={(e) => {
                    if(!global.player1Profile) return false;
                    setGlobal({popoverInfo: {posX: e.pageX, posY: e.pageY,playerProfile: global.player1Profile}})
                }}
            >
                {GetPlayerName(global.player1Profile)}
            </div>

            <div
                style={{display: "flex",justifyContent:"center",alignItems:"center",gap:"4px"}}
            >
                <div>{player1GameInfo?.rating ?? player1GameInfo?.rating}</div>
                {
                    gainedRR !== undefined &&
                    <div>
                        {player1GameInfo?.rating?(gainedRR>0?"+":"")+gainedRR:""}
                    </div>
                }
            </div>


            <p style={{margin:"auto"}}>{player1GameInfo?.accuracy ?? "--"}</p>

            <div></div>
            <img
                className="player-color-img"
                style={{margin: "auto"}}
                src={player1GameInfo?.colorIcon}
                alt="ColorIcon"
            />


            <div></div>
            <div></div>

            <p style={{margin:"auto", overflow:"hidden"}}>{formatUnixTimestamp(game.end_time)}</p>

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

            <p style={{margin:"auto"}}>
                {game.pgn.split("\n\n")[1].split(". ").length - 1}
            </p>

            <div style={{margin:"auto"}}>
                <img
                    title={game.time_class}
                    style={{height: "20px", width: "20px"}}
                    src={GetTimeClassIcon(game.time_class)}
                    alt={game.time_class}
                />
            </div>

            <FlagIcon countryISOCode={player2Profile?.country.split("country/")[1]}/>

            <img
                style={{margin: "auto"}}
                className="player-league-img"
                src={GetLeagueIcon(player2Profile)}
                alt="LeagueIcon"
            />

            <div
                style={{margin:"auto", cursor: "pointer"}}
                onClick={(e) => {
                    if(!player2Profile) return false;
                    setGlobal({popoverInfo: {posX: e.pageX, posY: e.pageY,playerProfile: player2Profile}})
                }}
            >
                {GetPlayerName(player2Profile)}
            </div>

            <div style={{margin:"auto"}}>{player2GameInfo?.rating===Number.MAX_SAFE_INTEGER?"":player2GameInfo?.rating}</div>

            <p style={{margin:"auto"}}>{player2GameInfo?.accuracy ?? "--"}</p>

            <div></div>
            <img
                className="player-color-img"
                style={{margin: "auto"}}
                src={player2GameInfo?.colorIcon}
                alt="ColorIcon"
            />
        </div>)
}