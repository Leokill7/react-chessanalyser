import React, {RefObject, useEffect, useRef, useState} from 'react';
import logo from './logo.svg';
import {GetDataFrom} from "./commonFunctions.js";
import './App.css';
import SearchFilter from "./SearchFilter/SearchFilter";
import MatchHistory from "./MatchHistory/MatchHistory";
import {useGlobal} from "./GlobalContext";
import {ChessGame} from "./types";

async function getAllGamesOf(playerName:string) {
    if(playerName === undefined){
        return []
    }
    let links = await GetDataFrom("https://api.chess.com/pub/player/"+ playerName+"/games/archives");
    links = links.archives;
    let games: any[] = [];
    const gamesArray = await getAllMonthGames(links)

    for(let i = 0; i < gamesArray.length; i++){
        gamesArray[i].games.forEach((game: any) => {
            games.push(game)
        })
    }
    return games;
}
async function getAllMonthGames(links: string[]){
    const functions = links.map(GetDataFrom)
    return Promise.all(functions);
}

function App() {
    const { global, setGlobal } = useGlobal();
    const [optionsVisible,setOptionsVisible] = useState(true);
    const [resultsVisible,setResultsVisible] = useState(true);

    const player1NameInput = useRef<HTMLInputElement>(null);
    const player2NameInput = useRef<HTMLInputElement>(null);
    const filterWhiteCheckbox = useRef<HTMLInputElement>(null);
    const filterBlackCheckbox = useRef<HTMLInputElement>(null);
    const filterDailyCheckbox = useRef<HTMLInputElement>(null);
    const filterRapidCheckbox = useRef<HTMLInputElement>(null);
    const filterBlitzCheckbox = useRef<HTMLInputElement>(null);
    const filterBulletCheckbox = useRef<HTMLInputElement>(null);
    const filterBughouseCheckbox = useRef<HTMLInputElement>(null);
    const filter960ChessCheckbox = useRef<HTMLInputElement>(null);
    const filterThreeCheckCheckbox = useRef<HTMLInputElement>(null);
    const filterKotHCheckbox = useRef<HTMLInputElement>(null);
    const filterCrazyhouseCheckbox = useRef<HTMLInputElement>(null);
    const filterGameAmountSlider = useRef<HTMLInputElement>(null);

    async function searchResults(){
        setOptionsVisible(false);
        setResultsVisible(true)
        setGlobal({player2Info:null});
        setGlobal({player1Info:null});

        if(!player1NameInput.current || !player2NameInput.current){
            return;
        }

        let player1Name = player1NameInput.current.value;
        let player2Name = player2NameInput.current.value;

        if(player1Name === "" && player2Name !== ""){
            player1Name = player2Name;
        }

        if(player1Name === ""){
            alert("No playername given.")
            return;
        }

        let twoPlayersSearched = false;

        setGlobal({player1Info:await GetDataFrom("https://api.chess.com/pub/player/"+ player1Name)});
        if(player2Name !== ""){
            setGlobal({player2Info:await GetDataFrom("https://api.chess.com/pub/player/"+ player2Name)});
            twoPlayersSearched = true;
        }

        setGlobal({twoPlayerSelected:twoPlayersSearched});

        let results:ChessGame[] = await getAllGamesOf(player1Name);
        results = results.reverse();
        results = filterGames(results,player1Name.toLowerCase(),player2Name.toLowerCase(), twoPlayersSearched)
        setGlobal({foundGames:results});

        if(results.length === 0){
            if (
                !filterWhiteCheckbox.current ||
                !filterBlackCheckbox.current){
                return;
            }

            if(!filterWhiteCheckbox.current.checked && !filterBlackCheckbox.current.checked){
                alert("Select a Color")
            }else{
                alert("For the given account were no games with this specification found")
            }
            return;
        }

        if(results.length > 10000){
            alert("The given account has more the 10000 games played. Browser performance may suffer")
        }
    }

    function filterGames(gamesToFilter:any[],player1:string,player2:string,twoPlayerSelected:boolean){
        if (
            !filterWhiteCheckbox.current ||
            !filterBlackCheckbox.current ||
            !filterDailyCheckbox.current ||
            !filterRapidCheckbox.current ||
            !filterBlitzCheckbox.current ||
            !filterBulletCheckbox.current ||
            !filterBughouseCheckbox.current ||
            !filter960ChessCheckbox.current ||
            !filterThreeCheckCheckbox.current ||
            !filterKotHCheckbox.current ||
            !filterCrazyhouseCheckbox.current ||
            !filterGameAmountSlider.current
        ) {
            return [];
        }
        let gameCountToFilter:number = filterGameAmountSlider.current.valueAsNumber;
        if(gamesToFilter.length<gameCountToFilter){
            gameCountToFilter = gamesToFilter.length
        }

        gamesToFilter = gamesToFilter.filter((game:any) => {
            if (
                !filterWhiteCheckbox.current ||
                !filterBlackCheckbox.current ||
                !filterDailyCheckbox.current ||
                !filterRapidCheckbox.current ||
                !filterBlitzCheckbox.current ||
                !filterBulletCheckbox.current ||
                !filterBughouseCheckbox.current ||
                !filter960ChessCheckbox.current ||
                !filterThreeCheckCheckbox.current ||
                !filterKotHCheckbox.current ||
                !filterCrazyhouseCheckbox.current ||
                !filterGameAmountSlider.current
            ) {
                return false;
            }

            if(!filterWhiteCheckbox.current.checked && game.white.username.toLowerCase() === player1){
                return false;
            }
            if(!filterBlackCheckbox.current.checked && game.black.username.toLowerCase() === player1){
                return false;
            }
            if(game.rules === "chess" || game.rules === "oddschess"){
                if(!filterDailyCheckbox.current.checked && game.time_class === "daily"){
                    return false;
                }
                if(!filterRapidCheckbox.current.checked && game.time_class === "rapid"){
                    return false;
                }
                if(!filterBlitzCheckbox.current.checked && game.time_class === "blitz"){
                    return false;
                }
                if(!filterBulletCheckbox.current.checked && game.time_class === "bullet"){
                    return false;
                }
            }else{
                if(!filterBughouseCheckbox.current.checked && game.rules === "bughouse"){
                    return false;
                }
                if(!filter960ChessCheckbox.current.checked && game.rules === "chess960"){
                    return false;
                }
                if(!filterThreeCheckCheckbox.current.checked && game.rules === "threecheck"){
                    return false;
                }
                if(!filterKotHCheckbox.current.checked && game.rules === "kingofthehill"){
                    return false;
                }
                if(!filterCrazyhouseCheckbox.current.checked && game.rules === "crazyhouse"){
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
                if(game.black.username.toLowerCase() === player1 && game.white.username.toLowerCase() === player2){
                    return true;
                }
                return false;
            })
        }


        return gamesToFilter.filter((game:any,index:number) => index < gamesToFilter.length*(gameCountToFilter*0.01));
    }

    return (
      <div id="canvas" style={{textAlign: "center" }}>
          <div style={{ margin: 20 }}>
              <h2>Chess.com Analyser</h2>
          </div>

          <form style={{ width: "auto" }} autoComplete="on" onSubmit={(e) => { e.preventDefault(); }}>
              <div style={{ textAlign: "center" }}>
                  <input
                      type="text"
                      id="player1Input"
                      name="playername"
                      className="name-input"
                      spellCheck={false}
                      placeholder="playername"
                      ref={player1NameInput}

                  />

                  <h5 style={{ display: "inline-block" }}>VS</h5>

                  <input
                      type="text"
                      id="player2Input"
                      name="playername"
                      className="name-input"
                      spellCheck={false}
                      placeholder="playername or nothing"
                      ref={player2NameInput}
                  />
              </div>

              <button
                  type="button"
                  id="advancedOptionsButton"
                  className="more-options-button"
                  onClick={() => {setOptionsVisible(!optionsVisible); }}
              >
                  Options
              </button>

              <br />

              <div style={{display: (optionsVisible ? "block" : "none")}}>
                  <SearchFilter
                      filterBlitzCheckbox={filterBlitzCheckbox}
                      filterBulletCheckbox={filterBulletCheckbox}
                      filterDailyCheckbox={filterDailyCheckbox}
                      filterBughouseCheckbox={filterBughouseCheckbox}
                      filter960ChessCheckbox={filter960ChessCheckbox}
                      filterThreeCheckCheckbox={filterThreeCheckCheckbox}
                      filterKotHCheckbox={filterKotHCheckbox}
                      filterCrazyhouseCheckbox={filterCrazyhouseCheckbox}
                      filterGameAmountSlider={filterGameAmountSlider}
                      filterBlackCheckbox={filterBlackCheckbox}
                      filterRapidCheckbox={filterRapidCheckbox}
                      filterWhiteCheckbox={filterWhiteCheckbox}
                  />
              </div>




              <div>
                  <button type="submit" id="searchButton" className="search-button" onClick={(e) => {
                      e.preventDefault();
                      searchResults()
                  }}>
                      Search
                  </button>
              </div>
          </form>

          <div id="loadingText" style={{ margin: "auto", textAlign: "center", display: "none" }}>
              <p style={{ display: "inline-block" }}>Loading games can take up to 15s</p>
              <div className="loader"></div>
          </div>
          <div id="generatedContent" style={{ margin: "auto", textAlign: "center" , width:"600px"}}>
              <MatchHistory/>
          </div>
      </div>
  );
}

export default App;
