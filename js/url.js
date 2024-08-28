const DAWN_BASE_URL = "http://localhost:8081/dawn/";

function makeDawnFullURL(dataType) {
    const url = new URL(DAWN_BASE_URL);
    url.searchParams.append("data_type", encodeURIComponent(dataType));
    return url.toString();
}

const CAITLIN_BASE_URL = "http://localhost:8080/caitlin/";

function makeCaitlinFullURL(selfTeam, opponentTeam) {
    const url = new URL(CAITLIN_BASE_URL);
    alert(JSON.stringify(selfTeam));
    url.searchParams.append("selfTeam", encodeURIComponent(JSON.stringify(selfTeam)));
    url.searchParams.append("opponentTeam", encodeURIComponent(JSON.stringify(opponentTeam)));
    return url.toString();
}