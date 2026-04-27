import {useGlobal} from "../GlobalContext";
import {GetFlagCoordinates, GetDataFrom, formatUnixTimestamp} from "../commonFunctions";
export default function BaseStatsForTwoSelected() {
    const { global } = useGlobal();

    if (!global.player1Profile || !global.player2Profile || global.foundGames.length === 0) {
        return <div>No games found.</div>;
    }

    const player1Name = global.player1Profile?.url.split("member/")[1];
    const player2Name = global.player2Profile?.url.split("member/")[1];

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
                console.log(acc.longestMoveCount)
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
    const shortestGame = gameStats.shortestGame;
    const longestMoveCount = gameStats.longestMoveCount;
    const shortestMoveCount = gameStats.shortestMoveCount;
    const averageMoveCount = gameStats.totalMoveCount / global.foundGames.length;

    return (<div>
        <div className="two-player-display-container">
            <div><a href={global.player1Profile?.url} style={{fontSize:"xx-large",fontWeight: 800}} target={"_blank"} rel="noreferrer">{player1Name}</a>
                <div title={"Average Accurracy in " + player1Accuracies.length + " games"}>{player1AvgAcc.toFixed(2)} %</div>
            </div>
            <div style={{fontSize:"xx-large",fontWeight: 800,margin:"auto"}}>VS</div>
            <div>
                <a href={global.player2Profile?.url} style={{fontSize:"xx-large",fontWeight: 800}} target={"_blank"} rel="noreferrer">{player2Name}</a>
                <div title={"Average Accurracy in " + player2Accuracies.length + " games"}>{player2AvgAcc.toFixed(2)} %</div>
            </div>
        </div>
        <div className="games-played-text">{global.foundGames.length} games played</div>
        <div className="average-moves-text">with an average of {averageMoveCount.toFixed(0)} moves
        </div>
        <a style={{fontSize: 14}} href={longestGame.url} target={"_blank"} rel="noreferrer">Longest game with {longestMoveCount} moves</a>

    </div>)
}

