const DATA_BASE_URL = "http://localhost:8080/data/";


function makeDataServerFullURL(dataType) {
    const url = new URL(DATA_BASE_URL);
    url.searchParams.append("data_type", encodeURIComponent(dataType));
    return url.toString();
}

const BATTLE_BASE_URL = "http://localhost:8080/battle/";

function makeBattleManagerFullURL(battleType, playerPokemons, caitlinPokemons) {
    const url = new URL(BATTLE_BASE_URL);
    url.searchParams.append("battle_type", encodeURIComponent(battleType));
    url.searchParams.append("player_pokemons", encodeURIComponent(JSON.stringify(playerPokemons)));
    url.searchParams.append("caitlin_pokemons", encodeURIComponent(JSON.stringify(caitlinPokemons)));
    return url.toString();
}