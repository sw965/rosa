let currentSrc = 0;

const MOVE_BUTTON_IDS = [
    "move1-button",
    "move2-button",
    "move3-button",
    "move4-button",
];

const PLAYER_LEAD_POKEMON_IMG_IDS = [
    "player-lead-pokemon0-img",
    "player-lead-pokemon1-img"
];

const AI_LEAD_POKEMON_IMG_IDS = [
    "ai-lead-pokemon0-img",
    "ai-lead-pokemon1-img"
];

document.addEventListener("DOMContentLoaded", () => {
    const url = new URL(BATTLE_COMMAND_SERVER_URL);
    const playerAction = [
        {
            MoveName:"たきのぼり",
            SrcIndex:0,
            TargetIndex:0,
            Speed:100
        },
        {
            MoveName:"ほのおのパンチ",
            SrcIndex:1,
            TargetIndex:0,
            Speed:0
        },
    ];

    const aiAction = [
        {
            MoveName:"たきのぼり",
            SrcIndex:0,
            TargetIndex:0,
            Speed:100
        },
        {
            MoveName:"ほのおのパンチ",
            SrcIndex:1,
            TargetIndex:0,
            Speed:0
        },
    ];

    url.searchParams.append("player_action", encodeURIComponent(JSON.stringify(playerAction)));
    url.searchParams.append("ai_action", encodeURIComponent(JSON.stringify(aiAction)));
    url.searchParams.append("command_type", encodeURIComponent("push"));

    fetch(url.toString())
        .then(response => {
            return response.json();
        })
        .then(json => {
            const battles = JSON.parse(JSON.stringify(json));
            let lastBattle = battles[0];
            const leadLength = lastBattle.CurrentSelfLeadPokemons.length;
            const benchLength = lastBattle.CurrentSelfBenchPokemons.length;
            console.log("2leng", leadLength, benchLength);

            if (lastBattle.CurrentOpponentLeadPokemons.length !== leadLength) {
                alert("プレイヤーの先頭のポケモンの数と、AIの先頭のポケモンの数が異なります。");
                return;
            };

            if (lastBattle.CurrentOpponentBenchPokemons.length !== benchLength) {
                alert("プレイヤーの控えのポケモンの数と、AIの控えのポケモンの数が異なります。");
                return;
            };

            for (const battle of battles.slice(1)) {
                if (battle.CurrentSelfLeadPokemons.length !== leadLength) {
                    alert("プレイヤーの先頭のポケモンの数が、試合中に変化しています。");
                    return;
                };

                if (battle.CurrentSelfBenchPokemons.length !== benchLength) {
                    alert("プレイヤーの控えのポケモンの数が、試合中に変化しています。");
                    return;
                };

                if (battle.CurrentOpponentLeadPokemons.length !== leadLength) {
                    console.log(battle.CurrentOpponentLeadPokemons);
                    alert("AIの先頭のポケモンの数が、試合中に変化しています。");
                    return;
                };

                if (battle.CurrentOpponentBenchPokemons.length !== benchLength) {
                    console.log(battle.CurrentOpponentBenchPokemons);
                    alert("AIの控えのポケモンの数が、試合中に変化しています。");
                    return;
                };

                const diff = {
                    currentSelf:{
                        pokeNames:new Array(leadLength).fill(false),
                        genders:new Array(leadLength).fill(false),
                        levels:new Array(leadLength).fill(false),
                        maxHPs:new Array(leadLength).fill(false),
                        currentHPs:new Array(leadLength).fill(false),
                    },

                    currentOpponent:{
                        pokeNames:new Array(leadLength).fill(false),
                        genders:new Array(leadLength).fill(false),
                        levels:new Array(leadLength).fill(false),
                        maxHPs:new Array(leadLength).fill(false),
                        currentHPs:new Array(leadLength).fill(false),
                    },

                    hostViewMessage:false,
                };

                battle.CurrentSelfLeadPokemons.map((pokemon, i) => {
                    const lastPokemon = lastBattle.CurrentSelfLeadPokemons[i];
                    if (pokemon.Name !== lastPokemon.Name) {
                        console.log("self:", pokemon.Name);
                    };

                    if (pokemon.Level !== lastPokemon.Level) {
                        console.log("self:", pokemon.Level);
                    };

                    if (pokemon.Gender !== lastPokemon.Gender) {
                        console.log("self:", pokemon.Gender);
                    };
                });
            };
        })
        .catch(err => {
            console.log("エラー");
            console.error(err);
        });
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