document.addEventListener("DOMContentLoaded", () => {
    const PLAYER_TEAM_ANCHORS = document.getElementsByClassName("player-pokemon-editor-link");
    const AI_TEAM_ANCHORS = document.getElementsByClassName("ai-pokemon-editor-link");
    const PLAYER_AND_AI_TEAM_ANCHORS = Array.from(PLAYER_TEAM_ANCHORS).concat(Array.from(AI_TEAM_ANCHORS));

    function updateImgs() {
        TeamSessionStorage.getPlayerAndAITeam().map((pokemon, i) => {
            const img = document.createElement("img");
            img.dataset.index = i;
            img.src = getPokemonImgPath(pokemon.name);
            const anchor = PLAYER_AND_AI_TEAM_ANCHORS[i];
            //aタグの中の中の全ての要素を消す。
            while (anchor.firstChild) {
                anchor.removeChild(anchor.firstChild);
            }
            //aタグの中に画像を追加。
            anchor.appendChild(img);
        });
    };

    function updateHrefs() {
        TeamSessionStorage.getPlayerAndAITeam().map((pokemon, i) => {
            const anchor = PLAYER_AND_AI_TEAM_ANCHORS[i]; 
            const url = new URL(anchor);
            url.searchParams.set("poke_name", pokemon.name);
            anchor.href = url.toString();
        });
    };

    const START_BATTLE_BUTTON = document.getElementById("start-battle");

    initTeamSessionStorageSetter
        .then(() => {
            updateHrefs();
            updateImgs();

            START_BATTLE_BUTTON.addEventListener("click", () => {
                const playerTeam = TeamSessionStorage.getPlayerTeam();
                const aiTeam = TeamSessionStorage.getAITeam();
                const battleTypeRadio = document.querySelector('input[name="battle-type"]:checked');

                let battleNum = 0;
                if (battleTypeRadio.value === SINGLE_BATTLE) {
                    battleNum = 1;
                } else if (battleTypeRadio.value === DOUBLE_BATTLE) {
                    battleNum = 2;
                };

                if (battleNum === 0) {
                    alert("バトルの種類(シングルもしくはダブル)が指定されていない");
                };

                const playerLeadPokemons = playerTeam.slice(0, battleNum);
                const playerBenchPokemons = playerTeam.slice(battleNum);
                const aiLeadPokemons = aiTeam.slice(0, battleNum);
                const aiBenchPokemons = aiTeam.slice(battleNum);

                function initBattleAttribute(pokemons) {
                    pokemons.map((pokemon) => {
                        pokemon.initBattleAttribute()
                    })
                };

                initBattleAttribute(playerLeadPokemons);
                initBattleAttribute(playerBenchPokemons);
                initBattleAttribute(aiLeadPokemons);
                initBattleAttribute(aiBenchPokemons);

                function noneToEmpty(pokemons) {
                    pokemons.map(pokemon => {
                        pokemon.learnedMoveNames.map((moveName, i) => {
                            if (moveName === NONE) {
                                pokemon.learnedMoveNames[i] = ""
                            }
                        });
    
                        if (pokemon.item === NONE) {
                            pokemon.item = ""
                        };
                    })
                }

                noneToEmpty(playerLeadPokemons);
                noneToEmpty(playerBenchPokemons);
                noneToEmpty(aiLeadPokemons);
                noneToEmpty(aiBenchPokemons);

                const battleInitURL = new URL(BATTLE_INIT_SERVER_URL);
                battleInitURL.searchParams.append("ai_trainer_title", encodeURIComponent("四天王"));
                battleInitURL.searchParams.append("ai_trainer_name", encodeURIComponent("カトレア"));
                battleInitURL.searchParams.append("player_lead_pokemons", encodeURIComponent(JSON.stringify(playerLeadPokemons)));
                battleInitURL.searchParams.append("player_bench_pokemons", encodeURIComponent(JSON.stringify(playerBenchPokemons)));
                battleInitURL.searchParams.append("ai_lead_pokemons", encodeURIComponent(JSON.stringify(aiLeadPokemons)));
                battleInitURL.searchParams.append("ai_bench_pokemons", encodeURIComponent(JSON.stringify(aiBenchPokemons)));

                const battleMCTSInitURL = new URL(BATTLE_MCTS_INIT_SERVER_URL);
                battleMCTSInitURL.searchParams.append("c", 5.0);

                const battleInitFetcher = fetch(battleInitURL.toString());
                const battleMCTSInitFetcher = fetch(battleMCTSInitURL.toString());
                alert(battleMCTSInitURL.toString());

                Promise.all([battleInitFetcher, battleMCTSInitFetcher])
                .then(async ([battleInitResponse, battleMCTSInitResponse]) => {
                  const initBattles = await battleInitResponse.json();
                  sessionStorage.setItem("init_battles", JSON.stringify(initBattles));
                  sessionStorage.setItem("battle_type", battleTypeRadio.value);
                  location.href = "ai.html";
                })
                .catch(error => {
                  console.error("エラーが発生", error);
                });
            });
        });

        let draggedImg;
        initTeamSessionStorageSetter
            .then(() => {
                document.addEventListener("dragstart", (event) => {
                    draggedImg = event.target;
                    event.target.style.opacity = 0.5;
                });
        
                document.addEventListener("dragend", (event) => {
                    event.target.style.opacity = "";
                });
        
                document.addEventListener("dragover", (event) => {
                    event.preventDefault();
                });
        
                document.addEventListener("drop", (event) => {
                    if (event.target.tagName !== "IMG") {
                        return
                    }

                    const targetSrc = event.target.src;
                    const targetIndex = parseInt(event.target.dataset.index, 10);
                    const draggedSrc = draggedImg.src;
                    const draggedIndex = parseInt(draggedImg.dataset.index, 10);

                    const targetPokemon = TeamSessionStorage.get(targetIndex);
                    const dragendPokemon = TeamSessionStorage.get(draggedIndex);
                    event.target.src = draggedSrc;
                    draggedImg.src = targetSrc;

                    TeamSessionStorage.set(targetPokemon, draggedIndex);
                    TeamSessionStorage.set(dragendPokemon, targetIndex);
                    updateHrefs();
                });
            });
});