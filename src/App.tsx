import React, { useEffect,  useState} from 'react';
import {GetDataFrom} from "./commonFunctions";
import SearchFilter from "./SearchFilter/SearchFilter";
import MatchHistory from "./MatchHistory/MatchHistory";
import ChartWrapper from "./Charts/ChartWrapper";
import {useGlobal} from "./GlobalContext";
import {ChessGame} from "./types";
import BaseStatsForTwoSelected, {
    BaseStatsForOneSelected,
    GameResultOverviewForOneSelected,
    GameResultOverviewForTwoSelected
} from "./BaseInformation/BaseStats";
import { useSearchParams } from 'react-router-dom';
import PlayerProfilePopover from "./PlayerProfilePopover";

async function getAllGamesOf(playerName:string) {
    if(playerName === undefined){
        return []
    }
    try{
        let links = await GetDataFrom("https://api.chess.com/pub/player/"+ playerName+"/games/archives");
        links = links.archives;
        let games: any[] = [];
        const gamesArray = await getAllMonthGames(links)

        for(let i = 0; i < gamesArray.length; i++){
            if(!gamesArray[i]){continue}
            gamesArray[i].games.forEach((game: any) => {
                games.push(game)
            })
        }
        return games;
    }catch(e){
        console.error(e)
    }
    return []
}
async function getAllMonthGames(links: string[]){
    const results = await Promise.allSettled(links.map(GetDataFrom));

    return results.map((result, index) => {
        if (result.status === "fulfilled") {
            return result.value;
        }

        console.error(`Request failed for ${links[index]}:`, result.reason);
        return null;
    });
}

