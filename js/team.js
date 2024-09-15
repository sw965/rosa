class TeamSessionStorage {
    static keys = [
        "playerPokemon1", "playerPokemon2", "playerPokemon3",
        "playerPokemon4", "playerPokemon5", "playerPokemon6",

        "aiPokemon1", "aiPokemon2", "aiPokemon3",
        "aiPokemon4", "aiPokemon5", "aiPokemon6",
    ]

    static get(idx) {
        const key = TeamSessionStorage.keys[idx];
        const pokemonStr = sessionStorage.getItem(key);
        if (pokemonStr === null) {
            return new Pokemon();
        } else {
            return objectToPokemon(JSON.parse(pokemonStr));
        }
    }

    static set(pokemon, idx) {
        const key = TeamSessionStorage.keys[idx];
        sessionStorage.setItem(key, JSON.stringify(pokemon));
    }

    static getPlayerTeam() {
        const team = []
        for (let i = 0; i < MAX_TEAM_NUM; i++) {
            team.push(TeamSessionStorage.get(i));
        }
        return team;
    }

    static getAITeam() {
        const team = []
        for (let i = 0; i < MAX_TEAM_NUM; i++) {
            team.push(TeamSessionStorage.get(i + MAX_TEAM_NUM));
        }
        return team;
    }

    static getPlayerAndAITeam() {
        return TeamSessionStorage.getPlayerTeam().concat(TeamSessionStorage.getAITeam());
    }
}

const initTeamSessionStorageSetter = baseDataLoader
    .then(() => {
        const playerTeamPokeNames = ALL_POKE_NAMES.slice(0, MAX_TEAM_NUM);
        const aiTeamPokeNames = ALL_POKE_NAMES.slice(0, MAX_TEAM_NUM);
        playerTeamPokeNames.concat(aiTeamPokeNames).map((pokeName, i) => {
            const pokeData = POKEDEX[pokeName];
            const pokemon = TeamSessionStorage.get(i);

            if (pokemon.name === null) {
                pokemon.name = pokeName;
            }

            if (pokemon.level === null) {
                pokemon.level = STANDARD_LEVEL;
            }

            if (pokemon.nature === null) {
                pokemon.nature = ALL_NATURES[0];
            }

            if (pokemon.ability === null) {
                pokemon.ability = pokeData.Abilities[0];
            }

            if (pokemon.item === null) {
                pokemon.item = NONE;
            }

            if (pokemon.moveNames === null) {
                pokemon.moveNames = [pokeData.Learnset[0], NONE, NONE, NONE];
            }

            if (pokemon.pointUps === null) {
                pokemon.pointUps = [MAX_POINT_UP, MAX_POINT_UP, MAX_POINT_UP, MAX_POINT_UP];
            }

            if (pokemon.moveset === null) {
                pokemon.updateMoveset();
            }

            if (pokemon.individualStat.hp === null) {
                pokemon.individualStat.hp = MAX_INDIVIDUAL;
            }
    
            if (pokemon.individualStat.atk === null) {
                pokemon.individualStat.atk = MAX_INDIVIDUAL;
            }
    
            if (pokemon.individualStat.def === null) {
                pokemon.individualStat.def = MAX_INDIVIDUAL;
            }
    
            if (pokemon.individualStat.spAtk === null) {
                pokemon.individualStat.spAtk = MAX_INDIVIDUAL;
            }
    
            if (pokemon.individualStat.spDef === null) {
                pokemon.individualStat.spDef = MAX_INDIVIDUAL;
            }
    
            if (pokemon.individualStat.speed === null) {
                pokemon.individualStat.speed = MAX_INDIVIDUAL;
            }
    
            if (pokemon.effortStat.hp === null) {
                pokemon.effortStat.hp = MIN_EFFORT;
            }
    
            if (pokemon.effortStat.atk === null) {
                pokemon.effortStat.atk = MIN_EFFORT;
            }
    
            if (pokemon.effortStat.def === null) {
                pokemon.effortStat.def = MIN_EFFORT;
            }
    
            if (pokemon.effortStat.spAtk === null) {
                pokemon.effortStat.spAtk = MIN_EFFORT;
            }
    
            if (pokemon.effortStat.spDef === null) {
                pokemon.effortStat.spDef = MIN_EFFORT;
            }
    
            if (pokemon.effortStat.speed === null) {
                pokemon.effortStat.speed = MIN_EFFORT;
            }

            pokemon.updateStat();
            TeamSessionStorage.set(pokemon, i);
        });
    });