const INDEX = new URLSearchParams(window.location.search).get("index");
var STORAGE = function() {
    const item = sessionStorage.getItem(INDEX);
    if (item == null) {
        return {
            pokeName:null,
            nature:null,

            move1Name:null,
            move1PointUp:null,

            move2Name:null,
            move2PointUp:null,

            move3Name:null,
            move3PointUp:null,

            move4Name:null,
            move4PointUp:null,

            hpIV:null,
            atkIV:null,
            defIV:null,
            spAtkIV:null,
            spDefIV:null,
            speedIV:null,

            hpEV:null,
            atkEV:null,
            defEV:null,
            spAtkEV:null,
            spDefEV:null,
            speedEV:null,
        }
    } else {
        return JSON.parse(JSON.stringify(item));
    }
}();

const EMPTY = "なし";

var POKEDEX;

const MAX_MOVESET_NUM = 4;

const MOVE_SELECT_IDS = [
    "move1-select",
    "move2-select",
    "move3-select",
    "move4-select",
]

function switchLearnset(pokeName, moveSelects) {
    moveSelects.map(moveSelect => {
        options = Array.from(moveSelect.options)
        options.map(option => {
            moveSelect.removeChild(option);
        });
    });

    const learnset = POKEDEX[pokeName].Learnset;
    for (let i=0; i < MAX_MOVESET_NUM; i++) {
        const moveSelect = moveSelects[i];
        let moveSelectValues;
        if (i != 0) {
            moveSelectValues = learnset.concat()
            moveSelectValues.unshift(EMPTY);
        } else {
            moveSelectValues = learnset;
        }
        moveSelectValues.map(moveName => {
            const option = document.createElement("option");
            option.innerText = moveName;
            option.value = moveName;
            moveSelect.appendChild(option);
        });
    };
    updateMoveSelects(moveSelects);
}

