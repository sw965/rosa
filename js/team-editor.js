const POKEMON_ANCHOR_IDS = [
    "pokemon1-a",
    "pokemon2-a",
    "pokemon3-a",
    "pokemon4-a",
    "pokemon5-a",
    "pokemon6-a",
];

const FILE_SAVE_BUTTON_ID = "file-save-button";

function setTeamPokemonImg(team, pokemonAnchors) {
    team.map((pokemon, i) => {
        const url = new URL(pokemonAnchors[i]);
        url.searchParams.append("poke_name", pokemon.name);
        pokemonAnchors[i].href = url.toString();
        const img = document.createElement("img");
        img.src = "img/" + pokemon.name + ".gif";
        pokemonAnchors[i].appendChild(img);
    });
}

function setTeamPokeNames() {
    for (let i=0; i < MAX_TEAM_NUM; i++) {
        const pokemon = PokemonSessionStorage.get(i);
        if (pokemon.name === null) {
            pokemon.name = ALL_POKE_NAMES[i];
        }
        PokemonSessionStorage.set(pokemon, i);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const POKEMON_ANCHORS = POKEMON_ANCHOR_IDS.map(pokemonAnchorId => {
        return document.getElementById(pokemonAnchorId);
    });

    initPokemonSessionStorageSetter
        .then(() => {
            const team = PokemonSessionStorage.getTeam();
            const teamPokeNames = PokemonSessionStorage.getTeam().map(pokemon => {
                return pokemon.name;
            });    
            setTeamPokemonImg(team, POKEMON_ANCHORS);
            setTeamPokeNames(teamPokeNames);
        })
        .catch(err => {
            alert("dawn.exeファイルが実行されていないかもしれません。");
            console.error(err);
        });
    
    const FILE_SAVE_BUTTON = document.getElementById(FILE_SAVE_BUTTON_ID);
    FILE_SAVE_BUTTON.addEventListener("click", () => {
        const team = PokemonSessionStorage.getTeam();
        let jsonString = JSON.stringify(team, null, 2);
        let blob = new Blob([jsonString], { type: "application/json" });
        let url = URL.createObjectURL(blob);

        let a = document.createElement('a');
        a.href = url;
        a.download = "team.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });
});