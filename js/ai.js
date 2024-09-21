let currentSrcIndex = 0;
let globalCurrentBattle = null;

document.addEventListener("DOMContentLoaded", () => {
    function getPokeNameGenderLevelText(pokeName, gender, level) {
        return pokeName + " " + gender + " " + "Lv." + level;
    }

    function getHPText(max, current) {
        return current + " / " + max;
    }

    const PLAYER_LEAD_POKE_NAME_GENDER_LEVEL_SPANS = document.getElementsByClassName("player-lead-poke-name-gender-level");
    const PLAYER_LEAD_HP_SPANS = document.getElementsByClassName("player-lead-hp");
    const PLAYER_LEAD_POKEMON_IMGS = document.getElementsByClassName("player-lead-pokemon-img");
    const AI_LEAD_POKE_NAME_GENDER_LEVEL_SPANS = document.getElementsByClassName("ai-lead-poke-name-gender-level");
    const AI_LEAD_HP_SPANS = document.getElementsByClassName("ai-lead-hp");
    const AI_LEAD_POKEMON_IMGS = document.getElementsByClassName("ai-lead-pokemon-img");
    const BATTLE_MESSAGE = document.getElementById("battle-msg");
    
    function updateDisplay(battles) {
        let index = 0;
        function update(rootResolve) {
            if (index+1 >= battles.length) {
                return rootResolve();
            }

            const prevBattle = battles[index];
            const currentBattle = battles[index + 1];
    
            currentBattle.CurrentSelfLeadPokemons.forEach((currentPokemon, i) => {
                const prevPokemon = currentBattle.CurrentSelfLeadPokemons[i];
                if (currentPokemon.Name === "") {
                    PLAYER_LEAD_POKE_NAME_GENDER_LEVEL_SPANS[i].innerText = "";
                    PLAYER_LEAD_HP_SPANS[i].innerText = ""
                    PLAYER_LEAD_POKEMON_IMGS[i].src = getPokemonImgPath("空白");
                } else {
                    PLAYER_LEAD_POKE_NAME_GENDER_LEVEL_SPANS[i].innerHTML = getPokeNameGenderLevelText(
                        currentPokemon.Name,
                        currentPokemon.Gender,
                        currentPokemon.Level,
                    );
                    PLAYER_LEAD_HP_SPANS[i].innerText = getHPText(prevPokemon.Stat.MaxHP, prevPokemon.Stat.CurrentHP);
                    PLAYER_LEAD_POKEMON_IMGS[i].src = getPokemonImgPath(currentPokemon.Name);
                };
            });

            currentBattle.CurrentOpponentLeadPokemons.forEach((currentPokemon, i) => {
                const prevPokemon = currentBattle.CurrentOpponentLeadPokemons[i];
                if (currentPokemon.Name === "") {
                    AI_LEAD_POKE_NAME_GENDER_LEVEL_SPANS[i].innerText = "";
                    AI_LEAD_HP_SPANS[i].innerText = ""
                    AI_LEAD_POKEMON_IMGS[i].src = getPokemonImgPath("空白");
                } else {
                    AI_LEAD_POKE_NAME_GENDER_LEVEL_SPANS[i].innerHTML = getPokeNameGenderLevelText(
                        currentPokemon.Name,
                        currentPokemon.Gender,
                        currentPokemon.Level,
                    );
                    AI_LEAD_HP_SPANS[i].innerText = getHPText(prevPokemon.Stat.MaxHP, prevPokemon.Stat.CurrentHP);
                    AI_LEAD_POKEMON_IMGS[i].src = getPokemonImgPath(currentPokemon.Name);
                };
            });

            function innerTextAnimation(ele, texts, interval) {
                const steps = texts.length;
                return new Promise((resolve) => {
                    let i = 0;
                    function animate() {
                        if (i < steps) {
                            ele.innerText = texts[i];
                            i++;
                            setTimeout(animate, interval);
                        } else {
                            resolve();
                        }
                    }
                    animate();
                });
            };
    
            let isCurrentHPAnimation = false;
            function currentHPAnimation(currentPokemons, prevPokemons, eles) {
                return currentPokemons.map((currentPokemon, i) => {
                    // ポケモンを引っ込めた時(交代時)の、現在のHPの変化は無視する。
                    if (
                        currentPokemon.Name == "" &&
                        currentPokemon.Stat.MaxHP == 0 &&
                        currentPokemon.Stat.CurrentHP == 0
                    ) {
                        return Promise.resolve();
                    };
    
                    const prevPokemon = prevPokemons[i];
                    // ポケモンを繰り出した時(交代時)の、現在のHPの変化は無視する。
                    // 一つ前の状態がポケモンを引っ込めた状態であれば、現在はポケモンを繰り出す状態と判断出来る。
                    if (
                        prevPokemon.Name == "" &&
                        prevPokemon.Stat.MaxHP == 0 &&
                        prevPokemon.Stat.CurrentHP == 0
                    ) {
                        return Promise.resolve();
                    };
    
                    const prevCurrentHP = prevPokemon.Stat.CurrentHP;
                    if (currentPokemon.Stat.CurrentHP !== prevCurrentHP) {
                        if (currentPokemon.Stat.MaxHP !== prevPokemon.Stat.MaxHP) {
                            alert(
                                "現在のHPが変化している所で、最大HPも変化しているバグが発生している。"
                            );
                            return Promise.resolve();
                        };
                        isCurrentHPAnimation = true;
    
                        const diff = currentPokemon.Stat.CurrentHP - prevCurrentHP;
                        const step = Math.abs(diff);
                        const texts = [];
                        for (let j = 0; j <= step; j++) {
                            const currentHP =
                                prevCurrentHP + Math.sign(diff) * j;
                            const text = getHPText(
                                currentPokemon.Stat.MaxHP,
                                currentHP
                            );
                            texts.push(text);
                        };
                        return innerTextAnimation(eles[i], texts, 50);
                    };
                    return Promise.resolve();
                });
            };

            const playerCurrentHPAnimation = currentHPAnimation(
                currentBattle.CurrentSelfLeadPokemons,
                prevBattle.CurrentSelfLeadPokemons,
                PLAYER_LEAD_HP_SPANS,
            );
    
            const aiCurrentHPAnimation = currentHPAnimation(
                currentBattle.CurrentOpponentLeadPokemons,
                prevBattle.CurrentOpponentLeadPokemons,
                AI_LEAD_HP_SPANS,
            );
        
            if (isCurrentHPAnimation) {
                const ps = playerCurrentHPAnimation.concat(aiCurrentHPAnimation);
                Promise.all(ps).then(() => {
                    index++;
                    update(rootResolve);
                });
                return;
            };
    
            if (currentBattle.HostViewMessage !== prevBattle.HostViewMessage) {
                let texts = [];
                let msg = "";
                for (const m of currentBattle.HostViewMessage) {
                    msg += m;
                    texts.push(msg);
                }
                const promise = innerTextAnimation(BATTLE_MESSAGE, texts, 30);
                promise.then(() => {
                    index++;
                    update(rootResolve);
                });
                return;
            }
    
            setTimeout(() => {
                index++;
                update(rootResolve);
            }, 100);
        }
    
        return new Promise((resolve) => {
            update(resolve);
        });
    };

    function getCommandQuestionText()  {
        const p = globalCurrentBattle.CurrentSelfLeadPokemons[currentSrcIndex];
        return p.Name + " は どうする？";
    }

    async function push(playerAction, aiAction) {
        const url = new URL(BATTLE_COMMAND_SERVER_URL);
        url.searchParams.append("player_action", encodeURIComponent(JSON.stringify(playerAction)));
        url.searchParams.append("ai_action", encodeURIComponent(JSON.stringify(aiAction)));
        url.searchParams.append("command_type", encodeURIComponent("push"));
    
        const response = await fetch(url.toString());
        const json = await response.json();
        const battles = JSON.parse(JSON.stringify(json));

        if (!battles.every(battle => battle.CurrentSelfIsHost)) {
            alert("bippaのserver.goから送信されるbattleは全て、battle.CurrentSelfIsHost === true でなければならない。");
            return Promise.resolve();
        };
        return updateDisplay(battles, 0);
    };

    async function getSeparateLegalActions() {
        const url = new URL(BATTLE_QUERY_SERVER_URL);
        url.searchParams.append("query_type", "separate_legal_actions");
        const response = await fetch(url.toString());
        const json = await response.json();
        return JSON.parse(JSON.stringify(json));
    };

    const COMMAND_BUTTONS = document.getElementsByClassName("command");
    const FIGHT = "たたかう";
    const POKEMON_MENU = "ポケモン";
    const SURRENDER = "にげる";

    Array.from(COMMAND_BUTTONS).forEach(button => {
        button.addEventListener("click", () => {
            switch (button.textContent) {
                case FIGHT:
                    const actionsArrayPromise = getSeparateLegalActions();
                    /*
                        0番目のインデックスにはプレイヤーの合法アクション。
                        1番目のインデックスにはAIの合法アクションが格納されているので、actionsArray[0]とする。
                    */
                    actionsArrayPromise.then((actionsArray) => {
                        const moveNames = globalCurrentBattle.CurrentSelfLeadPokemons[currentSrcIndex].MoveNames;
                        const actionMoveNames = actionsToCurrentSrcMoveNames(actionsArray[0]);
                        const moveset = globalCurrentBattle.CurrentSelfLeadPokemons[currentSrcIndex].Moveset;
                        moveNames.forEach((moveName, i) => {
                            const has = moveset.hasOwnProperty(moveName);
                            function getInnerHTML() {
                                if (has) {
                                    const powerPoint = moveset[moveName];
                                    return moveName + "<br>" + "(" + powerPoint.Current + " / " + powerPoint.Max +")";
                                };
                                return "";
                            };

                            if (moveName === "") {
                                COMMAND_BUTTONS[i].style.visibility = "hidden";
                                COMMAND_BUTTONS[i].innerHTML = getInnerHTML();
                                return;
                            } else if (!actionMoveNames.includes(moveName)) {
                                COMMAND_BUTTONS[i].style.visibility = "visible";
                                COMMAND_BUTTONS[i].style.disabled = true;
                                COMMAND_BUTTONS[i].innerHTML = getInnerHTML();
                                return;
                            };

                            COMMAND_BUTTONS[i].style.visibility = "visible";
                            COMMAND_BUTTONS[i].style.disabled = false;
                            COMMAND_BUTTONS[i].innerHTML = getInnerHTML();
                        });
                    });
                    break;
                case POKEMON_MENU:
                    break;
                case SURRENDER:
                    break;
                default:
                    const allMoveNames = Object.keys(MOVEDEX);
                    const isMoveAction = allMoveNames.some(moveName => {
                        return button.textContent.includes(moveName);
                    });

                    if (isMoveAction) {
                        if (currentSrcIndex == 0 && IS_SINGLE_BATTLE) {
                            console.log("push");
                            return;
                        };

                        if (currentSrcIndex == 0 && IS_DOUBLE_BATTLE) {
                            initCommandButtons();
                            currentSrcIndex++;
                            BATTLE_MESSAGE.innerText = getCommandQuestionText();
                            return;
                        };

                        if (currentSrcIndex == 1 && IS_DOUBLE_BATTLE) {
                            console.log("push");
                            return;
                        }
                    };
                    break;
              };
        });
    });

    function initCommandButtons() {
        COMMAND_BUTTONS[0].textContent = FIGHT;
        COMMAND_BUTTONS[1].textContent = POKEMON_MENU;
        COMMAND_BUTTONS[2].textContent = SURRENDER;
        Array.from(COMMAND_BUTTONS).slice(0, 3).forEach(button => {
            button.style.visibility = "visible";
        });
    };

    function actionsToCurrentSrcMoveNames(actions) {
        const moveNames = actions.map(action => {
            const soloAction = action[currentSrcIndex];
            return soloAction.MoveName;    
        }).filter(moveName => {
            return moveName !== "";
        });
        return [...new Set(moveNames)];
    }

    const action = [
        [
            {
                MoveName:"だいばくはつ",
                SrcIndex:0,
                Speed:999,
            },

            {
                MoveName:"",
                SrcIndex:1,
                TargetIndex:0,
                Speed:100,
            },
        ],
        
        [
            {
                MoveName:"たきのぼり",
                SrcIndex:0,
                Speed:100,
            },
            {
                MoveName:"ほのおのパンチ",
                SrcIndex:1,
                Speed:1,
            },
        ],
    ];

    const initBattles = JSON.parse(sessionStorage.getItem("initBattles"));
    globalCurrentBattle = initBattles[initBattles.length-1];
    const IS_SINGLE_BATTLE = globalCurrentBattle.CurrentSelfLeadPokemons.length == 1;
    const IS_DOUBLE_BATTLE = !IS_SINGLE_BATTLE;

    const p = updateDisplay(initBattles, 0);
    p.then(() => {
        BATTLE_MESSAGE.innerText = getCommandQuestionText();
        initCommandButtons();
    })
});