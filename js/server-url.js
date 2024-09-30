const SERVER_BASE_URL = "http://localhost:8080/"

const DATA_QUERY_SERVER_URL = SERVER_BASE_URL + "data_query/";

function makeDataQueryServerFullURL(requestType) {
    const url = new URL(DATA_QUERY_SERVER_URL);
    url.searchParams.append("data_type", encodeURIComponent(requestType));
    return url.toString();
}

const BATTLE_INIT_SERVER_URL = SERVER_BASE_URL + "battle_init/";
const BATTLE_QUERY_SERVER_URL = SERVER_BASE_URL + "battle_query/";
const BATTLE_COMMAND_SERVER_URL = SERVER_BASE_URL + "battle_command/";
const BATTLE_MCTS_INIT_SERVER_URL = SERVER_BASE_URL + "battle_mcts_init/";
const BATTLE_MCTS_QUERY_SERVER_URL = SERVER_BASE_URL + "battle_mcts_query/";