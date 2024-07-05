const POKEMON_ANCHOR_IDS = [
    "self-pokemon1-a",
    "self-pokemon2-a",
    "self-pokemon3-a",
    "self-pokemon4-a",
    "self-pokemon5-a",
    "self-pokemon6-a",

    "opponent-pokemon1-a",
    "opponent-pokemon2-a",
    "opponent-pokemon3-a",
    "opponent-pokemon4-a",
    "opponent-pokemon5-a",
    "opponent-pokemon6-a",
];

const BATTLE_START_BUTTON_ID = "battle-start-button";

function setBothTeamPokemonImg(bothTeam, pokemonAnchors) {
    bothTeam.map((pokemon, i) => {
        const url = new URL(pokemonAnchors[i]);
        url.searchParams.append("poke_name", pokemon.name);
        pokemonAnchors[i].href = url.toString();
        const img = document.createElement("img");
        img.id = i;
        img.src = "img/" + pokemon.name + ".gif";
        pokemonAnchors[i].appendChild(img);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const POKEMON_ANCHORS = POKEMON_ANCHOR_IDS.map(pokemonAnchorId => {
        return document.getElementById(pokemonAnchorId);
    });

    const BATTLE_START_BUTTON = document.getElementById(BATTLE_START_BUTTON_ID);
    initPokemonSessionStorageSetter
        .then(() => {
            const bothTeam = PokemonSessionStorage.getBothTeam();
            setBothTeamPokemonImg(bothTeam, POKEMON_ANCHORS);
            BATTLE_START_BUTTON.addEventListener("click", () => {
                const bothTeam = PokemonSessionStorage.getBothTeam();
                const selfTeam = bothTeam.slice(0, MAX_TEAM_NUM-3);
                const opponentTeam = bothTeam.slice(MAX_TEAM_NUM, MAX_BOTH_TEAM_NUM-3);
                fetch(makeCaitlinFullURL(selfTeam, opponentTeam, null))
                    .then(response => {
                        return response.json();
                    })
                    .then((json) => {
                        location.href = "vs-caitlin.html";
                    })
            });
        })
        .catch(err => {
            alert("dawn.exeファイルが実行されていないかもしれません。");
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
                })
            });
});