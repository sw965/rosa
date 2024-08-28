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
    console.log(sessionStorage.getItem("selfFighters"));
    console.log(sessionStorage.getItem("opponentFighters"));
    const bothTeam = PokemonSessionStorage.getBothTeam();

    const SELF_POKEMON_IMGS = [0, 1, 2].map(i => {
        const selfPokemonImg = document.getElementById("self-pokemon" + i + "-img");
        console.log("getItem", JSON.parse(sessionStorage.getItem("battle")));
        selfPokemonImg.src = "img/" + JSON.parse(sessionStorage.getItem("selfFighters"))[i].Name + ".gif";
    });

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
    const MESSAGE_H = document.getElementById("message-h3");

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

                    if (ui.Message !== MESSAGE_H.innerText) {
                        MESSAGE_H.innerText = ui.Message;
                    }
                    resolve();
                }, 50);
                i += 1;
            });
        }
    }

    MOVE_BUTTONS.map((moveButton, i) => {
        moveButton.addEventListener("click", (event) => {
            console.log("押された！")
        })
    });
});