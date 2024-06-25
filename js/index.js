document.addEventListener('DOMContentLoaded', (event) => {
    const startButton = document.getElementById("start-button")
    startButton.addEventListener("click", () => {
        const action = "-1"
        const url = `http://localhost:8080/caitlin/?action=${encodeURIComponent(action)}`;
        fetch(url)
            .then((response) => {
                return response.json();
            })
            .then((json) => {
                return new Promise((resolve) => {
                    sessionStorage.setItem("response_text", JSON.stringify(json));
                    resolve();
                })
            })
            .then(() => {
                //window.location.replace("battle.html");
                window.location.href = "battle.html";
            })
            .catch(err => {
                console.error(err)
            })
    })
});