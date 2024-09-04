const BATTLE_START_BUTTON_ID = "battle-start-button";

function setBothPokemonsImg(bothPokemons, pokemonAnchors) {
    bothPokemons.map((pokemon, i) => {
        const url = new URL(pokemonAnchors[i]);
        url.searchParams.append("poke_name", pokemon.name);
        pokemonAnchors[i].href = url.toString();
        const img = document.createElement("img");
        img.id = i;
        img.src = getPokemonImgPath(pokemon.name);
        //aタグの中に画像を追加
        pokemonAnchors[i].appendChild(img);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const POKEMON_ANCHORS = document.getElementsByClassName("pokemon-a")
    const BATTLE_START_BUTTON = document.getElementById(BATTLE_START_BUTTON_ID);
    initPokemonSessionStorageSetter
        .then(() => {
            const bothPokemons =  PokemonSessionStorage.getPlayerPokemons().concat(PokemonSessionStorage.getCaitlinPokemons());
            setBothPokemonsImg(bothPokemons, POKEMON_ANCHORS);
            BATTLE_START_BUTTON.addEventListener("click", () => {
                const playerPokemons = PokemonSessionStorage.getPlayerPokemons();
                const caitlinPokemons = PokemonSessionStorage.getCaitlinPokemons();
                fetch(makeBattleManagerFullURL("single", playerPokemons, caitlinPokemons))
                    .then(response => {
                        return response.json();
                    })
                    .then((json) => {
                        sessionStorage.setItem("player_pokemons", JSON.stringify(playerPokemons));
                        sessionStorage.setItem("caitlin_pokemons", JSON.stringify(caitlinPokemons));
                        location.href = "vs-caitlin.html";
                    })
            });
        })
        .catch(err => {
            //alert("dawn.exeファイルが実行されていないかもしれません。");
            console.error(err);
        });

        let draggedImg;
        initPokemonSessionStorageSetter
            .then(() => {
                document.addEventListener("dragstart", (event) => {
                    draggedImg = event.target;
                    event.target.style.opacity = 0.5;
                });
        
                document.addEventListener("dragend", (event) => {
                    event.target.style.opacity = "";
                });
        
                document.addEventListener("dragover", (event) => {
                    event.preventDefault();
                });
        
                document.addEventListener("drop", (event) => {
                    if (event.target.tagName !== "IMG") {
                        return
                    }

                    const targetSrc = event.target.src;
                    const targetIndex = parseInt(event.target.id, 10);
                    const draggedSrc = draggedImg.src;
                    const draggedIndex = parseInt(draggedImg.id, 10);

                    const targetPokemon = PokemonSessionStorage.get(targetIndex);
                    const dragendPokemon = PokemonSessionStorage.get(draggedIndex);
                    event.target.src = draggedSrc;
                    draggedImg.src = targetSrc;

                    PokemonSessionStorage.set(targetPokemon, draggedIndex);
                    PokemonSessionStorage.set(dragendPokemon, targetIndex);

                    const bothPokemons =  PokemonSessionStorage.getPlayerPokemons().concat(PokemonSessionStorage.getCaitlinPokemons());
                    bothPokemons.map((pokemon, i) => {
                        const url = new URL(POKEMON_ANCHORS[i]);
                        url.searchParams.set("poke_name", pokemon.name);
                        POKEMON_ANCHORS[i].href = url.toString();
                    });
                });
            });
});