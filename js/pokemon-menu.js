document.addEventListener("DOMContentLoaded", () => {
    function resizeTable() {
        const pokemonTable = document.getElementById("pokemon-menu-table");
        pokemonTable.style.width = window.innerWidth + "px";
        pokemonTable.style.height = (0.7 * window.innerHeight) + "px";

        const operationTable = document.getElementById("operation-button-table");
        operationTable.style.width = window.innerWidth + "px";
        operationTable.style.height = (0.3 * window.innerHeight) + "px";
    }

    window.addEventListener("resize", resizeTable);
    window.addEventListener("load", resizeTable);

    const POKEMON_IMGS = document.getElementsByClassName("pokemon-img");
    const CURRENT_BATTLE = JSON.parse(sessionStorage.getItem("currentBattle"));
    const pokemons = CURRENT_BATTLE.CurrentSelfLeadPokemons.concat(CURRENT_BATTLE.CurrentSelfBenchPokemons);
    pokemons.forEach((pokemon, i) => {
        POKEMON_IMGS[i].src = getPokemonImgPath(pokemon.Name);
    });
});