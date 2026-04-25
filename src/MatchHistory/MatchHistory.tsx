import React, {useEffect, useState} from "react"
import {GetFlagCoordinates,GetDataFrom,formatUnixTimestamp} from "../commonFunctions.js";
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

    return (
        <div id="matchHistoryContainer">
            <div className="games-played-text">MatchHistory</div>

            <select className="graph-select" onChange={(e) => setMatchHistorySize(Number(e.target.value))}>
                <option value={5}>5 Games</option>
                <option value={25}>25 Games</option>
                <option value={50}>50 Games</option>
                <option value={100}>100 Games</option>
            </select>

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

            <div className="match-history-list-container" id="matchHistoryListContainer">
                {global.foundGames.map((game, index) =>
                {
                    if(index >= matchHistorySize)return <></>;
                    return(
                        <MatchHistoryElement
                            game={game}
                            key={index}
                        />
                    )
                }

                )}
            </div>
        </div>)
}

function MatchHistoryElement({game}: { game: ChessGame }) {
    const {global} = useGlobal();

    type PlayerGameInfo = {
        countryISOCode: string;
        colorIcon: string;
        leagueIcon: string;
        accuracy: number | undefined;
        rating: number | undefined;
    }

    const [player2Info, setPlayer2Info] = useState<ChessPlayerProfile>();
    const [player1GameInfo, setPlayer1GameInfo] = useState<PlayerGameInfo>();
    const [player2GameInfo, setPlayer2GameInfo] = useState<PlayerGameInfo>();
    const [backgroundColor, setBackgroundColor] = useState<string>("gray");
    const [result, setResult] = useState<number>(0);


    useEffect(() => {
        let cancelled = false;

        async function getPlayersInfo() {
            if (!global.player1Info) return;

            const player1IsBlack = game.black.username.toLowerCase() === global.player1Info.username.toLowerCase();
            const player1Country = global.player1Info.country?.split("country/")[1] ?? "";
            if (!cancelled) {
                let player1Rating = player1IsBlack ? game.black.rating : game.white.rating;
                setPlayer1GameInfo({
                    countryISOCode: player1Country,
                    colorIcon: player1IsBlack ? bkIcon : wkIcon,
                    leagueIcon: GetLeagueIcon(global.player1Info.league),
                    accuracy: player1IsBlack ? game.accuracies?.black : game.accuracies?.white,
                    rating: game.rated ? player1Rating : undefined,
                });
            }

            if (global.twoPlayerSelected) {
                const player2Country = global.player2Info?.country?.split("country/")[1] ?? "";
                if (!cancelled) {
                    setPlayer2Info(global.player2Info ?? undefined);
                    let player2Rating = player1IsBlack ? game.white.rating : game.black.rating;
                    setPlayer2GameInfo({
                        countryISOCode: player2Country,
                        colorIcon: player1IsBlack ? wkIcon : bkIcon,
                        leagueIcon: GetLeagueIcon(global.player2Info?.league),
                        accuracy: player1IsBlack ? game.accuracies?.white : game.accuracies?.black,
                        rating: game.rated ? player2Rating : undefined,
                    });
                }
            } else {

                const player2Username = player1IsBlack
                    ? game.white.username
                    : game.black.username;

                const player2ProfileInfo: ChessPlayerProfile = await GetDataFrom(
                    "https://api.chess.com/pub/player/" + player2Username.trim().toLowerCase()
                );

                if (!cancelled) {
                    setPlayer2Info(player2ProfileInfo);
                    let player2Rating = player1IsBlack ? game.white.rating : game.black.rating;
                    setPlayer2GameInfo({
                        countryISOCode: player2ProfileInfo?.country?.split("country/")[1],
                        colorIcon: player1IsBlack ? wkIcon : bkIcon,
                        leagueIcon: GetLeagueIcon(player2ProfileInfo.league),
                        accuracy: player1IsBlack ? game.accuracies?.white : game.accuracies?.black,
                        rating: game.rated ? player2Rating : undefined,
                    });
                }
            }

            const isPlayer1Black =
                game.black.username.toLowerCase() === global.player1Info.username.toLowerCase();

            let nextResult = 0;

            if (isPlayer1Black) {
                if (game.black.result === "win") nextResult = 1;
                else if (game.white.result === "win") nextResult = 2;
                else nextResult = 0;
            } else {
                if (game.white.result === "win") nextResult = 1;
                else if (game.black.result === "win") nextResult = 2;
                else nextResult = 0;
            }

            if (!cancelled) {
                if (nextResult === 1) setBackgroundColor(global.twoPlayerSelected ? "#004F80" : "rgb(198,65,65)")
                if (nextResult === 2) setBackgroundColor("rgb(57, 103, 66)")
                setResult(nextResult);
            }
        }

        getPlayersInfo();
        return () => {
            cancelled = true;
        };
    }, [game, global.player1Info, global.player2Info, global.twoPlayerSelected]);

    function FlagIcon({countryISOCode}: { countryISOCode: string | undefined }) {
        return (
            <div
                style={{backgroundPosition: GetFlagCoordinates(countryISOCode)}}
                className="flag-div"
            />
        );
    }

    return (<div
        className="match-history-element"
        style={{display: "grid", backgroundColor: backgroundColor}}
    >
        <FlagIcon countryISOCode={player1GameInfo?.countryISOCode}/>

        <img
            style={{margin: "auto"}}
            className="player-league-img"
            src={player1GameInfo?.leagueIcon}
            alt="LeagueIcon"
        />

        <a style={{margin:"auto"}}>{global.player1Info?.url.split("member/")[1]}</a>

        <div>{player1GameInfo?.rating ?? ""}</div>

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
            href="https://www.chess.com/game/live/145592795276"
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

        <FlagIcon countryISOCode={player2GameInfo?.countryISOCode}/>

        <img
            style={{margin: "auto"}}
            className="player-league-img"
            src={player2GameInfo?.leagueIcon}
            alt="LeagueIcon"
        />

        <a style={{margin:"auto"}}>{player2Info ? player2Info.url.split("member/")[1] : ""}</a>

        <div style={{margin:"auto"}}>{player2GameInfo?.rating ?? ""}</div>

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