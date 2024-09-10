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
            const bothPokemons =  PokemonSessionStorage.getPlayerPokemons().concat(PokemonSessionStorage.getAIPokemons());
            setBothPokemonsImg(bothPokemons, POKEMON_ANCHORS);
            BATTLE_START_BUTTON.addEventListener("click", () => {
                const playerPokemons = PokemonSessionStorage.getPlayerPokemons();
                const aiPokemons = PokemonSessionStorage.getAIPokemons();
                const playerLeadPokemons = playerPokemons.slice(0, 2);
                const playerBenchPokemons = playerPokemons.slice(2);
                const aiLeadPokemons = aiPokemons.slice(0, 2);
                const aiBenchPokemons = aiPokemons.slice(2);

                function initBattleAttribute(pokemons) {
                    pokemons.map((pokemon) => {
                        pokemon.initBattleAttribute()
                    })
                };

                initBattleAttribute(playerLeadPokemons);
                initBattleAttribute(playerBenchPokemons);
                initBattleAttribute(aiLeadPokemons);
                initBattleAttribute(aiBenchPokemons);

                const url = new URL(BATTLE_INIT_SERVER_URL);
                url.searchParams.append("ai_trainer_title", encodeURIComponent("四天王"));
                url.searchParams.append("ai_trainer_name", encodeURIComponent("カトレア"));
                url.searchParams.append("player_lead_pokemons", encodeURIComponent(JSON.stringify(playerLeadPokemons)));
                url.searchParams.append("player_bench_pokemons", encodeURIComponent(JSON.stringify(playerBenchPokemons)));
                url.searchParams.append("ai_lead_pokemons", encodeURIComponent(JSON.stringify(aiLeadPokemons)));
                url.searchParams.append("ai_bench_pokemons", encodeURIComponent(JSON.stringify(aiBenchPokemons)));
                url.searchParams.append("init", encodeURIComponent("true"));

                fetch(url.toString())
                    .then(response => {
                        return response.json();
                    })
                    .then((responseBattle) => {
                        sessionStorage.setItem("battle", JSON.stringify(responseBattle));
                        location.href = "ai.html";
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

                    const bothPokemons =  PokemonSessionStorage.getPlayerPokemons().concat(PokemonSessionStorage.getAIPokemons());
                    bothPokemons.map((pokemon, i) => {
                        const url = new URL(POKEMON_ANCHORS[i]);
                        url.searchParams.set("poke_name", pokemon.name);
                        POKEMON_ANCHORS[i].href = url.toString();
                    });
                });
            });
});