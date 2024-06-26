document.addEventListener("DOMContentLoaded", (event) => {
    const MAX_MOVESET_NUM = 4;
    const MOVE_SELECT_IDS = [];

    const moveContainer = document.getElementById("move-container")

    for (let i=0; i < MAX_MOVESET_NUM; i++) {
        const moveSelectId = "move" + i + "-select";
        MOVE_SELECT_IDS.push(moveSelectId);

        const moveLebel = document.createElement("label");
        moveLebel.for = moveSelectId
        moveLebel.innerText = "技" + i;

        const moveSelect = document.createElement("select");
        moveSelect.id = moveSelectId

        pointUpInputId = "point-up" + i + "-input";
        const pointUpInput = document.createElement('input');
        pointUpInput.type = "number";
        pointUpInput.id = pointUpInputId;
        pointUpInput.min = "-1";
        pointUpInput.max = "3";
        pointUpInput.step = "1";
        pointUpInput.value = "3";

        moveContainer.appendChild(moveLebel);
        moveContainer.appendChild(moveSelect);
        moveContainer.appendChild(pointUpInput);
        moveContainer.appendChild(document.createElement("br"));
    }

    const baseURL = "http://localhost:8080/dawn/";

    function makeFullURL(dataType) {
        return baseURL + `?data_type=${encodeURIComponent(dataType)}`;
    }

    fetch(makeFullURL("all_poke_names"))
        .then((response) => {
            return response.json();
        })
        .then((json) => {
            const ALL_POKE_NAMES = Array.from(JSON.parse(JSON.stringify(json)));
            const pokemonSelect = document.getElementById("pokemon-select");
            
            ALL_POKE_NAMES.map((pokeName) => {
                const option = document.createElement("option");
                option.innerText = pokeName;
                option.value = pokeName;
                pokemonSelect.appendChild(option);
            });
            return ALL_POKE_NAMES;
        })
        .then((allPokeNames) => {
            const pokeName = allPokeNames[0];
            const promise = 
                fetch(makeFullURL("pokedex"))
                    .then((response) => {
                        return response.json();
                    })
                    .then((json) => {
                        return handlePokemonSelect(json, pokeName);
                    })
            return promise
        })
    
    fetch(makeFullURL("all_natures"))
        .then((response) => {
            return response.json();
        })
        .then((json) => {
            const ALL_NATURES = Array.from(JSON.parse(JSON.stringify(json)));
            const natureSelect = document.getElementById("nature-select");
            ALL_NATURES.map((nature, i) => {
                let option = document.createElement("option");
                option.innerText = nature;
                option.value = nature;
                natureSelect.appendChild(option);
            });
        })
    
    function handlePokemonSelect(responseJSON, pokeName) {
        return new Promise((resolve) => {
            const POKEDEX = JSON.parse(JSON.stringify(responseJSON));
            const LEARNSET = POKEDEX[pokeName].Learnset;
            MOVE_SELECT_IDS.map((moveSelectId, i) => {
                const moveSelect = document.getElementById(moveSelectId);
                while (moveSelect.firstChild) {
                    moveSelect.removeChild(moveSelect.firstChild);
                }

                if (i != 0) {
                    const option = document.createElement("option");
                    option.innerText = "なし";
                    option.value = "なし";
                    moveSelect.prepend(option);
                }

                LEARNSET.map((moveName) => {
                    const option = document.createElement("option");
                    option.innerText = moveName;
                    option.value = moveName;
                    moveSelect.appendChild(option);
                });
            });
            resolve();
        })
    }

    function handleMoveSelect() {
        const MOVE_NAMES = MOVE_SELECT_IDS.map((moveSelectId) => {
            const moveSelect = document.getElementById(moveSelectId)
            return moveSelect.value
        })

        while (this.firstChild) {
            this.removeChild(this.firstChild);
        }

        fetch(makeFullURL("pokedex"))
            .then((response) => {
                return response.json();
            })
            .then((json) => {
                const POKEDEX = JSON.parse(JSON.stringify(json));
                const POKE_NAME = document.getElementById("pokemon-select")
                const LEARNSET = POKEDEX[POKE_NAME].Learnset
                MOVE_NAMES.map((moveName, i) => {
                    const uniqueLearnset = LEARNSET.filter((moveName) => {
                        return moveName == "なし" || !MOVE_NAMES.includes(moveName)
                    });

                    uniqueLearnset.map((moveName) => {
                        const option = document.createElement("option");
                        option.innerText = moveName;
                        option.innerHTML = moveName;
                        this.appendChild(option);
                    });
                })
            })
    }

    const pokemonSelect = document.getElementById("pokemon-select");
    pokemonSelect.addEventListener("change", function() {
        fetch(makeFullURL("pokedex"))
            .then((response) => {
                return response.json();
            })
            .then((json) => {
                return updateMoveSelect(json, this.value)
            })
    });

    MOVE_SELECT_IDS.map((moveSelectId) => {
        const moveSelect = document.getElementById(moveSelectId);
        moveSelect.addEventListener("change", handleMoveSelect)
    })
});