const BATTLE_START_BUTTON_ID = "battle-start-button";

function setBothTeamPokemonImg(bothTeam, pokemonAnchors) {
    bothTeam.map((pokemon, i) => {
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
            const bothTeam = PokemonSessionStorage.getBothTeam();
            setBothTeamPokemonImg(bothTeam, POKEMON_ANCHORS);
            BATTLE_START_BUTTON.addEventListener("click", () => {
                const bothTeam = PokemonSessionStorage.getBothTeam();
                const selfTeam = bothTeam.slice(0, MAX_TEAM_NUM-3);
                const opponentTeam = bothTeam.slice(MAX_TEAM_NUM, MAX_BOTH_TEAM_NUM-3);
                fetch(makeCaitlinFullURL(selfTeam, opponentTeam))
                    .then(response => {
                        return response.json();
                    })
                    .then((json) => {
                        const battle = JSON.parse(JSON.stringify(json));
                        sessionStorage.setItem("battle", JSON.stringify(battle));
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

                    const bothTeam = PokemonSessionStorage.getBothTeam()
                    bothTeam.map((pokemon, i) => {
                        const url = new URL(POKEMON_ANCHORS[i]);
                        url.searchParams.set("poke_name", pokemon.name);
                        POKEMON_ANCHORS[i].href = url.toString();
                    });
                });
            });
});