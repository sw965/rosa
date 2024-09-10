document.addEventListener("DOMContentLoaded", () => {
    console.log(sessionStorage.getItem("battle"));
    const battle = JSON.parse(sessionStorage.getItem("battle"));

    console.log(JSON.stringify(battle.CurrentSelfLeadPokemons));
    console.log(battle.CurrentSelfLeadPokemons[0].Name);
});