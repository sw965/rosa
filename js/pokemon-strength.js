document.addEventListener("DOMContentLoaded", () => {
    const POKEMON = sessionStorage.getItem("menu-pokemon");
    const PAGE_BACK_BUTTON = document.getElementById("back-button");
    PAGE_BACK_BUTTON.addEventListener("click", () => {
        history.back();
    });
     
});