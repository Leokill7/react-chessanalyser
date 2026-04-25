export type ChessGame = {
    black: PlayerGameData;
    white: PlayerGameData;
    eco: string;
    end_time: number;
    fen: string;
    initial_setup: string;
    pgn: string;
    rated: boolean;
    rules: string;
    tcn: string;
    time_class: string;
    time_control: string;
    url: string;
    uuid: string;
    accuracies: {
        white: number;
        black: number;
    }|undefined;
};


export type PlayerGameData = {
    "@id": string;
    rating: number;
    result: string;
    username: string;
    uuid: string;
};
export type ChessPlayerProfile = {
    avatar: string;
    player_id: number;
    "@id": string;
    url: string;
    name: string;
    username: string;
    followers: number;
    country: string;
    last_online: number;
    joined: number;
    status: string;
    is_streamer: boolean;
    verified: boolean;
    league: string;
    streaming_platforms: string[];
}