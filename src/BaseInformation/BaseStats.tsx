import {useGlobal} from "../GlobalContext";
import {GetPlayerName} from "../commonFunctions";
import { WinLossDistribution} from "../types";
import React from "react";

function GetWinsAndLosses(games: any[], player1Username: string): WinLossDistribution {
    const wins = { checkmate: 0, timeout: 0, resigned: 0, abandoned: 0, other: 0 };

    const result :WinLossDistribution = {
        p1:   { won: 0, ...structuredClone(wins) },
        p2:  { won: 0, ...structuredClone(wins) },
        drawn: { total: 0, repetition: 0, stalemate: 0, timeVsInsufficient: 0, insufficient: 0, agreed: 0 },
    };

    const getWinReason = (loserResult: string): keyof typeof wins => {
        if (loserResult === "checkmated") return "checkmate";
        if (loserResult === "timeout")    return "timeout";
        if (loserResult === "resigned")   return "resigned";
        if (loserResult === "abandoned")  return "abandoned";
        return "other";
    };

    games.forEach((game) => {
        const blackName = game.black.username.toLowerCase();
        const whiteName = game.white.username.toLowerCase();

        const isBlack = blackName === player1Username;
        const isWhite = whiteName === player1Username;

        if (!isBlack && !isWhite) return; // game doesn't involve player1

        const [myResult, opponentResult] = isBlack
            ? [game.black.result, game.white.result]
            : [game.white.result, game.black.result];

        if (myResult === "win") {
            result.p1.won++;
            result.p1[getWinReason(opponentResult)]++;
        } else if (opponentResult === "win") {
            result.p2.won++;
            result.p2[getWinReason(myResult)]++;
        } else {
            result.drawn.total++;
            const dr = result.drawn;
            const r = game.black.result;
            if (r === "repetition")              dr.repetition++;
            else if (r === "stalemate")          dr.stalemate++;
            else if (r === "timevsinsufficient") dr.timeVsInsufficient++;
            else if (r === "insufficient")       dr.insufficient++;
            else if (r === "agreed")             dr.agreed++;
        }
    });

    return result;
}


