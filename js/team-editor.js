const BATTLE_START_BUTTON_ID = "battle-start-button";

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
                if (battleTypeRadio.value === "シングルバトル") {
                    battleNum = 1;
                } else if (battleTypeRadio.value === "ダブルバトル") {
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
                        pokemon.moveNames.map((moveName, i) => {
                            if (moveName === NONE) {
                                pokemon.moveNames[i] = ""
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

                const url = new URL(BATTLE_INIT_SERVER_URL);
                url.searchParams.append("ai_trainer_title", encodeURIComponent("四天王"));
                url.searchParams.append("ai_trainer_name", encodeURIComponent("カトレア"));
                url.searchParams.append("player_lead_pokemons", encodeURIComponent(JSON.stringify(playerLeadPokemons)));
                url.searchParams.append("player_bench_pokemons", encodeURIComponent(JSON.stringify(playerBenchPokemons)));
                url.searchParams.append("ai_lead_pokemons", encodeURIComponent(JSON.stringify(aiLeadPokemons)));
                url.searchParams.append("ai_bench_pokemons", encodeURIComponent(JSON.stringify(aiBenchPokemons)));

                fetch(url.toString())
                    .then(response => {
                        return response.json();
                    })
                    .then((responseJson) => {
                        if (responseJson === "ok") {
                            location.href = "ai.html";
                        } else {
                            alert("バトルの初期化に失敗しました。");
                        }
                    })
            });
        })

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