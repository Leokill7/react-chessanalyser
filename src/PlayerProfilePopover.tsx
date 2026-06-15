import { useEffect, useState} from "react";
import FlagIcon from "./Components/FlagIcon";
import {getDateFromUnitTimestamp, GetLeagueIcon, GetPlayerName} from "./commonFunctions";
import {useGlobal} from "./GlobalContext";
import defaultAvatar from "./Icons/defaultavatar.svg";


export default function PlayerProfilePopover ({player1NameInputValue, setPlayer1NameInputValue, setPlayer2NameInputValue,player2NameInputValue, searchGames}:{player1NameInputValue:string; setPlayer1NameInputValue:(arg0:string)=>void;player2NameInputValue:string;setPlayer2NameInputValue:(arg0:string)=>void; searchGames:()=>void}) {
    const { global, setGlobal } = useGlobal();
    const [pendingSearch, setPendingSearch] = useState(false);

    useEffect(() => {
        if (pendingSearch) {
            searchGames();
            setPendingSearch(false);
            setGlobal({popoverInfo: null});
        }
    }, [player1NameInputValue,player2NameInputValue]);

    if(!global.popoverInfo){return (<></>);}



    const popoverUsername = global.popoverInfo.playerProfile.username.toLowerCase();
    const isPlayer1 = popoverUsername === player1NameInputValue.toLowerCase();
    const showAnalyse = !(!global.player2Profile && isPlayer1);
    const showVS = !global.player2Profile && !isPlayer1;

    const columnCount = 1 + (showAnalyse ? 1 : 0) + (showVS ? 1 : 0);

    const playerAvatarUrl = global.popoverInfo.playerProfile.avatar ? global.popoverInfo.playerProfile.avatar:defaultAvatar;
    return(
        <>
            <div
                onClick={() => setGlobal({popoverInfo: null})}
                style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 99,
                }}
            />
            <div
                className="player-popover-container"
                style={{
                    position: "absolute",
                    left: global.popoverInfo.posX + 8,
                    top: global.popoverInfo.posY + 12,
                    zIndex: 100,
            }}
            >
                <div style={{ display: "grid", gridTemplateColumns: "25% 75%" }}>
                    <img
                        className="player-popover-avatar"
                        src={playerAvatarUrl}
                        alt="Player avatar"
                    />
                    <div style={{ display: "grid"}}>
                        <div style={{ display: "grid", gridTemplateColumns: "20% 60% 20%" }}>
                            <FlagIcon countryISOCode={global.popoverInfo.playerProfile.country.split("country/")[1]}/>
                            <div
                                style={{
                                    fontSize: "small",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                            >
                                {GetPlayerName(global.popoverInfo.playerProfile)}
                            </div>
                            <img
                                alt={"League"}
                                title="League"
                                src={GetLeagueIcon(global.popoverInfo.playerProfile)}
                                style={{ width: "18px", height: "13px", margin: "auto" }}
                            />
                        </div>
                        <div>
                            <div
                                style={{
                                    fontSize: "small",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                            >
                                Joined: {getDateFromUnitTimestamp(global.popoverInfo.playerProfile.joined)}
                            </div>
                        </div>
                    </div>

                </div>

                <div
                    className="player-popover-button-container"
                    style={{
                        display: "grid",
                        gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
                        height: "100%",
                        width: "100%",
                    }}
                >
                    <a
                        style={{
                            borderBottomLeftRadius: "var(--border-radius)",
                            ...(
                                (!global.player2Profile && global.popoverInfo.playerProfile.username.toLowerCase() === player1NameInputValue.toLowerCase())
                                    ? { borderBottomRightRadius: "var(--border-radius)" }
                                    : {}
                            )
                        }}
                        className="player-popover-button-style"
                        target="_blank"
                        rel="noopener noreferrer"
                        href={global.popoverInfo.playerProfile.url}
                    >
                        Profile
                    </a>
                    {
                        (!(!global.player2Profile && global.popoverInfo.playerProfile.username.toLowerCase() === player1NameInputValue.toLowerCase())) &&
                        <div
                            style={{
                                borderLeft: "1px solid var(--border-color)",
                                borderBottomRightRadius: "var(--border-radius)",
                                cursor:"pointer"
                            }}
                            className="player-popover-button-style"
                            onClick={() => {
                                if(!global.popoverInfo) return;
                                setPlayer2NameInputValue("");
                                setPlayer1NameInputValue(global.popoverInfo.playerProfile.username.toLowerCase());
                                setPendingSearch(true);
                            }}
                        >
                            Analyse
                        </div>
                    }
                    {
                        (!global.player2Profile && global.popoverInfo.playerProfile.username.toLowerCase() !== player1NameInputValue.toLowerCase()) &&
                        <div
                            style={{
                                borderLeft: "1px solid var(--border-color)",
                                borderBottomRightRadius: "var(--border-radius)",
                                cursor:"pointer"
                            }}
                            className="player-popover-button-style"
                            onClick={() => {
                                if(!global.popoverInfo) return;
                                setPlayer2NameInputValue(global.popoverInfo.playerProfile.username.toLowerCase());
                                setPendingSearch(true);
                            }}
                        >
                            VS
                        </div>
                    }

                </div>
            </div>
        </>
    )
}