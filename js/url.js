const DAWN_BASE_URL = "http://localhost:8081/dawn/";

function makeDawnFullURL(dataType) {
    const url = new URL(DAWN_BASE_URL);
    url.searchParams.append("data_type", encodeURIComponent(dataType));
    return url.toString();
}

const CAITLIN_BASE_URL = "http://localhost:8080/caitlin/";

function makeCaitlinFullURL(selfTeam, opponentTeam, action) {
    const url = new URL(CAITLIN_BASE_URL);
    url.searchParams.append("self_team", encodeURIComponent(JSON.stringify(selfTeam)));
    url.searchParams.append("opponent_team", encodeURIComponent(JSON.stringify(opponentTeam)));
    url.searchParams.append("action", encodeURIComponent(action));
    return url.toString();
}