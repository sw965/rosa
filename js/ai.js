document.addEventListener("DOMContentLoaded", () => {
    const IS_SINGLE_BATTLE = JSON.parse(JSON.stringify(sessionStorage.getItem("battle_type"))) === SINGLE_BATTLE;

    const PLAYER_LEAD_NAME_GENDER_LEVEL_ELEMENTS = document.getElementsByClassName("player-lead-name-gender-level");
    const AI_LEAD_NAME_GENDER_LEVEL_ELEMENTS = document.getElementsByClassName("ai-lead-name-gender-level");

    function getNameGenderLevelText(pokeName, gender, level) {
        return pokeName + " " + gender + " " + "Lv." + level;
    };

    const PLAYER_LEAD_HP_ELEMENTS = document.getElementsByClassName("player-lead-hp");
    const AI_LEAD_HP_ELEMENTS = document.getElementsByClassName("ai-lead-hp");

    function getHPText(max, current) {
        return current + " / " + max;
    };

    const PLAYER_LEAD_IMGS = document.getElementsByClassName("player-lead-img");
    const AI_LEAD_IMGS = document.getElementsByClassName("ai-lead-img");
    const BATTLE_MSG_ELEMENT = document.getElementById("battle-msg");

    function getTargetPokemonQuestionText(moveName) {
        return moveName + "を どのポケモンに？"
    }
    
    function animateDisplay(battles) {
        let index = 0;
        function run(rootResolve) {
            if (index+1 >= battles.length) {
                return rootResolve();
            }

            const currentBattle = battles[index];
            const nextBattle = battles[index + 1];

            function updateLeadPokemon(nextLeadPokemons, currentLeadPokemons, nameGenderLevelElements, hpElements, imgs) {
                nextLeadPokemons.forEach((nextPokemon, i) => {
                    if (nextPokemon.Name === "") {
                        nameGenderLevelElements[i].innerText = "";
                        hpElements[i].innerText = ""
                        imgs[i].src = getPokemonImgPath("空白");
                    } else {
                        nameGenderLevelElements[i].innerText = getNameGenderLevelText(nextPokemon.Name, nextPokemon.Gender, nextPokemon.Level);
                        const currentPokemon = currentLeadPokemons[i];
                        if (nextPokemon.Stat.MaxHP !== 0 && currentPokemon.Stat.MaxHP === 0) {
                            hpElements[i].innerText = getHPText(nextPokemon.Stat.MaxHP, nextPokemon.Stat.CurrentHP);
                        };
                        imgs[i].src = getPokemonImgPath(nextPokemon.Name);
                    };
                });
            };

            updateLeadPokemon(
                nextBattle.CurrentSelfLeadPokemons, currentBattle.CurrentSelfLeadPokemons,
                PLAYER_LEAD_NAME_GENDER_LEVEL_ELEMENTS, PLAYER_LEAD_HP_ELEMENTS, PLAYER_LEAD_IMGS,
            );

            updateLeadPokemon(
                nextBattle.CurrentOpponentLeadPokemons, currentBattle.CurrentOpponentLeadPokemons,
                AI_LEAD_NAME_GENDER_LEVEL_ELEMENTS, AI_LEAD_HP_ELEMENTS, AI_LEAD_IMGS,
            );

            function animateInnerText(element, texts, interval) {
                const step = texts.length;
                return new Promise((resolve) => {
                    let i = 0;
                    function animate() {
                        if (i < step) {
                            element.innerText = texts[i];
                            i++;
                            setTimeout(animate, interval);
                        } else {
                            resolve();
                        }
                    }
                    animate();
                });
            };
    
            let isAnimatingCurrentHP = false;
            function animateCurrentHP(nextPokemons, currentPokemons, elements) {
                return nextPokemons.map((nextPokemon, i) => {
                    // ポケモンを引っ込めた時(交代時)の、現在のHPの変化は無視する。
                    if (
                        nextPokemon.Name == "" &&
                        nextPokemon.Stat.MaxHP == 0 &&
                        nextPokemon.Stat.CurrentHP == 0
                    ) {
                        return Promise.resolve();
                    };
    
                    const currentPokemon = currentPokemons[i];
                    // ポケモンを繰り出した時(交代時)の、現在のHPの変化は無視する。
                    // 一つ前の状態がポケモンを引っ込めた状態であれば、現在はポケモンを繰り出す状態と判断出来る。
                    if (
                        currentPokemon.Name == "" &&
                        currentPokemon.Stat.MaxHP == 0 &&
                        currentPokemon.Stat.CurrentHP == 0
                    ) {
                        return Promise.resolve();
                    };
    
                    const currentCurrentHP = currentPokemon.Stat.CurrentHP;
                    if (nextPokemon.Stat.CurrentHP !== currentCurrentHP) {
                        if (nextPokemon.Stat.MaxHP !== currentPokemon.Stat.MaxHP) {
                            alert(
                                "現在のHPが変化している所で、最大HPも変化しているバグが発生している。"
                            );
                            return Promise.resolve();
                        };

                        isAnimatingCurrentHP = true;
                        const diff = nextPokemon.Stat.CurrentHP - currentCurrentHP;
                        const step = Math.abs(diff);
                        const texts = [];
                        for (let j = 0; j <= step; j++) {
                            const currentHP = currentCurrentHP + Math.sign(diff) * j;
                            const text = getHPText(nextPokemon.Stat.MaxHP, currentHP);
                            texts.push(text);
                        };
                        return animateInnerText(elements[i], texts, 50);
                    };
                    return Promise.resolve();
                });
            };

            const playerCurrentHPAnimators = animateCurrentHP(
                nextBattle.CurrentSelfLeadPokemons,
                currentBattle.CurrentSelfLeadPokemons,
                PLAYER_LEAD_HP_ELEMENTS,
            );
    
            const aiCurrentHPAnimators = animateCurrentHP(
                nextBattle.CurrentOpponentLeadPokemons,
                currentBattle.CurrentOpponentLeadPokemons,
                AI_LEAD_HP_ELEMENTS,
            );

            if (isAnimatingCurrentHP) {
                const currentHPAnimators = playerCurrentHPAnimators.concat(aiCurrentHPAnimators);
                Promise.all(currentHPAnimators).then(() => {
                    index++;
                    run(rootResolve);
                });
                return;
            };
    
            if (nextBattle.HostViewMessage !== currentBattle.HostViewMessage) {
                let texts = [];
                let msg = "";
                for (const char of nextBattle.HostViewMessage) {
                    msg += char;
                    texts.push(msg);
                };

                const animator = animateInnerText(BATTLE_MSG_ELEMENT, texts, 30);
                animator.then(() => {
                    index++;
                    run(rootResolve);
                });
                return;
            }
    
            setTimeout(() => {
                index++;
                run(rootResolve);
            }, 100);
        }
    
        return new Promise((resolve) => {
            run(resolve);
        });
    };

    const DYNAMIC_COMMAND_BUTTONS = document.getElementsByClassName("dynamic-command");
    DYNAMIC_COMMAND_BUTTONS[0].dataset.targetIndex = 0;
    DYNAMIC_COMMAND_BUTTONS[0].dataset.isSelfLeadTarget = true;

    DYNAMIC_COMMAND_BUTTONS[1].dataset.targetIndex = 0;
    DYNAMIC_COMMAND_BUTTONS[1].dataset.isSelfLeadTarget = false;

    DYNAMIC_COMMAND_BUTTONS[2].dataset.targetIndex = 1;
    DYNAMIC_COMMAND_BUTTONS[2].dataset.isSelfLeadTarget = true;

    DYNAMIC_COMMAND_BUTTONS[3].dataset.targetIndex = 1;
    DYNAMIC_COMMAND_BUTTONS[3].dataset.isSelfLeadTarget = false;

    const FIGHT_TEXT = "たたかう";
    const POKEMON_MENU_TEXT = "ポケモン";
    const SURRENDER_TEXT = "にげる";

    class CommandMenuState {
        constructor(message) {
            this.message = message;
            this.dynamicCommandButtons = [];
        };

        pushDynamicCommandButton(text, visibility, disabled) {
            this.dynamicCommandButtons.push({text:text, visibility:visibility, disabled:disabled});
        };

        updateDisplay() {
            BATTLE_MSG_ELEMENT.innerText = this.message;
            this.dynamicCommandButtons.forEach((buttonState, i) => {
                DYNAMIC_COMMAND_BUTTONS[i].innerHTML = buttonState.text;
                DYNAMIC_COMMAND_BUTTONS[i].style.visibility = buttonState.visibility;
                DYNAMIC_COMMAND_BUTTONS[i].disabled = buttonState.disable;
            });
        };
    };

    function newRootCommandMenuState() {
        const pokeName = BATTLE.CurrentSelfLeadPokemons[currentSrcIndex].Name;
        const state = new CommandMenuState(pokeName + "は どうする？");
        [FIGHT_TEXT, POKEMON_MENU_TEXT, SURRENDER_TEXT].map(text => {
            state.pushDynamicCommandButton(text, "visible", false);
        });
        state.pushDynamicCommandButton("", "hidden", true);
        return state;
    };

    function newEmptyCommandMenuState() {
        const state = new CommandMenuState("");
        for (let i=0; i < DYNAMIC_COMMAND_BUTTONS.length; i++) {
            state.pushDynamicCommandButton("", "hidden", true);
        };
        return state;
    }

    let COMMAND_MENU_STATES= [];

    Array.from(DYNAMIC_COMMAND_BUTTONS).forEach(dynamicCommandButton => {
        function fightEvent() {
            const nonUniqueActionMoveNames = PLAYER_LEGAL_ACTIONS.map(action => {
                const soloAction = action[currentSrcIndex];
                return soloAction.MoveName;
            }).filter(moveName => {
                return moveName !== "";
            });

            const uniqueActionMoveNames = [... new Set(nonUniqueActionMoveNames)];
            const pokemon = BATTLE.CurrentSelfLeadPokemons[currentSrcIndex];
            const state = new CommandMenuState(BATTLE_MSG_ELEMENT.innerHTML);
            pokemon.LearnedMoveNames.forEach((moveName, i) => { 
                if (moveName === "") {
                    state.pushDynamicCommandButton("", "hidden", false);
                } else {
                    const text = moveName + "<br>" +"(" + pokemon.Moveset[moveName].Current + " / " + pokemon.Moveset[moveName].Max + ")"
                    state.pushDynamicCommandButton(text, "visible", !uniqueActionMoveNames.includes(moveName));
                };
            });
            state.updateDisplay();
            COMMAND_MENU_STATES.push(state);
        };

        function moveEvent() {
            const moveName = event.target.innerHTML.split("<br>")[0];
            const has = MOVEDEX.hasOwnProperty(moveName);
            if (!has) {
                alert("バグが起きています。");
                return;
            };
            const moveData = MOVEDEX[moveName];

            if (moveData.Target === "通常" && !IS_SINGLE_BATTLE) {
                normalTargetMoveEvent(moveName);
            } else {
                newEmptyCommandMenuState().updateDisplay();
                getMCTSJointAction().then((jointAction) => {
                    return jointAction;
                }).then(jointAction => {
                    const aiAction = jointAction[1];
                    return push(playerAction, aiAction);
                });
            };

            //プレイヤーが選択した結果をグローバルで保持する。
            provisionalPlayerAction[currentSrcIndex].srcIndex = currentSrcIndex;
            provisionalPlayerAction[currentSrcIndex].moveName = moveName;
        };

        function normalTargetMoveEvent(moveName) {
            const nonUniqueSoloActionOptions = PLAYER_LEGAL_ACTIONS.map(action => {
                return action[currentSrcIndex];
            }).filter(soloAction => {
                return soloAction.MoveName === moveName;
            });

            const uniqueSoloActionOptions = [];
            nonUniqueSoloActionOptions.forEach(soloAction => {
                const str = JSON.stringify(soloAction);
                for (const existingSoloAction of uniqueSoloActionOptions) {
                    if (JSON.stringify(existingSoloAction) === str) {
                        return;
                    }
                };
                uniqueSoloActionOptions.push(soloAction);
            });

            const state = new CommandMenuState(moveName + "を どのポケモンに？");
            Array.from(DYNAMIC_COMMAND_BUTTONS).forEach(button => {
                for (soloAction of uniqueSoloActionOptions) {
                    const buttonTargetIndex = parseInt(button.dataset.targetIndex, 10);
                    const buttonIsSelfLeadTarget = JSON.parse(button.dataset.isSelfLeadTarget, 10);
                    if (soloAction.TargetIndex === buttonTargetIndex && soloAction.IsSelfLeadTarget === buttonIsSelfLeadTarget) {
                        let pokeName = null;
                        if (soloAction.IsSelfLeadTarget) {
                            pokeName = BATTLE.CurrentSelfLeadPokemons[soloAction.TargetIndex].Name;
                        } else {
                            pokeName = BATTLE.CurrentOpponentLeadPokemons[soloAction.TargetIndex].Name;
                        };
                        state.pushDynamicCommandButton(pokeName, "visible", false);
                        return;
                    };
                };
                //uniqueSoloActionOptions(ルール上可能な行動の候補)に含まれない場合は、ボタンを表示しない。
                state.pushDynamicCommandButton("", "hidden", true);
            });
            state.updateDisplay();
        };

        //この関数が呼び出される時は、ダブルバトルである事は確定している為、ダブルバトルである事を前提として考えてよい。
        function targetPokeNameEvent() {
            provisionalPlayerAction[currentSrcIndex].targetIndex = parseInt(dynamicCommandButton.dataset.targetIndex, 10);
            provisionalPlayerAction[currentSrcIndex].isSelfLeadTarget = JSON.parse(dynamicCommandButton.dataset.isSelfLeadTarget);
            if (currentSrcIndex === 0) {
                currentSrcIndex++;
                newRootCommandMenuState().updateDisplay();
                return;
            }

            const playerActions = PLAYER_LEGAL_ACTIONS.filter(action => {
                return action.every((soloAction, i) => {
                    const playerSoloAction = provisionalPlayerAction[i];                    
                    return playerSoloAction.moveName === soloAction.MoveName &&
                        playerSoloAction.srcIndex === soloAction.SrcIndex &&
                        playerSoloAction.targetIndex === soloAction.TargetIndex &&
                        playerSoloAction.isSelfLeadTarget === soloAction.IsSelfLeadTarget
                });
            });

            if (playerActions.length !== 1) {
                alert("これが表示されたらバグが発生しています。");
                return;
            }

            const playerAction = playerActions[0]

            getMCTSJointAction().then((jointAction) => {
                return jointAction;
            }).then(jointAction => {
                const aiAction = jointAction[1];
                return push(playerAction, aiAction);
            });
            newEmptyCommandMenuState().updateDisplay();
        };

        dynamicCommandButton.addEventListener("click", event => {
            const target = event.target;
            if (target.innerHTML === FIGHT_TEXT) {
                fightEvent();
                return;
            };

            if (target.innerHTML === POKEMON_MENU_TEXT) {
                window.open("pokemon-menu.html", "_blank", "width=800,height=600");
                return;
            };

            if (target.innerHTML === SURRENDER_TEXT) {
                return;
            };

            if (target.innerHTML.includes("<br>")) {
                moveEvent();
                return;
            };
            
            const isPokeName = POKEDEX.hasOwnProperty(target.innerHTML);
            if (isPokeName) {
                targetPokeNameEvent();
                return;
            };
        });
    });

    async function getCurrentBattle() {
        const url = new URL(BATTLE_QUERY_SERVER_URL);
        url.searchParams.append("query_type", "battle");
        const response = await fetch(url.toString());
        const json = await response.json();
        return JSON.parse(JSON.stringify(json));
    };

    async function getSeparateLegalActions() {
        const url = new URL(BATTLE_QUERY_SERVER_URL);
        url.searchParams.append("query_type", "separate_legal_actions");
        const response = await fetch(url.toString());
        const json = await response.json();
        return JSON.parse(JSON.stringify(json));
    };

    function definitivePlayerAction() {
        provisionalPlayerAction[0];
    };

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
        return animateDisplay(battles, 0);
    };

    async function getMCTSJointAction() {
        const url = new URL(BATTLE_MCTS_QUERY_SERVER_URL);
        url.searchParams.append("query_type", encodeURIComponent("joint_action"));
        url.searchParams.append("simulation_num", encodeURIComponent("128"));
        const response = await fetch(url.toString());
        const json = await response.json();
        return JSON.parse(JSON.stringify(json));
    };

    let currentSrcIndex = 0;
    let SEPARATE_LEGAL_ACTIONS = null;
    let PLAYER_LEGAL_ACTIONS = null;

    getSeparateLegalActions().then(actionsArray => {
        SEPARATE_LEGAL_ACTIONS = actionsArray;
        PLAYER_LEGAL_ACTIONS = SEPARATE_LEGAL_ACTIONS[0];
    });

    let provisionalPlayerAction = null;
    let BATTLE = null;

    getCurrentBattle().then(currentBattle => {
        BATTLE = currentBattle;
        if (IS_SINGLE_BATTLE) {
            provisionalPlayerAction = [{}];
        } else {
            provisionalPlayerAction = [{}, {}];
        };
    }).then(() => {
        const initBattles = JSON.parse(sessionStorage.getItem("init_battles"));
        return animateDisplay(initBattles, 0);
    }).then(() => {
        //君にはここの処理が反映されない理由を教えてほしい
        newRootCommandMenuState().updateDisplay();
    }).then(() => {
        sessionStorage.setItem("currentBattle", JSON.stringify(BATTLE));
    });
});