function updateMoveSelects(moveSelects) {
    const values = moveSelects.map(moveSelect => {
        return moveSelect.value;
    }).filter(moveName => {
        return moveName != EMPTY;
    });

    moveSelects.map(moveSelect => {
        Array.from(moveSelect.options).map(option => {
            if (values.includes(option.value)) {
                option.hidden = true;
            } else {
                option.hidden = false;
            }
        });
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
const MAX_SUM_EV = 510;
const EFFECT_EV = 4;

const EV_INPUT_IDS = [
    "hp-ev-input",
    "atk-ev-input",
    "def-ev-input",
    "sp-atk-ev-input",
    "sp-def-ev-input",
    "speed-ev-input",
]

const MIN_EV_BUTTON_IDS = [
    "min-hp-ev-button",
    "min-atk-ev-button",
    "min-def-ev-button",
    "min-sp-atk-ev-button",
    "min-sp-def-ev-button",
    "min-speed-ev-button",
]

const MAX_EV_BUTTON_IDS = [
    "max-hp-ev-button",
    "max-atk-ev-button",
    "max-def-ev-button",
    "max-sp-atk-ev-button",
    "max-sp-def-ev-button",
    "max-speed-ev-button",
]

const SUM_EV_H_ID = "sum-ev-h3";

function getSumEVText(sumEV) {
    return "合計努力値 : " + String(sumEV);
}

function getSumEV(evInputs) {
    return evInputs.map(evInput => {
        return parseInt(evInput.value, 10);
    }).reduce((sum, ev) => {
        return sum + ev;
    });
}

function updateSumEVInnerText(evInputs, sumEVH) {
    sumEVH.innerText = getSumEVText(getSumEV(evInputs));
}

const POKEMON_IMG_ID = "pokemon-img";
const BREED_BUTTON_ID = "file-save-button";

function getPokemonImgPath(pokeName) {
    return "img/" + pokeName + ".gif";
}

const BASE_URL = "http://localhost:8080/dawn/";

function makeFullURL(dataType) {
    return BASE_URL + `?data_type=${encodeURIComponent(dataType)}`;
}

document.addEventListener("DOMContentLoaded", (event) => {
    const POKEMON_SELECT = document.getElementById("pokemon-select");

    if (STORAGE.pokeName !== null) {
        POKEMON_SELECT.value = STORAGE.pokeName;
    }

    POKEMON_SELECT.addEventListener("change", () => {
        const pokeName = POKEMON_SELECT.value
        switchLearnset(pokeName, MOVE_SELECTS);
        POKEMON_IMG.src = getPokemonImgPath(pokeName);
    });

    let ALL_POKE_NAMES
    const allPokeNamesLoader =
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

    const pokedexLoader =
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

    const NATURE_SELECT = document.getElementById("nature-select");
    if (STORAGE.pokeName !== null) {
        NATURE_SELECT.value = STORAGE.pokeName;
    }

    let ALL_NATURES
    const allNaturesLoader =
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
    
    const MOVE_SELECTS = MOVE_SELECT_IDS.map(moveSelectId => {
        return document.getElementById(moveSelectId);
    });

    if (STORAGE !== null) {
        MOVE_SELECTS[0].value = STORAGE.move1Name;
    }

    if (STORAGE !== null) {
        MOVE_SELECTS[1].value = STORAGE.move2Name;
    }

    if (STORAGE !== null) {
        MOVE_SELECTS[2].value = STORAGE.move3Name;
    }

    if (STORAGE !== null) {
        MOVE_SELECTS[3].value = STORAGE.move4Name;
    }

    const POKEMON_IMG = document.getElementById(POKEMON_IMG_ID);

    Promise.all([pokedexLoader, allPokeNamesLoader, allNaturesLoader])
        .then(() => {
            ALL_POKE_NAMES.map(pokeName => {
                option = document.createElement("option");
                option.innerText = pokeName;
                option.value = pokeName;
                POKEMON_SELECT.appendChild(option);
            });

            POKEMON_IMG.src = getPokemonImgPath(ALL_POKE_NAMES[0]);

            switchLearnset(ALL_POKE_NAMES[0], MOVE_SELECTS);

            ALL_NATURES.map(nature => {
                option = document.createElement("option");
                option.innerText = nature;
                option.value = nature;
                NATURE_SELECT.appendChild(option);                
            });
        });

    MOVE_SELECTS.map(moveSelect => {
        moveSelect.addEventListener("change", () => {
            updateMoveSelects(moveSelect);
        });
    });

    const POINT_UP_INPUTS = POINT_UP_INPUT_IDS.map(pointUpInputId => {
        return document.getElementById(pointUpInputId);
    });

    POINT_UP_INPUTS.map(pointUpInput => {
        pointUpInput.min = MIN_POINT_UP;
        pointUpInput.max = MAX_POINT_UP;
        pointUpInput.value = MAX_POINT_UP;
        pointUpInput.step = 1;
    })

    const IV_INPUTS = IV_INPUT_IDS.map(ivInputId => {
        return document.getElementById(ivInputId);
    })

    if (STORAGE.hpIV !== null) {
        IV_INPUTS[0].value = STORAGE.hpIV
    }

    if (STORAGE.atkIV !== null) {
        IV_INPUTS[1].value = STORAGE.atkIV
    }

    if (STORAGE.defIV !== null) {
        IV_INPUTS[2].value = STORAGE.defIV
    }

    if (STORAGE.spAtkIV !== null) {
        IV_INPUTS[3].value = STORAGE.spAtkIV
    }

    if (STORAGE.spDefIV !== null) {
        IV_INPUTS[4].value = STORAGE.spDefIV
    }

    if (STORAGE.speedIV !== null) {
        IV_INPUTS[5].value = STORAGE.speedIV
    }

    IV_INPUTS.map(ivInput => {
        ivInput.min = MIN_IV;
        ivInput.max = MAX_IV;
        ivInput.value = MAX_IV;
        ivInput.step = 1;

        ivInput.addEventListener("keydown", () => {
            const key = event.key;
            if (key === "ArrowUp" || key === "ArrowDown" || key === "Tab") {
                return;
            } else {
                event.preventDefault();
            }
        });
    });

    const EV_INPUTS = EV_INPUT_IDS.map(evInputID => {
        return document.getElementById(evInputID);
    });

    if (STORAGE.hpEV !== null) {
        EV_INPUTS[0].value = STORAGE.hpEV
    }

    if (STORAGE.atkEV !== null) {
        EV_INPUTS[1].value = STORAGE.atkEV
    }

    if (STORAGE.defEV !== null) {
        EV_INPUTS[2].value = STORAGE.defEV
    }

    if (STORAGE.spAtkEV !== null) {
        EV_INPUTS[3].value = STORAGE.spAtkEV
    }

    if (STORAGE.spDefEV !== null) {
        EV_INPUTS[4].value = STORAGE.spDefEV
    }

    if (STORAGE.speedEV !== null) {
        EV_INPUTS[5].value = STORAGE.speedEV
    }

    const MIN_EV_BUTTONS = MIN_EV_BUTTON_IDS.map(minEVButtonId => {
        return document.getElementById(minEVButtonId);
    });

    const MAX_EV_BUTTONS = MAX_EV_BUTTON_IDS.map(maxEVButtonId => {
        return document.getElementById(maxEVButtonId);
    });

    const SUM_EV_H = document.getElementById(SUM_EV_H_ID);
    console.log(getSumEV(EV_INPUTS));
    SUM_EV_H.innerText = getSumEVText(getSumEV(EV_INPUTS));

    EV_INPUTS.map((evInput, i) => {
        evInput.min = MIN_EV;
        evInput.max = MAX_EV;
        evInput.value = MIN_EV;
        evInput.step = EFFECT_EV;
        
        evInput.addEventListener("keydown", event => {
            const key = event.key;
            if (key === "ArrowUp" || key === "ArrowDown" || key === "Tab") {
                return;
            } else {
                event.preventDefault();
            }
        });

        evInput.addEventListener("input", event => {
            if (getSumEV(EV_INPUTS) > MAX_SUM_EV) {
                event.target.value -= EFFECT_EV;
            } else {
                updateSumEVInnerText(EV_INPUTS, SUM_EV_H);
            }
        });

        MIN_EV_BUTTONS[i].addEventListener("click", () => {
            evInput.value = MIN_EV;
            updateSumEVInnerText(EV_INPUTS, SUM_EV_H);         
        });

        MAX_EV_BUTTONS[i].addEventListener("click", () => {
            const remainingEV = MAX_SUM_EV - getSumEV(EV_INPUTS) + parseInt(evInput.value, 10);
            if (remainingEV >= MAX_EV) {
                evInput.value = MAX_EV;
            } else {
                evInput.value = Math.floor(remainingEV / EFFECT_EV) * EFFECT_EV;
            }
            updateSumEVInnerText(EV_INPUTS, SUM_EV_H);
        });
    });

    const BREED_BUTTON = document.getElementById(BREED_BUTTON_ID);
    BREED_BUTTON.addEventListener("click", () => {
        console.clear();
        const movesetNames = [
            MOVE_SELECTS[0].value, MOVE_SELECTS[1].value,
            MOVE_SELECTS[2].value, MOVE_SELECTS[3].value,
        ].filter(moveName => {
            return moveName != EMPTY;
        });

        const moveset = {}
        movesetNames.map(moveName => {
            moveset[moveName] = {max:15, current:10}
        });

        const ivStat = {
            hp:parseInt(IV_INPUTS[0].value, 10),
            atk:parseInt(IV_INPUTS[1].value, 10),
            def:parseInt(IV_INPUTS[2].value, 10),
            spAtk:parseInt(IV_INPUTS[3].value, 10),
            spDef:parseInt(IV_INPUTS[4].value, 10),
            speed:parseInt(IV_INPUTS[5].value, 10),
        };

        const evStat = {
            hp:parseInt(EV_INPUTS[0].value, 10),
            atk:parseInt(EV_INPUTS[1].value, 10),
            def:parseInt(EV_INPUTS[2].value, 10),
            spAtk:parseInt(EV_INPUTS[3].value, 10),
            spDef:parseInt(EV_INPUTS[4].value, 10),
            speed:parseInt(EV_INPUTS[5].value, 10),
        };

        const pokemon = {
            name: POKEMON_SELECT.value,
            nature: NATURE_SELECT.value,
            moveset:moveset,
            ivstat:ivStat,
            evStat:evStat,
        };
        console.log(pokemon);

        let jsonString = JSON.stringify(pokemon, null, 2);
        let blob = new Blob([jsonString], { type: "application/json" });
        let url = URL.createObjectURL(blob);

        let a = document.createElement('a');
        a.href = url;
        a.download = "person.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });
});