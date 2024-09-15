const TEAM_INDEX = parseInt(new URLSearchParams(window.location.search).get("team_index"), 10);

let INIT_POKEMON;

const initPokemonSetter = initTeamSessionStorageSetter
    .then(() => {
        INIT_POKEMON = TeamSessionStorage.get(TEAM_INDEX);
    });

const POKEMON_IMG_ID = "pokemon-img";

document.addEventListener("DOMContentLoaded", () => {
    const POKE_NAME_SELECT = document.getElementById("poke-names");

    const LEVEL_INPUT = document.getElementById("levels");
    LEVEL_INPUT.min = MIN_LEVEL;
    LEVEL_INPUT.max = MAX_LEVEL;
    LEVEL_INPUT.step = 1;
    LEVEL_INPUT.value = STANDARD_LEVEL;
    const MAX_LEVEL_BUTTON = document.getElementById("max-level");
    const STANDARD_LEVEL_BUTTON = document.getElementById("standard-level");
    const MIN_LEVEL_BUTTON = document.getElementById("min-level");

    const NATURE_SELECT = document.getElementById("natures");
    const ABILITY_SELECT = document.getElementById("abilities");

    //ポケモン名が切り替わった時に、呼び出す。
    function switchAbility(pokeName) {
        const options = Array.from(ABILITY_SELECT);

        //要素を全て削除する。
        options.map(option => {
            ABILITY_SELECT.removeChild(option);
        });

        const abilities = POKEDEX[pokeName].Abilities
        //新しい要素を追加する。
        abilities.map(ability => {
            const option = document.createElement("option");
            option.innerText = ability;
            option.value = ability;
            ABILITY_SELECT.appendChild(option);
        });
    };

    const ITEM_SELECT = document.getElementById("items");

    const LEARNSET_SELECTS = [
        "learnset1",
        "learnset2",
        "learnset3",
        "learnset4",
    ].map(id => {
        return document.getElementById(id);
    })

    function hideLearnsetDuplicates() {
        const values = LEARNSET_SELECTS.map(select => {
            return select.value;
        }).filter(moveName => {
            return moveName != NONE;
        });

        LEARNSET_SELECTS.map(select => {
            Array.from(select.options).map(option => {
                //同じ技を2つ以上選択出来ないように、hiddenで隠す。
                if (values.includes(option.value)) {
                    option.hidden = true;
                } else {
                    option.hidden = false;
                }
            });
        });
    };

    //ポケモン名が切り替わった時に、呼び出す。
    function switchLearnset(pokeName) {
        //全ての要素(option)を削除する。
        LEARNSET_SELECTS.map(select => {
            const options = Array.from(select.options);
            options.map(option => {
                select.removeChild(option);
            });
        });

        //念のためconcatでコピーしておく。
        const learnset = POKEDEX[pokeName].Learnset.concat();
        for (const [i, select] of LEARNSET_SELECTS.entries()) {
            let values;
            if (i != 0) {
                values = learnset.concat();
                //1番目の技以外は、何も覚えさせない事が出来る為、NONE(なし)を選択肢として追加する。
                values.unshift(NONE);
            } else {
                values = learnset.concat();
            }

            //valuesを新たな値として、selectに追加する。
            values.map(moveName => {
                const option = document.createElement("option");
                option.innerText = moveName;
                option.value = moveName;
                select.appendChild(option);
            });
        };
        hideLearnsetDuplicates(LEARNSET_SELECTS);
    };

    const POINT_UP_SELECTS = [
        "move1-point-ups", "move2-point-ups",
        "move3-point-ups", "move4-point-ups",
    ].map(id => {
        return document.getElementById(id);
    });

    //技が切り替わった時に、呼び出す。
    function switchPointUp(i, moveName) {
        const select = POINT_UP_SELECTS[i];
        const options = Array.from(select.options);
        options.map(option => {
            select.removeChild(option);
        });
    
        if (moveName === NONE) {
            return
        }

        const basePP = MOVEDEX[moveName].BasePP;
        ALL_POINT_UPS.toReversed().map(pointUp => {
            const option = document.createElement("option");
            option.value = pointUp;
            option.innerText = `${pointUp}(${calcPowerPoint(basePP, pointUp)})`;
            select.appendChild(option);
        });
    };

    const INDIVIDUAL_INPUTS = [
        "hp-individuals",
        "atk-individuals",
        "def-individuals",
        "sp-atk-individuals",
        "sp-def-individuals",
        "speed-individuals",
    ].map(id => {
        return document.getElementById(id);
    });

    const MAX_INDIVIDUAL_BUTTONS = [
        "max-hp-individual",
        "max-atk-individual",
        "max-def-individual",
        "max-sp-atk-individual",
        "max-sp-def-individual",
        "max-speed-individual"
    ].map(id => {
        return document.getElementById(id);
    });

    const MIN_INDIVIDUAL_BUTTONS = [
        "min-hp-individual",
        "min-atk-individual",
        "min-def-individual",
        "min-sp-atk-individual",
        "min-sp-def-individual",
        "min-speed-individual"
    ].map(id => {
        return document.getElementById(id);
    });

    const EFFORT_INPUTS = [
        "hp-efforts",
        "atk-efforts",
        "def-efforts",
        "sp-atk-efforts",
        "sp-def-efforts",
        "speed-efforts",
    ].map(id => {
        return document.getElementById(id);
    });

    function getSumEffort() {
        return EFFORT_INPUTS.map(input => {
            return parseInt(input.value, 10);
        }).reduce((sum, ev) => {
            return sum + ev;
        });
    };

    const MAX_EFFORT_BUTTONS = [
        "max-hp-effort",
        "max-atk-effort",
        "max-def-effort",
        "max-sp-atk-effort",
        "max-sp-def-effort",
        "max-speed-effort",
    ].map(id => {
        return document.getElementById(id);
    });

    const MIN_EFFORT_BUTTONS = [
        "min-hp-effort",
        "min-atk-effort",
        "min-def-effort",
        "min-sp-atk-effort",
        "min-sp-def-effort",
        "min-speed-effort",
    ].map(id => {
        return document.getElementById(id);
    });

    const POKEMON_STAT_HEADING = document.getElementById("pokemon-stat");

    function updatePokemonStat(pokemon) {
        const stat = pokemon.stat;
        let text = "";
        text += "(HP：" + stat.maxHP + ")";
        text += " (攻撃：" + stat.atk + ")";
        text += " (防御：" + stat.def + ")";
        text += " (特攻：" + stat.spAtk + ")";
        text += " (特防：" + stat.spDef + ")";
        text += " (素早さ：" + stat.speed + ")";
        POKEMON_STAT_HEADING.innerText = text;
    }

    const SUM_EFFORT_HEADING = document.getElementById("sum-effort");

    function updateSumEffort() {
        SUM_EFFORT_HEADING.innerText = "合計努力値 : " + String(getSumEffort());
    };

    function makePokemon() {
        const moveNames = [
            LEARNSET_SELECTS[0].value, LEARNSET_SELECTS[1].value,
            LEARNSET_SELECTS[2].value, LEARNSET_SELECTS[3].value,
        ]

        const pointUps = POINT_UP_SELECTS.map((select, i) => {
            if (select.value === "") {
                return -1;
            } else {
                return parseInt(select.value, 10);
            }
        })

        const individualStat = {
            hp:parseInt(INDIVIDUAL_INPUTS[0].value, 10),
            atk:parseInt(INDIVIDUAL_INPUTS[1].value, 10),
            def:parseInt(INDIVIDUAL_INPUTS[2].value, 10),
            spAtk:parseInt(INDIVIDUAL_INPUTS[3].value, 10),
            spDef:parseInt(INDIVIDUAL_INPUTS[4].value, 10),
            speed:parseInt(INDIVIDUAL_INPUTS[5].value, 10),
        };

        const effortStat = {
            hp:parseInt(EFFORT_INPUTS[0].value, 10),
            atk:parseInt(EFFORT_INPUTS[1].value, 10),
            def:parseInt(EFFORT_INPUTS[2].value, 10),
            spAtk:parseInt(EFFORT_INPUTS[3].value, 10),
            spDef:parseInt(EFFORT_INPUTS[4].value, 10),
            speed:parseInt(EFFORT_INPUTS[5].value, 10),
        };

        const pokemon = new Pokemon();
        pokemon.name = POKE_NAME_SELECT.value;
        pokemon.level = parseInt(LEVEL_INPUT.value, 10);
        pokemon.nature = NATURE_SELECT.value;
        pokemon.ability = ABILITY_SELECT.value;
        pokemon.item = ITEM_SELECT.value;
        pokemon.moveNames = moveNames;
        pokemon.pointUps = pointUps;
        pokemon.updateMoveset();
        pokemon.individualStat = individualStat;
        pokemon.effortStat = effortStat;
        pokemon.updateStat();
        return pokemon;
    };

    POKE_NAME_SELECT.addEventListener("change", () => {
        const pokeName = POKE_NAME_SELECT.value
        switchAbility(pokeName);
        switchLearnset(pokeName);
        updatePokemonStat(makePokemon());
        POKEMON_IMG.src = getPokemonImgPath(pokeName);
    });

    LEVEL_INPUT.addEventListener("keydown", () => {
        const key = event.key;
        if (key === "ArrowUp" || key === "ArrowDown" || key === "Tab") {
            return;
        } else {
            event.preventDefault();
        }
    });

    LEVEL_INPUT.addEventListener("input", () => {
        updatePokemonStat(makePokemon());
    });

    MAX_LEVEL_BUTTON.addEventListener("click", ()=> {
        LEVEL_INPUT.value = MAX_LEVEL;
        updatePokemonStat(makePokemon());
    });

    STANDARD_LEVEL_BUTTON.addEventListener("click", () => {
        LEVEL_INPUT.value = STANDARD_LEVEL;
        updatePokemonStat(makePokemon());
    })

    MIN_LEVEL_BUTTON.addEventListener("click", () => {
        LEVEL_INPUT.value = MIN_LEVEL;
        updatePokemonStat(makePokemon());
    });

    NATURE_SELECT.addEventListener("change", () => {
        updatePokemonStat(makePokemon());
    })

    const POKEMON_IMG = document.getElementById(POKEMON_IMG_ID);

    initPokemonSetter
        .then(() => {
            ALL_POKE_NAMES.map(pokeName => {
                option = document.createElement("option");
                option.innerText = pokeName;
                option.value = pokeName;
                POKE_NAME_SELECT.appendChild(option);
            });

            ALL_NATURES.map(nature => {
                option = document.createElement("option");
                option.innerText = nature;
                option.value = nature;
                NATURE_SELECT.appendChild(option);
            });

            [NONE].concat(ALL_ITEMS).map(item => {
                option = document.createElement("option");
                option.innerText = item;
                option.value = item;
                ITEM_SELECT.appendChild(option);
            });
        })
        .then(() => {
            if (INIT_POKEMON.name !== null) {
                POKE_NAME_SELECT.value = INIT_POKEMON.name;
                switchAbility(POKE_NAME_SELECT.value);
                switchLearnset(POKE_NAME_SELECT.value);
                POKEMON_IMG.src = getPokemonImgPath(POKE_NAME_SELECT.value);
            } else {
                POKEMON_IMG.src = getPokemonImgPath(ALL_POKE_NAMES[0]);
            }

            if (INIT_POKEMON.nature !== null) {
                NATURE_SELECT.value = INIT_POKEMON.nature;
            }

            if (INIT_POKEMON.ability !== null) {
                ABILITY_SELECT.value = INIT_POKEMON.ability;
            }

            if (INIT_POKEMON.item !== null) {
                ITEM_SELECT.value = INIT_POKEMON.item;
            }

            if (INIT_POKEMON.moveNames !== null) {
                LEARNSET_SELECTS.map((select, i) => {
                    select.value = INIT_POKEMON.moveNames[i];
                });
            }

            LEARNSET_SELECTS.map((select, i) => {
                select.addEventListener("change", () => {
                    hideLearnsetDuplicates();
                    switchPointUp(i, select.value);
                });
            });

            for (const [i, select] of LEARNSET_SELECTS.entries()) {
                switchPointUp(i, select.value);
            }

            if (INIT_POKEMON.pointUps !== null) {
                POINT_UP_SELECTS.map((select, i) => {
                    const moveName = LEARNSET_SELECTS[i].value
                    if (moveName !== NONE) {
                        select.value = INIT_POKEMON.pointUps[i];
                    };
                });
            }
        });

    initPokemonSetter
        .then(() => {
            INDIVIDUAL_INPUTS.map((ivInput, i) => {
                ivInput.min = MIN_INDIVIDUAL;
                ivInput.max = MAX_INDIVIDUAL;
                const initIV = INIT_POKEMON.getIndividuals()[i];
                if (initIV !== null) {
                    ivInput.value = initIV;
                } else {
                    ivInput.value = MAX_IV;
                }
                ivInput.step = 1;
        
                ivInput.addEventListener("keydown", event => {
                    const key = event.key;
                    if (key === "ArrowUp" || key === "ArrowDown" || key === "Tab") {
                        return;
                    } else {
                        event.preventDefault();
                    }
                });

                ivInput.addEventListener("input", () => {
                    updatePokemonStat(makePokemon());
                });

                MAX_INDIVIDUAL_BUTTONS[i].addEventListener("click", () => {
                    ivInput.value = MAX_INDIVIDUAL;
                    updatePokemonStat(makePokemon());
                });
        
                MIN_INDIVIDUAL_BUTTONS[i].addEventListener("click", () => {
                    ivInput.value = MIN_INDIVIDUAL;
                    updatePokemonStat(makePokemon());
                });
            });
        });

    initPokemonSetter
        .then(() => {
            EFFORT_INPUTS.map((evInput, i) => {
                evInput.min = MIN_EFFORT;
                evInput.max = MAX_EFFORT;
        
                const initEV = INIT_POKEMON.getEfforts()[i];
                if (initEV !== null) {
                    evInput.value = initEV;
                } else {
                    evInput.value = MIN_EFFORT;
                }
                evInput.step = EFFECT_EFFORT;
                
                evInput.addEventListener("keydown", event => {
                    const key = event.key;
                    if (key === "ArrowUp" || key === "ArrowDown" || key === "Tab") {
                        return;
                    } else {
                        event.preventDefault();
                    }
                });
        
                evInput.addEventListener("input", event => {
                    if (getSumEffort() > MAX_SUM_EFFORT) {
                        event.target.value -= EFFECT_EFFORT;
                    } else {
                        updateSumEffort();
                    }
                    updatePokemonStat(makePokemon());
                });
        
                MAX_EFFORT_BUTTONS[i].addEventListener("click", () => {
                    const remainingEV = MAX_SUM_EFFORT - getSumEffort(EFFORT_INPUTS) + parseInt(evInput.value, 10);
                    if (remainingEV >= MAX_EFFORT) {
                        evInput.value = MAX_EFFORT;
                    } else {
                        evInput.value = Math.floor(remainingEV / EFFECT_EFFORT) * EFFECT_EFFORT;
                    }
                    updatePokemonStat(makePokemon());
                    updateSumEffort();
                });
        
                MIN_EFFORT_BUTTONS[i].addEventListener("click", () => {
                    evInput.value = MIN_EFFORT;
                    updatePokemonStat(makePokemon());
                    updateSumEffort();         
                });
            });
        })
        .then(() => {
            //初期化
            updatePokemonStat(makePokemon());
            updateSumEffort();         
        });

    const FILE_SAVE_BUTTON = document.getElementById("file-save");
    movedexLoader
        .then(() => {
            FILE_SAVE_BUTTON.addEventListener("click", () => {
                const pokemon = makePokemon();
                let jsonString = JSON.stringify(pokemon, null, 2);
                let blob = new Blob([jsonString], { type: "application/json" });
                let url = URL.createObjectURL(blob);
                
                let a = document.createElement('a');
                a.href = url;
                a.download = pokemon.name + ".json";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            });
        });

    const FILE_LOAD_INPUT = document.getElementById("file-load");
    FILE_LOAD_INPUT.addEventListener("change", event => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = e => {
            const pokemon = objectToPokemon(JSON.parse(e.target.result));
            console.log("abi", pokemon.name, pokemon.ability);
            POKE_NAME_SELECT.value = pokemon.name;

            NATURE_SELECT.value = pokemon.nature;
            switchAbility(pokemon.name);
            ABILITY_SELECT.value = pokemon.ability;
            ITEM_SELECT.value = pokemon.item;

            switchLearnset(pokemon.name);
            pokemon.moveNames.map((moveName, i) => {
                LEARNSET_SELECTS[i].value = moveName;
            });

            pokemon.pointUps.map((pointUp, i) => {
                POINT_UP_SELECTS[i].value = pointUp;
                switchPointUp(i, pokemon.moveNames[i]);
            });

            const ivArray = pokemon.getIndividuals();
            INDIVIDUAL_INPUTS.map((input, i) => {
                input.value = ivArray[i];
            });

            const evArray = pokemon.getEfforts();
            EFFORT_INPUTS.map((input, i) => {
                input.value = evArray[i];                
            })

            updateSumEffort();
            POKEMON_IMG.src = getPokemonImgPath(pokemon.name);
        };
        reader.readAsText(file);
    });

    const PAGE_BACK_BUTTON = document.getElementById("page-back");

    movedexLoader.
        then(() => {
            PAGE_BACK_BUTTON.addEventListener("click", () => {
                const pokemon = makePokemon();
                TeamSessionStorage.set(pokemon, TEAM_INDEX);
                history.back();
            });
        });
});