export default function BaseStatsForTwoSelected() {
    const { global, setGlobal } = useGlobal();

    if (!global.player1Profile || !global.player2Profile || global.foundGames.length === 0) {
        return <div>No games found.</div>;
    }

    const player1Username = global.player1Profile?.username.toLowerCase();
    const player2Username = global.player2Profile?.username.toLowerCase();

    const player1Accuracies = global.foundGames
        .map((game) => {
            if (!player1Username) return undefined;

            const isBlack = game.black.username.toLowerCase() === player1Username;
            const isWhite = game.white.username.toLowerCase() === player1Username;

            if (isBlack) return game.accuracies?.black;
            if (isWhite) return game.accuracies?.white;

            return undefined;
        })
        .filter((accuracy): accuracy is number => accuracy !== undefined);

    const player2Accuracies = global.foundGames
        .map((game) => {
            if (!player2Username) return undefined;

            const isBlack = game.black.username.toLowerCase() === player2Username;
            const isWhite = game.white.username.toLowerCase() === player2Username;

            if (isBlack) return game.accuracies?.black;
            if (isWhite) return game.accuracies?.white;

            return undefined;
        })
        .filter((accuracy): accuracy is number => accuracy !== undefined);

    const player2AvgAcc =
        player1Accuracies.length > 0
            ? player2Accuracies.reduce((sum, acc) => sum + acc, 0) / player2Accuracies.length
            : 0;

    const player1AvgAcc =
        player1Accuracies.length > 0
            ? player1Accuracies.reduce((sum, acc) => sum + acc, 0) / player1Accuracies.length
            : 0;

    const gameStats = global.foundGames.reduce(
        (acc, game) => {
            const moveCount = game.pgn.split("\n\n")[1].split(". ").length - 1;

            if (moveCount > acc.longestMoveCount) {
                acc.longestGame = game;
                acc.longestMoveCount = moveCount;
            }

            if (moveCount < acc.shortestMoveCount) {
                acc.shortestGame = game;
                acc.shortestMoveCount = moveCount;
            }

            acc.totalMoveCount += moveCount;
            return acc;
        },
        {
            longestGame: global.foundGames[0],
            shortestGame: global.foundGames[0],
            longestMoveCount: global.foundGames[0].pgn.split("\n\n")[1].split(". ").length - 1,
            shortestMoveCount: global.foundGames[0].pgn.split("\n\n")[1].split(". ").length - 1,
            totalMoveCount: 0,
        }
    );

    const longestGame = gameStats.longestGame;
    const longestMoveCount = gameStats.longestMoveCount;
    const averageMoveCount = gameStats.totalMoveCount / global.foundGames.length;

    return (
        <div style={{margin:"auto"}}>
            <div className="two-player-display-container">
                <div>
                    <div
                        className={"header-1"}
                        onClick={(e) => {
                            if(!global.player1Profile) return false;
                            setGlobal({popoverInfo: {posX: e.pageX, posY: e.pageY,playerProfile: global.player1Profile}})
                        }}
                        style={{cursor:"pointer"}}
                    >
                        {GetPlayerName(global.player1Profile)}
                    </div>
                    <div title={"Average Accurracy in " + player1Accuracies.length + " games"}>{player1AvgAcc.toFixed(2)} %</div>
                </div>
                <div className={"header-2"}>VS</div>
                <div>
                    <div
                        className={"header-1"}
                        onClick={(e) => {
                            if(!global.player2Profile) return false;
                            setGlobal({popoverInfo: {posX: e.pageX, posY: e.pageY,playerProfile: global.player2Profile}})
                        }}
                        style={{cursor:"pointer"}}
                    >
                        {GetPlayerName(global.player2Profile)}
                    </div>
                    <div title={"Average Accurracy in " + player2Accuracies.length + " games"}>{player2AvgAcc.toFixed(2)} %</div>
                </div>
            </div>
            <div className="header-2">
                {global.foundGames.length} games played
            </div>
            <div
                className="average-moves-text"
            >
                with an average of {averageMoveCount.toFixed(0)} moves
            </div>
            <a
                style={{fontSize: 14}}
                href={longestGame.url}
                target={"_blank"}
                rel="noreferrer"
            >
                Longest game with {longestMoveCount} moves
            </a>
        </div>
    )
}

export function BaseStatsForOneSelected() {
    const { global, setGlobal } = useGlobal();

    if (!global.player1Profile || global.foundGames.length === 0) {
        return <div>No games found.</div>;
    }

    const player1Username = global.player1Profile?.username.toLowerCase();

    const player1Accuracies = global.foundGames
        .map((game) => {
            if (!player1Username) return undefined;

            const isBlack = game.black.username.toLowerCase() === player1Username;
            const isWhite = game.white.username.toLowerCase() === player1Username;

            if (isBlack) return game.accuracies?.black;
            if (isWhite) return game.accuracies?.white;

            return undefined;
        })
        .filter((accuracy): accuracy is number => accuracy !== undefined);

    const player1AvgAcc =
        player1Accuracies.length > 0
            ? player1Accuracies.reduce((sum, acc) => sum + acc, 0) / player1Accuracies.length
            : 0;

    const gameStats = global.foundGames.reduce(
        (acc, game) => {
            if(!game.pgn){
                return acc;
            }

            const moveCount = game.pgn.split("\n\n")[1].split(". ").length - 1;

            if (moveCount > acc.longestMoveCount) {
                acc.longestGame = game;
                acc.longestMoveCount = moveCount;
            }

            if (moveCount < acc.shortestMoveCount) {
                acc.shortestGame = game;
                acc.shortestMoveCount = moveCount;
            }

            acc.totalMoveCount += moveCount;
            return acc;
        },
        {
            longestGame: global.foundGames[0],
            shortestGame: global.foundGames[0],
            longestMoveCount: global.foundGames[0].pgn.split("\n\n")[1].split(". ").length - 1,
            shortestMoveCount: global.foundGames[0].pgn.split("\n\n")[1].split(". ").length - 1,
            totalMoveCount: 0,
        }
    );

    const longestGame = gameStats.longestGame;
    const longestMoveCount = gameStats.longestMoveCount;
    const averageMoveCount = gameStats.totalMoveCount / global.foundGames.length;

    return (<div>
        <div style={{ minWidth: 0}}>
            <a
                style={{
                    display: "block",
                    overflowWrap: "anywhere",
                    wordBreak: "break-word",
                    whiteSpace: "normal",
                }}
                href={global.player1Profile?.url}
                className={"header-1"}
                target={"_blank"} rel="noreferrer"
                onClick={(e) => {
                    if(!global.player1Profile) return false;
                    setGlobal({popoverInfo: {posX: e.clientX, posY: e.clientY,playerProfile: global.player1Profile}})
                }}
            >
                {GetPlayerName(global.player1Profile)}
            </a>
            <div
                title={"Average Accuracy in " + player1Accuracies.length + " games"}
            >
                Accuracy: {player1AvgAcc.toFixed(2)} %
            </div>
        </div>
        <div
            className="header-2"
        >
            {global.foundGames.length} games played
        </div>
        <div
            className="average-moves-text"
        >
            with an average of {averageMoveCount.toFixed(0)} moves
        </div>
        <a style={{fontSize: 14}} href={longestGame.url} target={"_blank"} rel="noreferrer">Longest game with {longestMoveCount} moves</a>

    </div>)
}

