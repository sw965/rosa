const MOVE_BUTTON_IDS = [
    "move1-button",
    "move2-button",
    "move3-button",
    "move4-button",
]

function pokemonImgSrcToPokeName(src) {
    const decoded = decodeURIComponent(src);
    return decoded.split("/").pop().split(".").shift();
}

document.addEventListener("DOMContentLoaded", () => {
    const bothTeam = PokemonSessionStorage.getBothTeam();

    const SELF_LEAD_POKEMON_IMG = document.getElementById("self-lead-pokemon-img");
    SELF_LEAD_POKEMON_IMG.src = "img/" + bothTeam[0].name + ".gif";

    const OPPONENT_LEAD_POKEMON_IMG = document.getElementById("opponent-lead-pokemon-img");
    OPPONENT_LEAD_POKEMON_IMG.src = "img/" + bothTeam[MAX_TEAM_NUM].name + ".gif";

    const MOVE_BUTTONS = MOVE_BUTTON_IDS.map(moveButtonId => {
        return document.getElementById(moveButtonId);
    })
    MOVE_BUTTONS.map((moveButton, i) => {
        moveButton.value = bothTeam[0].moveNames[i];
        moveButton.innerText = bothTeam[0].moveNames[i];
    });

    const SELF_CURRENT_HP = document.getElementById("self-current-hp");
    const OPPONENT_CURRENT_HP = document.getElementById("opponent-current-hp");

    async function update(uis) {
        let i = 0;
        for (const ui of uis) {
            await new Promise(resolve => {
                setTimeout(() => {
                    const selfPokeName = pokemonImgSrcToPokeName(SELF_LEAD_POKEMON_IMG.src);
                    if (ui.RealSelfPokeName !== selfPokeName) {
                        SELF_LEAD_POKEMON_IMG.src = "img/" + ui.RealSelfPokeName + ".gif";
                    }

                    const opponentPokeName = pokemonImgSrcToPokeName(OPPONENT_LEAD_POKEMON_IMG.src);
                    if (ui.RealOpponentPokeName !== opponentPokeName) {
                        OPPONENT_LEAD_POKEMON_IMG.src = "img/" + ui.RealOpponentPokeName + ".gif";
                    }

                    SELF_CURRENT_HP.innerText = ui.RealSelfCurrentHP;
                    OPPONENT_CURRENT_HP.innerText = ui.RealOpponentCurrentHP;
                    resolve();
                    console.log("解決");
                }, 100);
                console.log("i=", i);
                i += 1;
            });
        }
    }

    MOVE_BUTTONS.map((moveButton, i) => {
        moveButton.addEventListener("click", (event) => {
            console.log(event.target.value);
            fetch(makeCaitlinFullURL(null, null, event.target.value))
                .then(response => {
                    return response.json();
                })
                .then(json => {
                    const uis = JSON.parse(JSON.stringify(json));
                    update(uis);
                });
        });
    });
});