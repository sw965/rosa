const MIN_TEAM_NUM = 3;

const POKEMON_ANCHOR_IDS = [
    "pokemon1-a",
    "pokemon2-a",
    "pokemon3-a",
    "pokemon4-a",
    "pokemon5-a",
    "pokemon6-a",
];

function setTeamPokemonImg(teamPokeNames, pokemonAnchors) {
    teamPokeNames.map((pokeName, i) => {
        const url = new URL(pokemonAnchors[i]);
        url.searchParams.append("poke_name", pokeName);
        pokemonAnchors[i].href = url.toString();
        const img = document.createElement("img");
        img.src = "img/" + ALL_POKE_NAMES[i] + ".gif";
        pokemonAnchors[i].appendChild(img);
    });
}

// function setTeamPokeName(teamPokeNames) {
//     teamPokeNames.map((pokeName, i) => {
//         const pokemon = sessionStorage.getItem(i);
//         if (pokemon === null) {
//             pokemon.
//         }
//     });
// }

document.addEventListener("DOMContentLoaded", () => {
    const POKEMON_ANCHORS = POKEMON_ANCHOR_IDS.map(pokemonAnchorId => {
        return document.getElementById(pokemonAnchorId);
    });

    let teamPokeNames = sessionStorage.getItem("teamPokeNames");
    if (teamPokeNames === null) {
        allPokeNamesLoader
        .then(() => {
            let teamPokeNames = [
                ALL_POKE_NAMES[0], ALL_POKE_NAMES[1], ALL_POKE_NAMES[2],
                EMPTY, EMPTY, EMPTY,
            ];
            sessionStorage.setItem("teamPokeNames", JSON.stringify(teamPokeNames));
            setTeamPokemonImg(teamPokeNames, POKEMON_ANCHORS);
        })
        .catch(err => {
            alert("dawn.exeファイルが実行されていないかもしれません。");
            console.error(err);
        });
    } else {
        setTeamPokemonImg(Array.from(JSON.parse(teamPokeNames)), POKEMON_ANCHORS);
    }
});