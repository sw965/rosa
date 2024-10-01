document.addEventListener("DOMContentLoaded", () => {
    function resizeTable() {
        const pokemonTable = document.getElementById("pokemon-menu-table");
        pokemonTable.style.width = window.innerWidth + "px";
        pokemonTable.style.height = window.innerHeight + "px";
    };

    window.addEventListener("resize", resizeTable);
    window.addEventListener("load", resizeTable);

    const POKEMON_IMGS = document.getElementsByClassName("pokemon-img");
    const CURRENT_BATTLE = JSON.parse(sessionStorage.getItem("currentBattle"));
    const pokemons = CURRENT_BATTLE.CurrentSelfLeadPokemons.concat(CURRENT_BATTLE.CurrentSelfBenchPokemons);
    pokemons.forEach((pokemon, i) => {
        POKEMON_IMGS[i].src = getPokemonImgPath(pokemon.Name);
    });
    const POKEMON_BUTTONS = document.getElementsByClassName("pokemon-button");
    Array.from(POKEMON_BUTTONS).forEach((button, i) => {
        button.addEventListener("click", () => {
            sessionStorage.setItem("menuPokemon", pokemons[i]);
            location.href = "pokemon-strength.html";
        });
    });
});