export function BaseStatsForOneSelected() {
    const { global } = useGlobal();

    if (!global.player1Profile || global.foundGames.length === 0) {
        return <div>No games found.</div>;
    }

    const player1Name = global.player1Profile?.url.split("member/")[1];

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
            const moveCount = game.pgn.split("\n\n")[1].split(". ").length - 1;

            if (moveCount > acc.longestMoveCount) {
                acc.longestGame = game;
                acc.longestMoveCount = moveCount;
                console.log(acc.longestMoveCount)
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
    const shortestGame = gameStats.shortestGame;
    const longestMoveCount = gameStats.longestMoveCount;
    const shortestMoveCount = gameStats.shortestMoveCount;
    const averageMoveCount = gameStats.totalMoveCount / global.foundGames.length;

    return (<div>
        <div className="one-player-display-container">
            <div><a href={global.player1Profile?.url} style={{fontSize:"xx-large",fontWeight: 800}} target={"_blank"} rel="noreferrer">{player1Name}</a>
                <div title={"Average Accuracy in " + player1Accuracies.length + " games"}>Accuracy: {player1AvgAcc.toFixed(2)} %</div>
            </div>
        </div>
        <div className="games-played-text">{global.foundGames.length} games played</div>
        <div className="average-moves-text">with an average of {averageMoveCount.toFixed(0)} moves
        </div>
        <a style={{fontSize: 14}} href={longestGame.url} target={"_blank"} rel="noreferrer">Longest game with {longestMoveCount} moves</a>

    </div>)
}

export function GameResultOverviewForTwoSelected(){
    const { global } = useGlobal();
    const player1Username = global.player1Profile?.username.toLowerCase();
    const player2Username = global.player2Profile?.username.toLowerCase();

    let gamesP1Won = 0;
    let gamesP1WonByCheckmate = 0;
    let gamesP1WonByTimeout = 0;
    let gamesP1WonByResigned = 0;
    let gamesP1WonByAbandoned = 0;
    let gamesP1WonByOther = 0;

    let gamesP2Won = 0;
    let gamesP2WonByCheckmate = 0;
    let gamesP2WonByTimeout = 0;
    let gamesP2WonByResigned = 0;
    let gamesP2WonByAbandoned = 0;
    let gamesP2WonByOther = 0;

    let gamesDrawn = 0
    let gamesDrawnByRepetition = 0;
    let gamesDrawnByStalemate = 0;
    let gamesDrawnByTimeVsInsufficient = 0;
    let gamesDrawnByInsufficient = 0;
    let gamesDrawnByAgreed = 0;

    global.foundGames.forEach((game) => {
        if((game.black.username.toLowerCase() === player1Username && game.black.result === "win" )){
            gamesP1Won += 1;
            if(game.black.username.toLowerCase() === player1Username && game.white.result === "checkmated" ){
                gamesP1WonByCheckmate += 1;
            }else if(game.black.username.toLowerCase() === player1Username && game.white.result === "timeout"){
                gamesP1WonByTimeout += 1;
            }else if(game.black.username.toLowerCase() === player1Username && game.white.result === "resigned"){
                gamesP1WonByResigned += 1;
            }else if(game.black.username.toLowerCase() === player1Username && game.white.result === "abandoned"){
                gamesP1WonByAbandoned += 1;
            }else{
                gamesP1WonByOther += 1;
            }
        }else if(game.white.username.toLowerCase() === player1Username && game.white.result === "win"){
            gamesP1Won += 1;
            if(game.white.username.toLowerCase() === player1Username && game.black.result === "checkmated"){
                gamesP1WonByCheckmate += 1;
            }else if(game.white.username.toLowerCase() === player1Username && game.black.result === "timeout"){
                gamesP1WonByTimeout += 1;
            }else if(game.white.username.toLowerCase() === player1Username && game.black.result === "resigned"){
                gamesP1WonByResigned += 1;
            }else if(game.white.username.toLowerCase() === player1Username && game.black.result === "abandoned"){
                gamesP1WonByAbandoned += 1;
            }else{
                gamesP1WonByOther += 1;
            }
        }else if((game.black.username.toLowerCase() === player2Username && game.black.result === "win" )){
            gamesP2Won += 1;
            if(game.black.username.toLowerCase() === player2Username && game.white.result === "checkmated" ){
                gamesP2WonByCheckmate += 1;
            }else if(game.black.username.toLowerCase() === player2Username && game.white.result === "timeout"){
                gamesP2WonByTimeout += 1;
            }else if(game.black.username.toLowerCase() === player2Username && game.white.result === "resigned"){
                gamesP2WonByResigned += 1;
            }else if(game.black.username.toLowerCase() === player2Username && game.white.result === "abandoned"){
                gamesP2WonByAbandoned += 1;
            }else{
                gamesP2WonByOther += 1;
            }
        }else if(game.white.username.toLowerCase() === player2Username && game.white.result === "win"){
            gamesP2Won += 1;
            if(game.white.username.toLowerCase() === player2Username && game.black.result === "checkmated"){
                gamesP2WonByCheckmate += 1;
            }else if(game.white.username.toLowerCase() === player2Username && game.black.result === "timeout"){
                gamesP2WonByTimeout += 1;
            }else if(game.white.username.toLowerCase() === player2Username && game.black.result === "resigned"){
                gamesP2WonByResigned += 1;
            }else if(game.white.username.toLowerCase() === player2Username && game.black.result === "abandoned"){
                gamesP2WonByAbandoned += 1;
            }else{
                gamesP2WonByOther += 1;
            }
        }else{
            gamesDrawn += 1;
            if(game.black.result === "repetition"){
                gamesDrawnByRepetition += 1;
            }else if(game.black.result === "stalemate"){
                gamesDrawnByStalemate += 1;
            }else if(game.black.result === "timevsinsufficient"){
                gamesDrawnByTimeVsInsufficient += 1;
            }else if(game.black.result === "insufficient"){
                gamesDrawnByInsufficient += 1;
            }else if(game.black.result === "agreed"){
                gamesDrawnByAgreed += 1;
            }
        }
    })

    let gridElementsWidths = ""
    let gridElements:{color:string,gameCount:number, description:string}[] = [];

    if(gamesP1WonByCheckmate > 0){
        gridElementsWidths += (gamesP1WonByCheckmate / global.foundGames.length*100) + "% "
        gridElements.push({color:"var(--green1)", gameCount:gamesP1WonByCheckmate, description:player1Username + " won by checkmate"})
    }
    if(gamesP1WonByTimeout > 0){
        gridElementsWidths += (gamesP1WonByTimeout / global.foundGames.length*100) + "% "
        gridElements.push({color:"var(--green2)", gameCount:gamesP1WonByTimeout, description:player2Username + " timed out"})
    }
    if(gamesP1WonByResigned > 0){
        gridElementsWidths += (gamesP1WonByResigned / global.foundGames.length*100) + "% "
        gridElements.push({color:"var(--green3)", gameCount:gamesP1WonByResigned, description:player2Username + " resigned"})
    }
    if(gamesP1WonByAbandoned > 0){
        gridElementsWidths += (gamesP1WonByAbandoned / global.foundGames.length*100) + "% "
        gridElements.push({color:"var(--green4)", gameCount:gamesP1WonByAbandoned, description:player2Username + " abandoned the game"})
    }
    if(gamesP1WonByOther > 0){
        gridElementsWidths += (gamesP1WonByOther / global.foundGames.length*100) + "% "
        gridElements.push({color:"var(--green5)", gameCount:gamesP1WonByOther, description:player1Username + " won by other reasons"})
    }
    if(gamesDrawn > 0){
        gridElementsWidths += (gamesDrawn / global.foundGames.length*100) + "% "
        gridElements.push({color:"var(--grey1)", gameCount:gamesDrawn,
            description:"drawn\n" + gamesDrawnByRepetition + " drawn by repetition\n" +
                gamesDrawnByRepetition + " drawn by repetition\n" +
                gamesDrawnByStalemate + " drawn by stalemate\n" +
                gamesDrawnByTimeVsInsufficient + " drawn by timeout vs insufficient material\n"+
                gamesDrawnByInsufficient + " drawn by insufficient material\n" +
                gamesDrawnByAgreed + " agreed to draw\n"})
    }
    if(gamesP2WonByOther > 0){
        gridElementsWidths += (gamesP2WonByOther / global.foundGames.length*100) + "% "
        gridElements.push({color:"var(--blue5)", gameCount:gamesP2WonByOther, description:player2Username + " won by other reasons"})
    }
    if(gamesP2WonByAbandoned > 0){
        gridElementsWidths += (gamesP2WonByAbandoned / global.foundGames.length*100) + "% "
        gridElements.push({color:"var(--blue4)", gameCount:gamesP2WonByAbandoned, description:player1Username + " abandoned the game"})
    }
    if(gamesP2WonByResigned > 0){
        gridElementsWidths += (gamesP2WonByResigned / global.foundGames.length*100) + "% "
        gridElements.push({color:"var(--blue3)", gameCount:gamesP2WonByResigned, description:player1Username + " resigned"})
    }
    if(gamesP2WonByTimeout > 0){
        gridElementsWidths += (gamesP2WonByTimeout / global.foundGames.length*100) + "% "
        gridElements.push({color:"var(--blue2)", gameCount:gamesP2WonByTimeout, description:player1Username + " timed out"})
    }
    if(gamesP2WonByCheckmate > 0){
        gridElementsWidths += (gamesP2WonByCheckmate / global.foundGames.length*100).toFixed(5) + "% "
        gridElements.push({color:"var(--blue1)", gameCount:gamesP2WonByCheckmate, description:player2Username + " won by checkmate"})
    }

    return(
        <div>
            <div className="games-info-container">
                <div title={gamesP1Won+"games"} className="games-percent-text" style={{color:"var(--green1)",textAlign:"left"}}>{(gamesP1Won/global.foundGames.length*100).toFixed(0)}%</div>
                <div title={gamesDrawn+"games"} className="games-percent-text" style={{color:"var(--grey1)",textAlign:"center"}}>{(gamesDrawn/global.foundGames.length*100).toFixed(0)}%</div>
                <div title={gamesP2Won+"games"} className="games-percent-text" style={{color:"var(--blue1)",textAlign:"right"}}>{(gamesP2Won/global.foundGames.length*100).toFixed(0)}%</div>
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
    const player1Username = global.player1Profile?.username.toLowerCase();

    let gamesP1Won = 0;
    let gamesP1WonByCheckmate = 0;
    let gamesP1WonByTimeout = 0;
    let gamesP1WonByResigned = 0;
    let gamesP1WonByAbandoned = 0;
    let gamesP1WonByOther = 0;

    let gamesP1Lost = 0;
    let gamesP1LostByCheckmate = 0;
    let gamesP1LostByTimeout = 0;
    let gamesP1LostByResigned = 0;
    let gamesP1LostByAbandoned = 0;
    let gamesP1LostByOther = 0;

    let gamesDrawn = 0
    let gamesDrawnByRepetition = 0;
    let gamesDrawnByStalemate = 0;
    let gamesDrawnByTimeVsInsufficient = 0;
    let gamesDrawnByInsufficient = 0;
    let gamesDrawnByAgreed = 0;

    global.foundGames.forEach((game) => {
        if((game.black.username.toLowerCase() === player1Username && game.black.result === "win" )){
            gamesP1Won += 1;
            if(game.black.username.toLowerCase() === player1Username && game.white.result === "checkmated" ){
                gamesP1WonByCheckmate += 1;
            }else if(game.black.username.toLowerCase() === player1Username && game.white.result === "timeout"){
                gamesP1WonByTimeout += 1;
            }else if(game.black.username.toLowerCase() === player1Username && game.white.result === "resigned"){
                gamesP1WonByResigned += 1;
            }else if(game.black.username.toLowerCase() === player1Username && game.white.result === "abandoned"){
                gamesP1WonByAbandoned += 1;
            }else{
                gamesP1WonByOther += 1;
            }
        }else if(game.white.username.toLowerCase() === player1Username && game.white.result === "win"){
            gamesP1Won += 1;
            if(game.white.username.toLowerCase() === player1Username && game.black.result === "checkmated"){
                gamesP1WonByCheckmate += 1;
            }else if(game.white.username.toLowerCase() === player1Username && game.black.result === "timeout"){
                gamesP1WonByTimeout += 1;
            }else if(game.white.username.toLowerCase() === player1Username && game.black.result === "resigned"){
                gamesP1WonByResigned += 1;
            }else if(game.white.username.toLowerCase() === player1Username && game.black.result === "abandoned"){
                gamesP1WonByAbandoned += 1;
            }else{
                gamesP1WonByOther += 1;
            }
        }else if((game.black.username.toLowerCase() !== player1Username && game.black.result === "win" )){
            gamesP1Lost += 1;
            if(game.black.username.toLowerCase() !== player1Username && game.white.result === "checkmated" ){
                gamesP1LostByCheckmate += 1;
            }else if(game.black.username.toLowerCase() !== player1Username && game.white.result === "timeout"){
                gamesP1LostByTimeout += 1;
            }else if(game.black.username.toLowerCase() !== player1Username && game.white.result === "resigned"){
                gamesP1LostByResigned += 1;
            }else if(game.black.username.toLowerCase() !== player1Username && game.white.result === "abandoned"){
                gamesP1LostByAbandoned += 1;
            }else{
                gamesP1LostByOther += 1;
            }
        }else if(game.white.username.toLowerCase() !== player1Username && game.white.result === "win"){
            gamesP1Lost += 1;
            if(game.white.username.toLowerCase() !== player1Username && game.black.result === "checkmated"){
                gamesP1LostByCheckmate += 1;
            }else if(game.white.username.toLowerCase() !== player1Username && game.black.result === "timeout"){
                gamesP1LostByTimeout += 1;
            }else if(game.white.username.toLowerCase() !== player1Username && game.black.result === "resigned"){
                gamesP1LostByResigned += 1;
            }else if(game.white.username.toLowerCase() !== player1Username && game.black.result === "abandoned"){
                gamesP1LostByAbandoned += 1;
            }else{
                gamesP1LostByOther += 1;
            }
        }else{
            gamesDrawn += 1;
            if(game.black.result === "repetition"){
                gamesDrawnByRepetition += 1;
            }else if(game.black.result === "stalemate"){
                gamesDrawnByStalemate += 1;
            }else if(game.black.result === "timevsinsufficient"){
                gamesDrawnByTimeVsInsufficient += 1;
            }else if(game.black.result === "insufficient"){
                gamesDrawnByInsufficient += 1;
            }else if(game.black.result === "agreed"){
                gamesDrawnByAgreed += 1;
            }
        }
    })

    let gridElementsWidths = ""
    let gridElements:{color:string,gameCount:number, description:string}[] = [];

    if(gamesP1WonByCheckmate > 0){
        gridElementsWidths += (gamesP1WonByCheckmate / global.foundGames.length*100) + "% "
        gridElements.push({color:"var(--green1)", gameCount:gamesP1WonByCheckmate, description:player1Username + " won by checkmate"})
    }
    if(gamesP1WonByTimeout > 0){
        gridElementsWidths += (gamesP1WonByTimeout / global.foundGames.length*100) + "% "
        gridElements.push({color:"var(--green2)", gameCount:gamesP1WonByTimeout, description:"opponent timed out"})
    }
    if(gamesP1WonByResigned > 0){
        gridElementsWidths += (gamesP1WonByResigned / global.foundGames.length*100) + "% "
        gridElements.push({color:"var(--green3)", gameCount:gamesP1WonByResigned, description:"opponent resigned"})
    }
    if(gamesP1WonByAbandoned > 0){
        gridElementsWidths += (gamesP1WonByAbandoned / global.foundGames.length*100) + "% "
        gridElements.push({color:"var(--green4)", gameCount:gamesP1WonByAbandoned, description:"opponent abandoned the game"})
    }
    if(gamesP1WonByOther > 0){
        gridElementsWidths += (gamesP1WonByOther / global.foundGames.length*100) + "% "
        gridElements.push({color:"var(--green5)", gameCount:gamesP1WonByOther, description:player1Username + " won by other reasons"})
    }
    if(gamesDrawn > 0){
        gridElementsWidths += (gamesDrawn / global.foundGames.length*100) + "% "
        gridElements.push({color:"var(--grey1)", gameCount:gamesDrawn,
            description:"drawn\n" + gamesDrawnByRepetition + " drawn by repetition\n" +
                gamesDrawnByRepetition + " drawn by repetition\n" +
                gamesDrawnByStalemate + " drawn by stalemate\n" +
                gamesDrawnByTimeVsInsufficient + " drawn by timeout vs insufficient material\n"+
                gamesDrawnByInsufficient + " drawn by insufficient material\n" +
                gamesDrawnByAgreed + " agreed to draw\n"})
    }
    if(gamesP1LostByOther > 0){
        gridElementsWidths += (gamesP1LostByOther / global.foundGames.length*100) + "% "
        gridElements.push({color:"var(--red5)", gameCount:gamesP1LostByOther, description:"opponent won by other reasons"})
    }
    if(gamesP1LostByAbandoned > 0){
        gridElementsWidths += (gamesP1LostByAbandoned / global.foundGames.length*100) + "% "
        gridElements.push({color:"var(--red4)", gameCount:gamesP1LostByAbandoned, description:player1Username + " abandoned the game"})
    }
    if(gamesP1LostByResigned > 0){
        gridElementsWidths += (gamesP1LostByResigned / global.foundGames.length*100) + "% "
        gridElements.push({color:"var(--red3)", gameCount:gamesP1LostByResigned, description:player1Username + " resigned"})
    }
    if(gamesP1LostByTimeout > 0){
        gridElementsWidths += (gamesP1LostByTimeout / global.foundGames.length*100) + "% "
        gridElements.push({color:"var(--red2)", gameCount:gamesP1LostByTimeout, description:player1Username + " timed out"})
    }
    if(gamesP1LostByCheckmate > 0){
        gridElementsWidths += (gamesP1LostByCheckmate / global.foundGames.length*100).toFixed(5) + "% "
        gridElements.push({color:"var(--red1)", gameCount:gamesP1LostByCheckmate, description:"opponent won by checkmate"})
    }

    return(
        <div>
            <div className="games-info-container">
                <div title={gamesP1Won+"games"} className="games-percent-text" style={{color:"var(--green1)",textAlign:"left"}}>{(gamesP1Won/global.foundGames.length*100).toFixed(0)}%</div>
                <div title={gamesDrawn+"games"} className="games-percent-text" style={{color:"var(--grey1)",textAlign:"center"}}>{(gamesDrawn/global.foundGames.length*100).toFixed(0)}%</div>
                <div title={gamesP1Lost+"games"} className="games-percent-text" style={{color:"var(--red1)",textAlign:"right"}}>{(gamesP1Lost/global.foundGames.length*100).toFixed(0)}%</div>
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