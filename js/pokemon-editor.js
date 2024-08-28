const TEAM_INDEX = parseInt(new URLSearchParams(window.location.search).get("team_index"), 10);

let INIT_POKEMON;

const initPokemonSetter = initPokemonSessionStorageSetter
    .then(() => {
        INIT_POKEMON = PokemonSessionStorage.get(TEAM_INDEX);
    });


const LEVEL_INPUT_ID = "level-input";

const MOVE_SELECT_IDS = [
    "move1-select",
    "move2-select",
    "move3-select",
    "move4-select",
]

function switchLearnset(pokeName, moveSelects) {
    moveSelects.map(moveSelect => {
        const options = Array.from(moveSelect.options);
        options.map(option => {
            moveSelect.removeChild(option);
        });
    });

    const learnset = POKEDEX[pokeName].Learnset;
    for (let i=0; i < MAX_MOVESET_NUM; i++) {
        const moveSelect = moveSelects[i];
        let moveSelectValues;
        if (i != 0) {
            moveSelectValues = learnset.concat();
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

function getPointUpInnerText(pointUp, basePP) {
    return `${pointUp}(${calcPowerPoint(basePP, pointUp)})`
}

function switchPointUpSelect(pointUpSelect, moveName) {
    const options = Array.from(pointUpSelect.options);
    options.map(option => {
        pointUpSelect.removeChild(option);
    });

    if (moveName === EMPTY) {
        return
    }

    const basePP = MOVEDEX[moveName].BasePP;
    ALL_POINT_UPS.toReversed().map(pointUp => {
        const option = document.createElement("option");
        option.value = pointUp;
        option.innerText = getPointUpInnerText(pointUp, basePP);
        pointUpSelect.appendChild(option);
    });
}

const POINT_UP_SELECT_IDS = [
    "move1-point-up-select",
    "move2-point-up-select",
    "move3-point-up-select",
    "move4-point-up-select",
];

const IV_INPUT_IDS = [
    "hp-iv-input", "atk-iv-input", "def-iv-input",
    "sp-atk-iv-input", "sp-def-iv-input", "speed-iv-input",
];

const MAX_IV_BUTTON_IDS = [
    "max-hp-iv-button",
    "max-atk-iv-button",
    "max-def-iv-button",
    "max-sp-atk-iv-button",
    "max-sp-def-iv-button",
    "max-speed-iv-button",
]

const MIN_IV_BUTTON_IDS = [
    "min-hp-iv-button",
    "min-atk-iv-button",
    "min-def-iv-button",
    "min-sp-atk-iv-button",
    "min-sp-def-iv-button",
    "min-speed-iv-button",
]

const EV_INPUT_IDS = [
    "hp-ev-input",
    "atk-ev-input",
    "def-ev-input",
    "sp-atk-ev-input",
    "sp-def-ev-input",
    "speed-ev-input",
]

const MAX_EV_BUTTON_IDS = [
    "max-hp-ev-button",
    "max-atk-ev-button",
    "max-def-ev-button",
    "max-sp-atk-ev-button",
    "max-sp-def-ev-button",
    "max-speed-ev-button",
]

const MIN_EV_BUTTON_IDS = [
    "min-hp-ev-button",
    "min-atk-ev-button",
    "min-def-ev-button",
    "min-sp-atk-ev-button",
    "min-sp-def-ev-button",
    "min-speed-ev-button",
]

const SUM_EV_HEADING_ID = "sum-ev-h3";
const STAT_HEADING_ID = "stat-h3";

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

function updateSumEVInnerText(evInputs, sumEVHeading) {
    sumEVHeading.innerText = getSumEVText(getSumEV(evInputs));
}

function updatePokemonStatInnerText(statHeading, pokemon) {
    statHeading.innerText = pokemon.getStatText()
}

const POKEMON_IMG_ID = "pokemon-img";
const FILE_SAVE_BUTTON_ID = "file-save-button";

document.addEventListener("DOMContentLoaded", () => {
    const POKEMON_SELECT = document.getElementById("pokemon-select");

    POKEMON_SELECT.addEventListener("change", () => {
        const pokeName = POKEMON_SELECT.value
        switchLearnset(pokeName, MOVE_SELECTS);
        updatePokemonStatInnerText(STAT_HEADING, makePokemon());
        POKEMON_IMG.src = getPokemonImgPath(pokeName);
    });

    const LEVEL_INPUT = document.getElementById("level-input");
    LEVEL_INPUT.min = MIN_LEVEL;
    LEVEL_INPUT.max = MAX_LEVEL;
    LEVEL_INPUT.step = 1;
    LEVEL_INPUT.value = STANDARD_LEVEL;

    LEVEL_INPUT.addEventListener("keydown", () => {
        const key = event.key;
        if (key === "ArrowUp" || key === "ArrowDown" || key === "Tab") {
            return;
        } else {
            event.preventDefault();
        }
    });

    LEVEL_INPUT.addEventListener("input", () => {
        updatePokemonStatInnerText(STAT_HEADING, makePokemon());
    });

    const MAX_LEVEL_BUTTON = document.getElementById("max-level-button");
    MAX_LEVEL_BUTTON.addEventListener("click", ()=> {
        LEVEL_INPUT.value = MAX_LEVEL;
        updatePokemonStatInnerText(STAT_HEADING, makePokemon());
    });

    const STANDARD_LEVEL_BUTTON = document.getElementById("standard-level-button");
    STANDARD_LEVEL_BUTTON.addEventListener("click", () => {
        LEVEL_INPUT.value = STANDARD_LEVEL;
        updatePokemonStatInnerText(STAT_HEADING, makePokemon());
    })

    const MIN_LEVEL_BUTTON = document.getElementById("min-level-button");
    MIN_LEVEL_BUTTON.addEventListener("click", () => {
        LEVEL_INPUT.value = MIN_LEVEL;
        updatePokemonStatInnerText(STAT_HEADING, makePokemon());
    });

    const NATURE_SELECT = document.getElementById("nature-select");
    NATURE_SELECT.addEventListener("change", () => {
        updatePokemonStatInnerText(STAT_HEADING, makePokemon());
    })

    const MOVE_SELECTS = MOVE_SELECT_IDS.map(moveSelectId => {
        return document.getElementById(moveSelectId);
    });

    const POINT_UP_SELECTS = POINT_UP_SELECT_IDS.map(pointUpSelectId => {
        return document.getElementById(pointUpSelectId);
    });

    const POKEMON_IMG = document.getElementById(POKEMON_IMG_ID);

    initPokemonSetter
        .then(() => {
            ALL_POKE_NAMES.map(pokeName => {
                option = document.createElement("option");
                option.innerText = pokeName;
                option.value = pokeName;
                POKEMON_SELECT.appendChild(option);
            });

            switchLearnset(ALL_POKE_NAMES[0], MOVE_SELECTS);

            ALL_NATURES.map(nature => {
                option = document.createElement("option");
                option.innerText = nature;
                option.value = nature;
                NATURE_SELECT.appendChild(option);                
            });
        })
        .then(() => {
            if (INIT_POKEMON.name !== null) {
                POKEMON_SELECT.value = INIT_POKEMON.name;
                switchLearnset(POKEMON_SELECT.value, MOVE_SELECTS);
                POKEMON_IMG.src = getPokemonImgPath(POKEMON_SELECT.value);
            } else {
                POKEMON_IMG.src = getPokemonImgPath(ALL_POKE_NAMES[0]);
            }

            if (INIT_POKEMON.nature !== null) {
                NATURE_SELECT.value = INIT_POKEMON.nature;
            }

            if (INIT_POKEMON.moveNames !== null) {
                MOVE_SELECTS.map((moveSelect, i) => {
                    moveSelect.value = INIT_POKEMON.moveNames[i];
                });
            }

            MOVE_SELECTS.map((moveSelect, i) => {
                moveSelect.addEventListener("change", () => {
                    updateMoveSelects(MOVE_SELECTS);
                    switchPointUpSelect(POINT_UP_SELECTS[i], moveSelect.value);
                });
            });

            POINT_UP_SELECTS.map((pointUpSelect, i) => {
                switchPointUpSelect(pointUpSelect, MOVE_SELECTS[i].value);
            });

            if (INIT_POKEMON.pointUps !== null) {
                POINT_UP_SELECTS.map((pointUpSelect, i) => {
                    const moveName = MOVE_SELECTS[i].value
                    if (moveName !== EMPTY) {
                        pointUpSelect.value = INIT_POKEMON.pointUps[i];
                    }
                });
            }
        });

    const IV_INPUTS = IV_INPUT_IDS.map(ivInputId => {
        return document.getElementById(ivInputId);
    });

    const MAX_IV_BUTTONS = MAX_IV_BUTTON_IDS.map(maxIVButtonID => {
        return document.getElementById(maxIVButtonID);
    });
    
    const MIN_IV_BUTTONS = MIN_IV_BUTTON_IDS.map(minIVButtonID => {
        return document.getElementById(minIVButtonID);
    });

    initPokemonSetter
        .then(() => {
            IV_INPUTS.map((ivInput, i) => {
                ivInput.min = MIN_IV;
                ivInput.max = MAX_IV;
                const initIV = INIT_POKEMON.getIVArray()[i];
                if (initIV !== null) {
                    ivInput.value = initIV;
                } else {
                    ivInput.value = MAX_IV;
                }
                ivInput.step = 1;
        
                ivInput.addEventListener("keydown", () => {
                    const key = event.key;
                    if (key === "ArrowUp" || key === "ArrowDown" || key === "Tab") {
                        return;
                    } else {
                        event.preventDefault();
                    }
                });

                ivInput.addEventListener("input", () => {
                    updatePokemonStatInnerText(STAT_HEADING, makePokemon());
                });

                MAX_IV_BUTTONS[i].addEventListener("click", () => {
                    ivInput.value = MAX_IV;
                    updatePokemonStatInnerText(STAT_HEADING, makePokemon());
                });
        
                MIN_IV_BUTTONS[i].addEventListener("click", () => {
                    ivInput.value = MIN_IV;
                    updatePokemonStatInnerText(STAT_HEADING, makePokemon());
                });
            });
        });

    const EV_INPUTS = EV_INPUT_IDS.map(evInputID => {
        return document.getElementById(evInputID);
    });

    const MAX_EV_BUTTONS = MAX_EV_BUTTON_IDS.map(maxEVButtonId => {
        return document.getElementById(maxEVButtonId);
    });

    const MIN_EV_BUTTONS = MIN_EV_BUTTON_IDS.map(minEVButtonId => {
        return document.getElementById(minEVButtonId);
    });

    const SUM_EV_HEADING = document.getElementById(SUM_EV_HEADING_ID);
    const STAT_HEADING = document.getElementById(STAT_HEADING_ID);

    initPokemonSetter
        .then(() => {
            EV_INPUTS.map((evInput, i) => {
                evInput.min = MIN_EV;
                evInput.max = MAX_EV;
        
                const initEV = INIT_POKEMON.getEVArray()[i];
                if (initEV !== null) {
                    evInput.value = initEV;
                } else {
                    evInput.value = MIN_EV;
                }
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
                        updateSumEVInnerText(EV_INPUTS, SUM_EV_HEADING);
                    }
                    updatePokemonStatInnerText(STAT_HEADING, makePokemon());
                });
        
                MAX_EV_BUTTONS[i].addEventListener("click", () => {
                    const remainingEV = MAX_SUM_EV - getSumEV(EV_INPUTS) + parseInt(evInput.value, 10);
                    if (remainingEV >= MAX_EV) {
                        evInput.value = MAX_EV;
                    } else {
                        evInput.value = Math.floor(remainingEV / EFFECT_EV) * EFFECT_EV;
                    }
                    updatePokemonStatInnerText(STAT_HEADING, makePokemon());
                    updateSumEVInnerText(EV_INPUTS, SUM_EV_HEADING);     
                });
        
                MIN_EV_BUTTONS[i].addEventListener("click", () => {
                    evInput.value = MIN_EV;
                    updatePokemonStatInnerText(STAT_HEADING, makePokemon());
                    updateSumEVInnerText(EV_INPUTS, SUM_EV_HEADING);         
                });
            });
        })
        .then(() => {
            SUM_EV_HEADING.innerText = getSumEVText(getSumEV(EV_INPUTS));
            updatePokemonStatInnerText(STAT_HEADING, makePokemon());
        });

    function makePokemon() {
        const moveNames = [
            MOVE_SELECTS[0].value, MOVE_SELECTS[1].value,
            MOVE_SELECTS[2].value, MOVE_SELECTS[3].value,
        ]

        const pointUps = POINT_UP_SELECTS.map((pointUpSelect, i) => {
            if (pointUpSelect.value == "") {
                return -1;
            } else {
                return parseInt(pointUpSelect.value, 10);
            }
        })

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

        const pokemon = new Pokemon();
        pokemon.name = POKEMON_SELECT.value;
        pokemon.level = parseInt(LEVEL_INPUT.value, 10);
        pokemon.nature = NATURE_SELECT.value;
        pokemon.moveNames = moveNames;
        pokemon.pointUps = pointUps;
        pokemon.updateMoveset();
        pokemon.ivStat = ivStat;
        pokemon.evStat = evStat;
        pokemon.updateStat();
        return pokemon;
    }

    const FILE_SAVE_BUTTON = document.getElementById(FILE_SAVE_BUTTON_ID);
    movedexLoader
        .then(() => {
            FILE_SAVE_BUTTON.addEventListener("click", () => {
                const pokemon = makePokemon();
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

    const FILE_LOAD_INPUT = document.getElementById("file-load-input");
    FILE_LOAD_INPUT.addEventListener("change", event => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = e => {
            const pokemon = objectToPokemon(JSON.parse(e.target.result));

            POKEMON_SELECT.value = pokemon.name;
            switchLearnset(pokemon.name, MOVE_SELECTS);

            NATURE_SELECT.value = pokemon.nature;

            pokemon.moveNames.map((moveName, i) => {
                MOVE_SELECTS[i].value = moveName;
            });

            pokemon.pointUps.map((pointUp, i) => {
                POINT_UP_INPUTS[i].value = pointUp;
            });

            const ivArray = pokemon.getIVArray();
            IV_INPUTS.map((ivInput, i) => {
                ivInput.value = ivArray[i];
            });

            const evArray = pokemon.getEVArray();
            EV_INPUTS.map((evInput, i) => {
                evInput.value = evArray[i];                
            })

            SUM_EV_HEADING.innerText = getSumEVText(getSumEV(EV_INPUTS));
            POKEMON_IMG.src = getPokemonImgPath(pokemon.name);
        };
        reader.readAsText(file);
    });

    const PAGE_BACK_BUTTON = document.getElementById("page-back-button");

    movedexLoader.
        then(() => {
            PAGE_BACK_BUTTON.addEventListener("click", () => {
                const pokemon = makePokemon();
                PokemonSessionStorage.set(pokemon, TEAM_INDEX);
                history.back();
            });
        });
});