function App() {
    const [searchParams, setSearchParams] = useSearchParams();
    const { global, setGlobal } = useGlobal();
    const [optionsVisible,setOptionsVisible] = useState(false);
    const [resultsVisible,setResultsVisible] = useState(false);
    const [fetchingData,setFetchingData] = useState(false);

    const [player1NameInputValue,setPlayer1NameInputValue] = useState<string>(searchParams.get("player1Name") ?? "");
    const [player2NameInputValue,setPlayer2NameInputValue] = useState<string>(searchParams.get("player2Name") ?? "");

    const [nonRankedChecked, setNonRankedChecked]   = useState<boolean>(searchParams.get("nonRankedChecked")   !== "false");
    const [rankedChecked, setRankedChecked]         = useState<boolean>(searchParams.get("rankedChecked")       !== "false");
    const [whiteChecked, setWhiteChecked]           = useState<boolean>(searchParams.get("whiteChecked")        !== "false");
    const [blackChecked, setBlackChecked]           = useState<boolean>(searchParams.get("blackChecked")        !== "false");
    const [dailyChecked, setDailyChecked]           = useState<boolean>(searchParams.get("dailyChecked")        !== "false");
    const [rapidChecked, setRapidChecked]           = useState<boolean>(searchParams.get("rapidChecked")        !== "false");
    const [blitzChecked, setBlitzChecked]           = useState<boolean>(searchParams.get("blitzChecked")        !== "false");
    const [bulletChecked, setBulletChecked]         = useState<boolean>(searchParams.get("bulletChecked")       !== "false");
    const [bughouseChecked, setBughouseChecked]     = useState<boolean>(searchParams.get("bughouseChecked")     !== "false");
    const [chess960Checked, setChess960Checked]     = useState<boolean>(searchParams.get("chess960Checked")     !== "false");
    const [threeCheckChecked, setThreeCheckChecked] = useState<boolean>(searchParams.get("threeCheckChecked")   !== "false");
    const [kotHChecked, setKotHChecked]             = useState<boolean>(searchParams.get("kotHChecked")         !== "false");
    const [crazyhouseChecked, setCrazyhouseChecked] = useState<boolean>(searchParams.get("crazyhouseChecked")   !== "false");
    const [gameAmountSliderValue, setGameAmountSliderValue] = useState<number>(Number(searchParams.get("gameAmountSliderValue"))    || 5);


    useEffect(() => {
        if (searchParams.get("player1Name")) {
            searchResults();
        }
    }, []);

    async function searchResults(){
        setResultsVisible(false)
        setOptionsVisible(false);
        setGlobal({player2Profile:undefined});
        setGlobal({player1Profile:undefined});

        let player1Name = player1NameInputValue;
        let player2Name = player2NameInputValue;

        setSearchParams({
            player1Name:        player1NameInputValue,
            player2Name:        player2NameInputValue,
            nonRankedChecked:   String(nonRankedChecked),
            rankedChecked:      String(rankedChecked),
            whiteChecked:       String(whiteChecked),
            blackChecked:       String(blackChecked),
            dailyChecked:       String(dailyChecked),
            rapidChecked:       String(rapidChecked),
            blitzChecked:       String(blitzChecked),
            bulletChecked:      String(bulletChecked),
            bughouseChecked:    String(bughouseChecked),
            chess960Checked:    String(chess960Checked),
            threeCheckChecked:  String(threeCheckChecked),
            kotHChecked:        String(kotHChecked),
            crazyhouseChecked:  String(crazyhouseChecked),
            gameAmountSliderValue:         String(gameAmountSliderValue),
        });

        if(player1Name === "" && player2Name !== ""){
            player1Name = player2Name;
        }

        if(player1Name === ""){
            alert("No playername given.")
            return;
        }

        setFetchingData(true)

        let twoPlayersSearched = false;

        setGlobal({player1Profile:await GetDataFrom("https://api.chess.com/pub/player/"+ player1Name)});
        if(player2Name !== ""){
            setGlobal({player2Profile:await GetDataFrom("https://api.chess.com/pub/player/"+ player2Name)});
            twoPlayersSearched = true;
        }

        setGlobal({twoPlayerSelected:twoPlayersSearched});

        let results:ChessGame[] = await getAllGamesOf(player1Name);
        results = filterGames(results,player1Name.toLowerCase(),player2Name.toLowerCase(), twoPlayersSearched)
        setGlobal({foundGames:results});

        if(results.length === 0){

            if(!whiteChecked && !blackChecked){
                alert("Select a Color")
            }else{
                alert("For the given account were no games with this specification found")
            }
            setFetchingData(false)
            return;
        }

        if(results.length > 10000){
            alert("The given account has more the 10000 games played. Browser performance may suffer")
        }

        setFetchingData(false)
        setResultsVisible(true)
    }

    function filterGames(gamesToFilter:any[],player1:string,player2:string,twoPlayerSelected:boolean){

        let gameCountToFilter:number = 0;
        switch(gameAmountSliderValue){
            case 0: gameCountToFilter = 1; break;
            case 1: gameCountToFilter = 10; break;
            case 2: gameCountToFilter = 50; break;
            case 3: gameCountToFilter = 100; break;
            case 4: gameCountToFilter = 500; break;
            case 5: gameCountToFilter = gamesToFilter.length; break;
        }

        gamesToFilter = gamesToFilter.filter((game:any) => {

            if(game.rated && !rankedChecked){
                return false;
            }
            if(!game.rated && !nonRankedChecked){
                return false;
            }

            if(!whiteChecked && game.white.username.toLowerCase() === player1){
                return false;
            }
            if(!blackChecked && game.black.username.toLowerCase() === player1){
                return false;
            }
            if(game.rules === "chess" || game.rules === "oddschess"){
                if(!dailyChecked && game.time_class === "daily"){
                    return false;
                }
                if(!rapidChecked && game.time_class === "rapid"){
                    return false;
                }
                if(!blitzChecked && game.time_class === "blitz"){
                    return false;
                }
                if(!bulletChecked && game.time_class === "bullet"){
                    return false;
                }
            }else{
                if(!bughouseChecked && game.rules === "bughouse"){
                    return false;
                }
                if(!chess960Checked && game.rules === "chess960"){
                    return false;
                }
                if(!threeCheckChecked && game.rules === "threecheck"){
                    return false;
                }
                if(!kotHChecked && game.rules === "kingofthehill"){
                    return false;
                }
                if(!crazyhouseChecked && game.rules === "crazyhouse"){
                    return false;
                }
            }
            return true;
        });

        if(twoPlayerSelected){
            gamesToFilter = gamesToFilter.filter((game:ChessGame) => {
                if(game.white.username.toLowerCase() === player1 && game.black.username.toLowerCase() === player2) {
                    return true;
                }
                return game.black.username.toLowerCase() === player1 && game.white.username.toLowerCase() === player2;

            })
        }

        gamesToFilter = gamesToFilter.slice(gamesToFilter.length-gameCountToFilter, gamesToFilter.length);
        console.log(gamesToFilter);
        return gamesToFilter;
    }

    return (
    <>
        {
            global.popoverInfo &&
            <PlayerProfilePopover
                player1NameInputValue={player1NameInputValue}
                player2NameInputValue={player2NameInputValue}
                setPlayer1NameInputValue={setPlayer1NameInputValue}
                setPlayer2NameInputValue={setPlayer2NameInputValue}
                searchGames={searchResults}
            />

        }
        <div style={{textAlign: "center",width:"var(--container-width)",margin:"auto" }}>
            <div style={{ margin: 20 }}>
                <h2>Chess.com Analyser</h2>
            </div>

            <form style={{ width: "auto" }} autoComplete="on" onSubmit={(e) => { e.preventDefault(); }}>
                <div style={{ textAlign: "center" }}>
                    <input
                        type="text"
                        name="playername"
                        className="name-input"
                        spellCheck={false}
                        placeholder="playername"
                        value={player1NameInputValue}
                        onChange={(e) => { setPlayer1NameInputValue(e.target.value); }}
                    />

                    <h5 style={{ display: "inline-block" }}>VS</h5>

                    <input
                        type="text"
                        name="playername"
                        className="name-input"
                        spellCheck={false}
                        placeholder="playername or nothing"
                        value={player2NameInputValue}
                        onChange={(e) => { setPlayer2NameInputValue(e.target.value); }}
                    />
                </div>

                <button
                    type="button"
                    className="more-options-button"
                    onClick={() => {setOptionsVisible(!optionsVisible); }}
                >
                    Options
                </button>

                <br />

                <div style={{display: (optionsVisible ? "block" : "none")}}>
                    <SearchFilter
                        rankedChecked={rankedChecked}
                        setRankedChecked={setRankedChecked}
                        nonRankedChecked={nonRankedChecked}
                        setNonRankedChecked={setNonRankedChecked}
                        whiteChecked={whiteChecked}
                        setWhiteChecked={setWhiteChecked}
                        blackChecked={blackChecked}
                        setBlackChecked={setBlackChecked}
                        dailyChecked={dailyChecked}
                        setDailyChecked={setDailyChecked}
                        rapidChecked={rapidChecked}
                        setRapidChecked={setRapidChecked}
                        blitzChecked={blitzChecked}
                        setBlitzChecked={setBlitzChecked}
                        bulletChecked={bulletChecked}
                        setBulletChecked={setBulletChecked}
                        bughouseChecked={bughouseChecked}
                        setBughouseChecked={setBughouseChecked}
                        chess960Checked={chess960Checked}
                        setChess960Checked={setChess960Checked}
                        threeCheckChecked={threeCheckChecked}
                        setThreeCheckChecked={setThreeCheckChecked}
                        kotHChecked={kotHChecked}
                        setKotHChecked={setKotHChecked}
                        crazyhouseChecked={crazyhouseChecked}
                        setCrazyhouseChecked={setCrazyhouseChecked}
                        gameAmountSliderValue={gameAmountSliderValue}
                        setGameAmountSliderValue={setGameAmountSliderValue}
                    />
                </div>
                <div>
                    <button type="submit" className="search-button" onClick={(e) => {
                        e.preventDefault();
                        searchResults()
                    }}>
                        Search
                    </button>
                </div>
            </form>
            <div
                style={{
                    display: fetchingData? "flex" : "none" ,
                    height: "200px",
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >
                <div className="spinner"/>
            </div>
            <div className="generated-content-container" style={{display: resultsVisible? "grid" : "none"}}>
                {global.twoPlayerSelected?
                    <>
                        <BaseStatsForTwoSelected/>
                        <GameResultOverviewForTwoSelected/>
                    </>:
                    <>
                        <BaseStatsForOneSelected/>
                        <GameResultOverviewForOneSelected/>
                    </>}
                <ChartWrapper/>
                <MatchHistory/>
            </div>
        </div>
    </>

  );
}

export default App;