export function GameResultOverviewForTwoSelected(){
    const { global } = useGlobal();
    if(!global.player1Profile || !global.player2Profile) return (<></>);

    const player1Username = global.player1Profile.username.toLowerCase();
    const player2Username = global.player2Profile.username.toLowerCase();

    const gamesWonInfo = GetWinsAndLosses(global.foundGames,player1Username);


    let gridElementsWidths = ""
    let gridElements:{color:string,gameCount:number, description:string}[] = [];

    if(gamesWonInfo.p1.checkmate > 0){
        gridElementsWidths += (gamesWonInfo.p1.checkmate / global.foundGames.length*100) + "% "
        gridElements.push({color:"var(--green1)", gameCount:gamesWonInfo.p1.checkmate, description:player1Username + " won by checkmate"})
    }
    if(gamesWonInfo.p1.timeout > 0){
        gridElementsWidths += (gamesWonInfo.p1.timeout  / global.foundGames.length*100) + "% "
        gridElements.push({color:"var(--green2)", gameCount:gamesWonInfo.p1.timeout , description:player2Username + " timed out"})
    }
    if(gamesWonInfo.p1.resigned  > 0){
        gridElementsWidths += (gamesWonInfo.p1.resigned / global.foundGames.length*100) + "% "
        gridElements.push({color:"var(--green3)", gameCount:gamesWonInfo.p1.resigned, description:player2Username + " resigned"})
    }
    if(gamesWonInfo.p1.abandoned > 0){
        gridElementsWidths += (gamesWonInfo.p1.abandoned / global.foundGames.length*100) + "% "
        gridElements.push({color:"var(--green4)", gameCount:gamesWonInfo.p1.abandoned, description:player2Username + " abandoned the game"})
    }
    if(gamesWonInfo.p1.other > 0){
        gridElementsWidths += (gamesWonInfo.p1.other / global.foundGames.length*100) + "% "
        gridElements.push({color:"var(--green5)", gameCount:gamesWonInfo.p1.other, description:player1Username + " won by other reasons"})
    }
    if(gamesWonInfo.drawn.total > 0){
        gridElementsWidths += (gamesWonInfo.drawn.total / global.foundGames.length*100) + "% "
        gridElements.push({color:"var(--grey1)", gameCount:gamesWonInfo.drawn.total,
            description:"drawn\n" + gamesWonInfo.drawn.repetition + " drawn by repetition\n" +
                gamesWonInfo.drawn.stalemate + " drawn by stalemate\n" +
                gamesWonInfo.drawn.timeVsInsufficient + " drawn by timeout vs insufficient material\n"+
                gamesWonInfo.drawn.insufficient + " drawn by insufficient material\n" +
                gamesWonInfo.drawn.agreed + " agreed to draw\n"})
    }
    if(gamesWonInfo.p2.other > 0){
        gridElementsWidths += (gamesWonInfo.p2.other / global.foundGames.length*100) + "% "
        gridElements.push({color:"var(--blue5)", gameCount:gamesWonInfo.p2.other, description:player2Username + " won by other reasons"})
    }
    if(gamesWonInfo.p2.abandoned > 0){
        gridElementsWidths += (gamesWonInfo.p2.abandoned / global.foundGames.length*100) + "% "
        gridElements.push({color:"var(--blue4)", gameCount:gamesWonInfo.p2.abandoned, description:player1Username + " abandoned the game"})
    }
    if(gamesWonInfo.p2.resigned > 0){
        gridElementsWidths += (gamesWonInfo.p2.resigned / global.foundGames.length*100) + "% "
        gridElements.push({color:"var(--blue3)", gameCount:gamesWonInfo.p2.resigned, description:player1Username + " resigned"})
    }
    if(gamesWonInfo.p2.timeout > 0){
        gridElementsWidths += (gamesWonInfo.p2.timeout / global.foundGames.length*100) + "% "
        gridElements.push({color:"var(--blue2)", gameCount:gamesWonInfo.p2.timeout, description:player1Username + " timed out"})
    }
    if(gamesWonInfo.p2.checkmate > 0){
        gridElementsWidths += (gamesWonInfo.p2.checkmate / global.foundGames.length*100).toFixed(5) + "% "
        gridElements.push({color:"var(--blue1)", gameCount:gamesWonInfo.p2.checkmate, description:player2Username + " won by checkmate"})
    }

    return(
        <div>
            <div className="games-info-container">
                <div
                    title={gamesWonInfo.p1.won+"games"}
                    className="games-percent-text"
                    style={{color:"var(--green1)",textAlign:"left"}}
                >
                    {Math.round(gamesWonInfo.p1.won/global.foundGames.length*100)}%
                </div>
                <div
                    title={gamesWonInfo.drawn.total+"games"}
                    className="games-percent-text"
                    style={{color:"var(--grey1)",textAlign:"center"}}
                >
                    {Math.round(gamesWonInfo.drawn.total/global.foundGames.length*100)}%
                </div>
                <div
                    title={gamesWonInfo.p2.won+"games"}
                    className="games-percent-text"
                    style={{color:"var(--blue1)",textAlign:"right"}}
                >
                    {Math.round(gamesWonInfo.p2.won/global.foundGames.length*100)}%
                </div>
            </div>
            <div className="games-overview-container"
                 style={{gridTemplateColumns: gridElementsWidths}}>
                {
                    gridElements.map((elementInfo, index) => {
                        return (
                            <div className="game-details-container" style={{backgroundColor:elementInfo.color, borderRight: index === gridElements.length-1 ? "0px solid black" : "1px solid black"}} title={elementInfo.gameCount + " games "+ elementInfo.description}></div>
                        )
                    })
                }
            </div>
        </div>

    )
}

