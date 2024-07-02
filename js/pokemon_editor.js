class Pokemon {
    constructor() {
        this.pokeName = null;
        this.nature = null;

        this.moveNames = null;
        this.pointUps = null;

        this.ivStat = {
            hp:null,
            atk:null,
            def:null,
            spAtk:null,
            spDef:null,
            speed:null,
        };

        this.evStat = {
            hp:null,
            atk:null,
            def:null,
            spAtk:null,
            spDef:null,
            speed:null,
        };
    }

    getIVArray() {
        return [
            this.ivStat.hp,
            this.ivStat.atk,
            this.ivStat.def,
            this.ivStat.spAtk,
            this.ivStat.spDef,
            this.ivStat.speed,
        ];
    }

    getEVArray() {
        return [
            this.evStat.hp,
            this.evStat.atk,
            this.evStat.def,
            this.evStat.spAtk,
            this.evStat.spDef,
            this.evStat.speed,
        ];
    }
}

function objectToPokemon(obj) {
    const pokemon = new Pokemon();
    pokemon.name = obj.name;
    pokemon.nature = obj.nature;
    pokemon.moveNames = obj.moveNames;
    pokemon.pointUps = obj.pointUps;
    pokemon.ivStat = obj.ivStat;
    pokemon.evStat = obj.evStat;
    return pokemon;
}

const INDEX = new URLSearchParams(window.location.search).get("index");

