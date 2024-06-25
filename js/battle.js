window.addEventListener("DOMContentLoaded", (event) => {
    const text = sessionStorage.getItem("response_text");
    const json = JSON.parse(text)[0]
    const battle = json.EasyReadBattle
    const selfPokeName = battle.SelfFighters[0].Name
    const opponentPokeName = battle.OpponentFighters[0].Name
    let selfPokeImg = document.getElementById("self-poke-img")
    selfPokeImg.src = "img/" + selfPokeName + ".gif"
    console.log("img/" + selfPokeName + ".gif")
    let opponentPokeImg = document.getElementById("opponent-poke-img")
    opponentPokeImg.src = "img/" + opponentPokeName + ".gif"
    console.log("img/" + opponentPokeName + ".gif")

    let buttons = document.getElementById("move-buttons")
    for (let key in battle.SelfFighters[0].Moveset) {
        console.log(key, battle.SelfFighters[0].Moveset[key])
        console.log(typeof key)
        let button = document.createElement("button");
        button.id = key + "_button"
        button.innerText = key
        buttons.appendChild(button)
        button.addEventListener("click", () => {
            const url = `http://localhost:8080/caitlin/?action=${encodeURIComponent(key)}`;
            fetch(url)
                .then((response) => {
                    return response.json();
                })
                .then((json) => {
                    console.log(json)
                })
                .catch(err => {
                    console.error(err)
                })
        })
    }
});