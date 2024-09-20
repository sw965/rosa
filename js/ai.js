let currentSrc = 0;

const MOVE_BUTTON_IDS = [
    "move1-button",
    "move2-button",
    "move3-button",
    "move4-button",
];

document.addEventListener("DOMContentLoaded", () => {
    function getPokeNameGenderLevelText(pokeName, gender, level) {
        return pokeName + " " + gender + " " + "Lv." + level;
    }

    function getHPText(max, current) {
        return max + " / " + current;
    }

    const BATTLE_MESSAGE = document.getElementById("battle-msg");
    const PLAYER_LEAD_POKE_NAME_GENDER_LEVEL_SPANS = document.getElementsByClassName("player-lead-poke-name-gender-level");
    const PLAYER_LEAD_HP_SPANS = document.getElementsByClassName("player-lead-hp");
    const PLAYER_LEAD_POKEMON_IMGS = document.getElementsByClassName("player-lead-pokemon-img");
    const AI_LEAD_POKE_NAME_GENDER_LEVEL_SPANS = document.getElementsByClassName("ai-lead-poke-name-gender-level");
    const AI_LEAD_HP_SPANS = document.getElementsByClassName("ai-lead-hp");
    const AI_LEAD_POKEMON_IMGS = document.getElementsByClassName("ai-lead-pokemon-img");

    function push(playerAction, aiAction) {
        const url = new URL(BATTLE_COMMAND_SERVER_URL);
        url.searchParams.append("player_action", encodeURIComponent(JSON.stringify(playerAction)));
        url.searchParams.append("ai_action", encodeURIComponent(JSON.stringify(aiAction)));
        url.searchParams.append("command_type", encodeURIComponent("push"));
    
        fetch(url.toString())
            .then(response => {
                return response.json();
            })
            .then(responseJson => {
                const battles = JSON.parse(JSON.stringify(responseJson));
                if (!battles.every(battle => battle.CurrentSelfIsHost)) {
                    alert("bippaのserver.goから送信されるbattleは全て、battle.CurrentSelfIsHost === true でなければならない。");
                    return;
                };
        
                let prevBattle = battles[0];
                const leadLength = prevBattle.CurrentSelfLeadPokemons.length;
                const benchLength = prevBattle.CurrentSelfBenchPokemons.length;
        
                if (prevBattle.CurrentOpponentLeadPokemons.length !== leadLength) {
                    alert("プレイヤーの先頭のポケモンの数と、AIの先頭のポケモンの数が異なります。");
                    return;
                };
        
                if (prevBattle.CurrentOpponentBenchPokemons.length !== benchLength) {
                    alert("プレイヤーの控えのポケモンの数と、AIの控えのポケモンの数が異なります。");
                    return;
                };
        
                let index = 1;
                function updateUI() {
                    if (index >= battles.length) {
                        return;
                    }
    
                    const currentBattle = battles[index];
                    currentBattle.CurrentSelfLeadPokemons.forEach((pokemon, i) => {
                        if (pokemon.Name === "") {
                            PLAYER_LEAD_POKE_NAME_GENDER_LEVEL_SPANS[i].innerHTML = "";
                            PLAYER_LEAD_POKEMON_IMGS[i].src = getPokemonImgPath("空白");
                        } else {
                            PLAYER_LEAD_POKE_NAME_GENDER_LEVEL_SPANS[i].innerHTML = getPokeNameGenderLevelText(pokemon.Name, pokemon.Gender, pokemon.Level);
                            PLAYER_LEAD_POKEMON_IMGS[i].src = getPokemonImgPath(pokemon.Name);
                        }
                    });
                    
                    currentBattle.CurrentOpponentLeadPokemons.forEach((pokemon, i) => {
                        if (pokemon.Name === "") {
                            AI_LEAD_POKE_NAME_GENDER_LEVEL_SPANS[i].innerHTML = "";
                            AI_LEAD_POKEMON_IMGS[i].src = getPokemonImgPath("空白");
                        } else {
                            AI_LEAD_POKE_NAME_GENDER_LEVEL_SPANS[i].innerHTML = getPokeNameGenderLevelText(pokemon.Name, pokemon.Gender, pokemon.Level);
                            AI_LEAD_POKEMON_IMGS[i].src = getPokemonImgPath(pokemon.Name);
                        }           
                    });
    
                    function next() {
                        index += 1;
                        prevBattle = currentBattle;
                    };
    
                    let isCurrentHPAnimation = false;
    
                    function innerTextAnimation(ele, texts, interval) {
                        const steps = texts.length;
                        return new Promise(resolve => {
                            let i = 0;
                            function update() {
                                if (i < steps) {
                                    ele.innerText = texts[i];
                                    i++;
                                    setTimeout(update, interval);
                                } else {
                                    resolve();
                                }
                            };
                            update();
                        });
                    };
    
                    function currentHPAnimation(currentPokemons, prevPokemons, eles) {
                        return currentPokemons.map((currentPokemon, i) => {
                            //ポケモンを引っ込めた時(交代時)の、現在のHPの変化は無視する。
                            if (currentPokemon.Name == "" && currentPokemon.Stat.MaxHP == 0 && currentPokemon.Stat.CurrentHP == 0) {
                                return Promise.resolve();
                            };

                            const prevPokemon = prevPokemons[i];
                            //ポケモンを繰り出した時(交代時)の、現在のHPの変化は無視する。
                            //一つ前の状態がポケモンを引っ込めた状態であれば、現在はポケモンを繰り出す状態と判断出来る。
                            if (prevPokemon.Name == "" && prevPokemon.Stat.MaxHP == 0 && prevPokemon.Stat.CurrentHP == 0) {
                                return Promise.resolve();
                            };

                            const prevCurrentHP = prevPokemon.Stat.CurrentHP;
                            if (currentPokemon.Stat.CurrentHP !== prevCurrentHP) {
                                if (currentPokemon.Stat.MaxHP !== prevPokemon.Stat.MaxHP) {
                                    alert("現在のHPが変化している所で、最大HPも変化しているバグが発生している。");
                                    return Promise.resolve();
                                }
                                isCurrentHPAnimation = true;
                        
                                const diff = currentPokemon.Stat.CurrentHP - prevCurrentHP;
                                const step = Math.abs(diff);
                                const texts = [];
                                for (let j = 0; j <= step; j++) {
                                    const currentHP = prevCurrentHP + Math.sign(diff) * j;
                                    const text = getHPText(currentPokemon.Stat.MaxHP, currentHP);
                                    texts.push(text);
                                }
                                return innerTextAnimation(eles[i], texts, 100);
                            }
                            return Promise.resolve();
                        });
                    };
    
                    const playerCurrentHPAnimation = currentHPAnimation(currentBattle.CurrentSelfLeadPokemons, prevBattle.CurrentSelfLeadPokemons, PLAYER_LEAD_HP_SPANS);
                    const aiCurrentHPAnimation = currentHPAnimation(currentBattle.CurrentOpponentLeadPokemons, prevBattle.CurrentOpponentLeadPokemons, AI_LEAD_HP_SPANS);
    
                    if (isCurrentHPAnimation) {
                        const ps = playerCurrentHPAnimation.concat(aiCurrentHPAnimation)
                        Promise.all(ps).then(() => {
                            next();
                            updateUI();
                        });
                        return;
                    };
        
                    if (currentBattle.HostViewMessage !== prevBattle.HostViewMessage) {
                        let texts = [];
                        let msg = "";
                        for (const m of currentBattle.HostViewMessage) {
                            msg += m;
                            texts.push(msg);
                        };      
                        const promise = innerTextAnimation(BATTLE_MESSAGE, texts, 100);
                        promise.then(() => {
                            next();
                            updateUI();
                        })
                        return
                    };
                    next();
                    setTimeout(updateUI(), 1000);
                }
                updateUI();
            });
    };

    const action = [
        [
            {
                MoveName:"たきのぼり",
                SrcIndex:0,
                Speed:100,
            },
            {
                MoveName:"",
                SrcIndex:1,
                BenchIndex:0,
                Speed:1,
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
    push(action[0], action[1]);
});

// document.addEventListener("DOMContentLoaded", () => {
//     const MOVE_BUTTONS = MOVE_BUTTON_IDS.map(id => {
//         return document.getElementById(id);
//     });

//     const PLAYER_LEAD_POKEMON_IMGS = PLAYER_LEAD_POKEMON_IMG_IDS.map(id => {
//         return document.getElementById(id);
//     });

//     const AI_LEAD_POKEMON_IMGS = AI_LEAD_POKEMON_IMG_IDS.map(id => {
//         return document.getElementById(id);
//     });

//     const url = new URL(BATTLE_QUERY_SERVER_URL);
//     url.searchParams.append("request_type", encodeURIComponent("battle"));
//     var battle;
//     fetch(url.toString())
//         .then(response => {
//             return response.json();
//         })
//         .then(json => {
//             battle = JSON.parse(JSON.stringify(json));
//             console.log(JSON.stringify(battle.CurrentSelfLeadPokemons));
//             console.log(battle.CurrentSelfLeadPokemons[0].Name);

//             const playerPokemonImg = document.getElementById("player-lead-pokemon0-img");
//             const aiPokemonImg = document.getElementById("ai-lead-pokemon0-img");
//             playerPokemonImg.src = getPokemonImgPath(battle.CurrentSelfLeadPokemons[0].Name);
//             aiPokemonImg.src = getPokemonImgPath(battle.CurrentOpponentLeadPokemons[0].Name);

//             const url = new URL(BATTLE_QUERY_SERVER_URL);
//             url.searchParams.append("request_type", encodeURIComponent("legal_separate_actions"));
//             fetch(url.toString())
//                 .then(response => {
//                     return response.json();
//                 })
//                 .then(json => {
//                     const playerLegalActions = JSON.parse(JSON.stringify(json))[0];
//                     console.log(JSON.stringify(playerLegalActions));
//                     const playerLegalMoveActions = playerLegalActions.filter(action => {
//                         return action[0].MoveName !== ""
//                     });
//                     const playerLegalActionMoveNames = [];
//                     playerLegalMoveActions.forEach(action => {
//                         if (!playerLegalActionMoveNames.includes(action[0].MoveName)) {
//                             playerLegalActionMoveNames.push(action[0].MoveName);
//                         }
//                     });

//                     battle.CurrentSelfLeadPokemons[0].MoveNames.map((moveName, i) => {
//                         if (moveName === "") {
//                             return
//                         }
//                         const pp = battle.CurrentSelfLeadPokemons[0].Moveset[moveName];
//                         MOVE_BUTTONS[i].innerText = moveName + "(" + pp.Current + ")" + "(" + pp.Max + ")";

//                         if (playerLegalActionMoveNames.includes(moveName)) {
//                             MOVE_BUTTONS[i].disabled = false;
//                         } else {
//                             MOVE_BUTTONS[i].disabled = true;
//                         }
//                     })
//                 }) 
//     })
// });