export function GameResultOverviewForOneSelected(){
    const { global } = useGlobal();
    if(!global.player1Profile){return (<></>)}
    const player1Username = global.player1Profile.username.toLowerCase();

    const gamesWonInfo = GetWinsAndLosses(global.foundGames,player1Username);

    let gridElementsWidths = ""
    let gridElements:{color:string,gameCount:number, description:string}[] = [];

    if(gamesWonInfo.p1.checkmate > 0){
        gridElementsWidths += (gamesWonInfo.p1.checkmate / global.foundGames.length*100) + "% "
        gridElements.push({color:"var(--green1)", gameCount:gamesWonInfo.p1.checkmate, description:player1Username + " won by checkmate"})
    }
    if(gamesWonInfo.p1.timeout > 0){
        gridElementsWidths += (gamesWonInfo.p1.timeout / global.foundGames.length*100) + "% "
        gridElements.push({color:"var(--green2)", gameCount:gamesWonInfo.p1.timeout, description:"opponent timed out"})
    }
    if(gamesWonInfo.p1.resigned > 0){
        gridElementsWidths += (gamesWonInfo.p1.resigned / global.foundGames.length*100) + "% "
        gridElements.push({color:"var(--green3)", gameCount:gamesWonInfo.p1.resigned, description:"opponent resigned"})
    }
    if(gamesWonInfo.p1.abandoned > 0){
        gridElementsWidths += (gamesWonInfo.p1.abandoned / global.foundGames.length*100) + "% "
        gridElements.push({color:"var(--green4)", gameCount:gamesWonInfo.p1.abandoned, description:"opponent abandoned the game"})
    }
    if(gamesWonInfo.p1.other > 0){
        gridElementsWidths += (gamesWonInfo.p1.other / global.foundGames.length*100) + "% "
        gridElements.push({color:"var(--green5)", gameCount:gamesWonInfo.p1.other, description:player1Username + " won by other reasons"})
    }
    if(gamesWonInfo.drawn.total > 0){
        gridElementsWidths += (gamesWonInfo.drawn.total / global.foundGames.length*100) + "% "
        gridElements.push({color:"var(--grey1)", gameCount:gamesWonInfo.drawn.total,
            description:"drawn\n" + gamesWonInfo.drawn.repetition + " drawn by repetition\n" +
                gamesWonInfo.drawn.stalemate + " drawn by stalemate\n" +
                gamesWonInfo.drawn.timeVsInsufficient + " drawn by timeout vs insufficient material\n"+
                gamesWonInfo.drawn.insufficient + " drawn by insufficient material\n" +
                gamesWonInfo.drawn.agreed + " agreed to draw\n"})
    }
    if(gamesWonInfo.p2.other > 0){
        gridElementsWidths += (gamesWonInfo.p2.other / global.foundGames.length*100) + "% "
        gridElements.push({color:"var(--red5)", gameCount:gamesWonInfo.p2.other, description:"opponent won by other reasons"})
    }
    if(gamesWonInfo.p2.abandoned > 0){
        gridElementsWidths += (gamesWonInfo.p2.abandoned / global.foundGames.length*100) + "% "
        gridElements.push({color:"var(--red4)", gameCount:gamesWonInfo.p2.abandoned, description:player1Username + " abandoned the game"})
    }
    if(gamesWonInfo.p2.resigned > 0){
        gridElementsWidths += (gamesWonInfo.p2.resigned / global.foundGames.length*100) + "% "
        gridElements.push({color:"var(--red3)", gameCount:gamesWonInfo.p2.resigned, description:player1Username + " resigned"})
    }
    if(gamesWonInfo.p2.timeout > 0){
        gridElementsWidths += (gamesWonInfo.p2.timeout / global.foundGames.length*100) + "% "
        gridElements.push({color:"var(--red2)", gameCount:gamesWonInfo.p2.timeout, description:player1Username + " timed out"})
    }
    if(gamesWonInfo.p2.checkmate > 0){
        gridElementsWidths += (gamesWonInfo.p2.checkmate / global.foundGames.length*100).toFixed(5) + "% "
        gridElements.push({color:"var(--red1)", gameCount:gamesWonInfo.p2.checkmate, description:"opponent won by checkmate"})
    }

    return(
        <div>
            <div className="games-info-container">
                <div
                    title={gamesWonInfo.p1.won+"games"}
                    className="games-percent-text"
                    style={{color:"var(--green1)",textAlign:"left"}}
                >
                    {Math.round(gamesWonInfo.p1.won / global.foundGames.length * 100) }%
                </div>
                <div
                    title={gamesWonInfo.drawn.total+"games"}
                    className="games-percent-text"
                    style={{color:"var(--grey1)",textAlign:"center"}}
                >
                    {Math.round(gamesWonInfo.drawn.total/global.foundGames.length*100)}%
                </div>
                <div
                    title={gamesWonInfo.p2.won+"games"}
                    className="games-percent-text"
                    style={{color:"var(--red1)",textAlign:"right"}}
                >
                    {Math.round(gamesWonInfo.p2.won/global.foundGames.length*100)}%
                </div>
            </div>
            <div className="games-overview-container"
                 style={{gridTemplateColumns: gridElementsWidths}}>
                {
                    gridElements.map((elementInfo, index) => {
                        return (
                            <div
                                key={index}
                                className="game-details-container"
                                style={{backgroundColor:elementInfo.color, borderRight: index === gridElements.length-1 ? "0px solid black" : "1px solid black"}}
                                title={elementInfo.gameCount + " games "+ elementInfo.description}/>
                        )
                    })
                }
            </div>
        </div>

    )
}