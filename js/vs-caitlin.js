const MOVE_BUTTON_IDS = [
    "move1-button",
    "move2-button",
    "move3-button",
    "move4-button",
]

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

    MOVE_BUTTONS.map((moveButton, i) => {
        moveButton.addEventListener("click", (event) => {
            fetch(makeCaitlinFullURL(null, null, event.target.value))
                .then(response => {
                    return response.json();
                })
                .then(json => {
                    console.log(json);
                });
            console.log(moveButton.value);
        });
    });
});