var INIT_POKEMON = function() {
    const item = sessionStorage.getItem(INDEX);
    if (item === null) {
        return new Pokemon();
    } else {
        return objectToPokemon(JSON.parse(item));
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

    const POKEMON_IMG = document.getElementById(POKEMON_IMG_ID);

    Promise.all([pokedexLoader, allPokeNamesLoader, allNaturesLoader])
        .then(() => {
            ALL_POKE_NAMES.map(pokeName => {
                option = document.createElement("option");
                option.innerText = pokeName;
                option.value = pokeName;
                POKEMON_SELECT.appendChild(option);
                console.log("通過", pokeName);
            });

            POKEMON_IMG.src = getPokemonImgPath(ALL_POKE_NAMES[0]);

            switchLearnset(ALL_POKE_NAMES[0], MOVE_SELECTS);

            ALL_NATURES.map(nature => {
                option = document.createElement("option");
                option.innerText = nature;
                option.value = nature;
                NATURE_SELECT.appendChild(option);                
            });
        })
        .then(() => {
            if (INIT_POKEMON.pokeName !== null) {
                POKEMON_SELECT.value = INIT_POKEMON.name;
                switchLearnset(POKEMON_SELECT.value, MOVE_SELECTS);
            }

            if (INIT_POKEMON.nature !== null) {
                NATURE_SELECT.value = INIT_POKEMON.nature;
            }

            if (INIT_POKEMON.moveNames !== null) {
                console.log("MOVE_SELECTS", MOVE_SELECTS);
                MOVE_SELECTS.map((moveSelect, i) => {
                    console.log("ms.v", moveSelect.value);
                    moveSelect.value = INIT_POKEMON.moveNames[i];
                });
            }
        });

    MOVE_SELECTS.map(moveSelect => {
        moveSelect.addEventListener("change", () => {
            updateMoveSelects(MOVE_SELECTS);
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

    const MAX_IV_BUTTONS = MAX_IV_BUTTON_IDS.map(maxIVButtonID => {
        return document.getElementById(maxIVButtonID);
    });
    
    const MIN_IV_BUTTONS = MIN_IV_BUTTON_IDS.map(minIVButtonID => {
        return document.getElementById(minIVButtonID);
    });

    IV_INPUTS.map((ivInput, i) => {
        ivInput.min = MIN_IV;
        ivInput.max = MAX_IV;
        const ivArray = INIT_POKEMON.getIVArray();
        if (ivArray[i] !== null) {
            ivInput.value = ivArray[i];
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

        MAX_IV_BUTTONS[i].addEventListener("click", () => {
            ivInput.value = MAX_IV;
        });

        MIN_IV_BUTTONS[i].addEventListener("click", () => {
            ivInput.value = MIN_IV;
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
                updateSumEVInnerText(EV_INPUTS, SUM_EV_HEADING);
            }
        });

        MAX_EV_BUTTONS[i].addEventListener("click", () => {
            const remainingEV = MAX_SUM_EV - getSumEV(EV_INPUTS) + parseInt(evInput.value, 10);
            if (remainingEV >= MAX_EV) {
                evInput.value = MAX_EV;
            } else {
                evInput.value = Math.floor(remainingEV / EFFECT_EV) * EFFECT_EV;
            }
            updateSumEVInnerText(EV_INPUTS, SUM_EV_HEADING);
        });

        MIN_EV_BUTTONS[i].addEventListener("click", () => {
            evInput.value = MIN_EV;
            updateSumEVInnerText(EV_INPUTS, SUM_EV_HEADING);         
        });
    });

    SUM_EV_HEADING.innerText = getSumEVText(getSumEV(EV_INPUTS));

    function makePokemon() {
        const moveNames = [
            MOVE_SELECTS[0].value, MOVE_SELECTS[1].value,
            MOVE_SELECTS[2].value, MOVE_SELECTS[3].value,
        ]

        const pointUps = [
            POINT_UP_INPUTS[0].value, POINT_UP_INPUTS[1].value,
            POINT_UP_INPUTS[2].value, POINT_UP_INPUTS[3].value,
        ]

        const moveset = {}
        moveNames.map(moveName => {
            if (moveName != EMPTY) {
                moveset[moveName] = {max:15, current:10}
            }
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

        return {
            name: POKEMON_SELECT.value,
            nature: NATURE_SELECT.value,
            moveNames:moveNames,
            pointUps:pointUps,
            moveset:moveset,
            ivStat:ivStat,
            evStat:evStat,
        };
    }

    const BREED_BUTTON = document.getElementById(BREED_BUTTON_ID);
    BREED_BUTTON.addEventListener("click", () => {
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

    const FILE_LOAD_INPUT = document.getElementById("file-load-input");
    FILE_LOAD_INPUT.addEventListener("change", function(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
            const pokemon = JSON.parse(e.target.result);

            POKEMON_SELECT.value = pokemon.name;
            switchLearnset(pokemon.name, MOVE_SELECTS);

            NATURE_SELECT.value = pokemon.nature;

            pokemon.moveNames.map((moveName, i) => {
                MOVE_SELECTS[i].value = moveName;
            });

            pokemon.pointUps.map((pointUp, i) => {
                POINT_UP_INPUTS[i].value = pointUp;
            });

            IV_INPUTS[0].value = pokemon.ivStat.hp;
            IV_INPUTS[1].value = pokemon.ivStat.atk;
            IV_INPUTS[2].value = pokemon.ivStat.def;
            IV_INPUTS[3].value = pokemon.ivStat.spAtk;
            IV_INPUTS[4].value = pokemon.ivStat.spDef;
            IV_INPUTS[5].value = pokemon.ivStat.speed;

            EV_INPUTS[0].value = pokemon.evStat.hp;
            EV_INPUTS[1].value = pokemon.evStat.atk;
            EV_INPUTS[2].value = pokemon.evStat.def;
            EV_INPUTS[3].value = pokemon.evStat.spAtk;
            EV_INPUTS[4].value = pokemon.evStat.spDef;
            EV_INPUTS[5].value = pokemon.evStat.speed;

            SUM_EV_HEADING.innerText = getSumEVText(getSumEV(EV_INPUTS));
            POKEMON_IMG.src = getPokemonImgPath(pokemon.name);
        };
        reader.readAsText(file);
    });

    const PAGE_BACK_BUTTON = document.getElementById("page-back-button");
    PAGE_BACK_BUTTON.addEventListener("click", function(event) {
        // ここにブラウザバック時の処理を記述
        const pokemon = makePokemon();
        sessionStorage.setItem(INDEX, JSON.stringify(pokemon));
        console.log('ブラウザバックが発生しました');
        // 他の処理もここに書く
    });
});