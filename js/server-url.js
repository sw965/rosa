const DATA_QUERY_SERVER_URL = "http://localhost:8080/data_query/";

function makeDataQueryServerFullURL(requestType) {
    const url = new URL(DATA_QUERY_SERVER_URL);
    url.searchParams.append("request_type", encodeURIComponent(requestType));
    return url.toString();
}

const BATTLE_INIT_SERVER_URL = "http://localhost:8080/battle_init/";
const BATTLE_QUERY_SERVER_URL = "http://localhost:8080/battle_query/";
const BATTLE_COMMAND_SERVER_URL = "http://localhost:8080/battle_command/";