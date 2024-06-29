var POKEDEX;

const MAX_MOVESET_NUM = 4;

const MOVE_SELECT_IDS = [
    "move1-select",
    "move2-select",
    "move3-select",
    "move4-select",
]

function getMoveSelects() {
    return MOVE_SELECT_IDS.map(moveSelectId => {
        return document.getElementById(moveSelectId);
    });
}

function switchLearnset(pokeName, moveSelects) {
    moveSelects.map(moveSelect => {
        console.log(typeof moveSelect.options)
        options = Array.from(moveSelect.options)
        options.map(option => {
            moveSelect.removeChild(option);
        });
    });

    const learnset = POKEDEX[pokeName].Learnset;
    const firstMoveName = learnset[0];
    const learnsets = [...Array(MAX_MOVESET_NUM).keys()].map(i => {
        if (i == 0) {
            return learnset;
        } else {
            let result = learnset.filter(moveName => {
                return moveName !== firstMoveName;
            });
            result.unshift("なし");
            return result;
        }
    });

    learnsets.map((learnset, i) => {
        const moveSelect = moveSelects[i];
        learnset.map(moveName => {
            const option = document.createElement("option");
            option.innerText = moveName;
            option.value = moveName;
            moveSelect.appendChild(option);
        });
    });
}

function updateMoveSelects() {
    const moveSelects = MOVE_SELECT_IDS.map(moveSelectId => {
        return document.getElementById(moveSelectId);
    });

    const values = moveSelects.map(moveSelect => {
        return moveSelect.value;
    });
}

const MIN_POINT_UP = 0;
const MAX_POINT_UP = 3;
const POINT_UP_INPUT_IDS = [
    "move1-point-up-input",
    "move2-point-up-input",
    "move3-point-up-input",
    "move4-point-up-input",
];

const MIN_IV = 0;
const MAX_IV = 31;
const IV_INPUT_IDS = [
    "hp-iv-input", "atk-iv-input", "def-iv-input",
    "sp-atk-iv-input", "sp-def-iv-input", "speed-iv-input",
];

const MIN_EV = 0;
const MAX_EV = 252;

document.addEventListener("DOMContentLoaded", (event) => {
    const baseURL = "http://localhost:8080/dawn/";
    function makeFullURL(dataType) {
        return baseURL + `?data_type=${encodeURIComponent(dataType)}`;
    }

    const POKEMON_SELECT = document.getElementById("pokemon-select");

    let ALL_POKE_NAMES
    const allPokeNamesPromise =
        fetch(makeFullURL("all_poke_names"))
            .then(response => {
                return response.json();
            })
            .then(json => {
                return new Promise(resolve => {
                    ALL_POKE_NAMES = Array.from(JSON.parse(JSON.stringify(json)));
                    resolve();
                })
            })
            .catch(err => {
                console.error(err);
            });

    const pokedexPromise =
        fetch(makeFullURL("pokedex"))
            .then(response => {
                return response.json();
            })
            .then(json => {
                return new Promise(resolve => {
                    POKEDEX = JSON.parse(JSON.stringify(json));
                    resolve();
                })
            })
            .catch(err => {
                console.error(err);
            });

    POINT_UP_INPUT_IDS.map(pointUpInputId => {
        const pointUpInput = document.getElementById(pointUpInputId);
        pointUpInput.min = MIN_POINT_UP;
        pointUpInput.max = MAX_POINT_UP;
        pointUpInput.value = MAX_POINT_UP;
        pointUpInput.step = 1;
    })

    const NATURE_SELECT = document.getElementById("nature-select");
    let ALL_NATURES
    const allNaturesPromise =
        fetch(makeFullURL("all_natures"))
            .then(response => {
                return response.json();
            })
            .then(json => {
                return new Promise(resolve => {
                    ALL_NATURES = Array.from(JSON.parse(JSON.stringify(json)));
                    resolve();
                })
            });

    Promise.all([pokedexPromise, allPokeNamesPromise, allNaturesPromise])
        .then(() => {
            console.log(POKEDEX);
            console.log(ALL_POKE_NAMES);
            console.log(ALL_NATURES);
            ALL_POKE_NAMES.map(pokeName => {
                option = document.createElement("option");
                option.innerText = pokeName;
                option.value = pokeName;
                POKEMON_SELECT.appendChild(option);
            });

            const moveSelects = getMoveSelects();
            switchLearnset(ALL_POKE_NAMES[0], moveSelects);

            ALL_NATURES.map(nature => {
                option = document.createElement("option");
                option.innerText = nature;
                option.value = nature;
                NATURE_SELECT.appendChild(option);                
            });
        });

    IV_INPUT_IDS.map(ivInputId => {
        const ivInput = document.getElementById(ivInputId);
        ivInput.min = MIN_IV;
        ivInput.max = MAX_IV;
        ivInput.value = MAX_IV;
        ivInput.step = 1;

        ivInput.addEventListener("keydown", function(event) {
            const key = event.key;
            if (key === "ArrowUp" || key === "ArrowDown" || key === "Tab") {
                return;
            } else {
                event.preventDefault();
            }
        });
    });

    ["hp", "atk", "def", "sp-atk", "sp-def", "speed"].map(stat => {
        const ev = stat + "-ev"
        const evInputId = ev + "-input";
        const evInput = document.getElementById(evInputId);
        evInput.min = MIN_EV;
        evInput.max = MAX_EV;
        evInput.value = MIN_EV;
        evInput.step = 4;
        
        evInput.addEventListener("keydown", function(event) {
            const key = event.key;
            if (key === "ArrowUp" || key === "ArrowDown" || key === "Tab") {
                return;
            } else {
                event.preventDefault();
            }
        });

        const minEVButtonId = "min-" + ev + "-button";
        const minEVButton = document.getElementById(minEVButtonId);
        minEVButton.addEventListener("click", function() {
            evInput.value = MIN_EV;
        });

        const maxEVButtonId = "max-" + ev + "-button";
        const maxEVButton = document.getElementById(maxEVButtonId);
        maxEVButton.addEventListener("click", function() {
            evInput.value = MAX_EV;
        });
    });
});