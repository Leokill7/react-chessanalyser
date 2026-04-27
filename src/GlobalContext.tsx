import  { createContext, useContext, useState, type ReactNode } from 'react';
import {ChessGame, ChessPlayerProfile} from "./types";
interface GlobalState {
    foundGames:ChessGame[],
    player1Profile:ChessPlayerProfile|undefined,
    player2Profile:ChessPlayerProfile|undefined,
    twoPlayerSelected:boolean,
}

interface GlobalContextType {
    global: GlobalState;
    setGlobal: (newState: Partial<GlobalState>) => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
    const [global, setGlobalInternal] = useState<GlobalState>({
        foundGames:[],
        player1Profile:undefined,
        player2Profile:undefined,
        twoPlayerSelected:false
    });

    const setGlobal = (newState: Partial<GlobalState>) => {
        setGlobalInternal(prev => ({ ...prev, ...newState }));
    };

    return (
        <GlobalContext.Provider value={{ global, setGlobal }}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobal = () => {
    const context = useContext(GlobalContext);
    if (!context) {
        throw new Error('useGlobal muss innerhalb von GlobalProvider verwendet werden');
    }
    return context;
};
