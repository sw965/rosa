class PokemonSessionStorage {
    static keys = [
        "playerPokemon1", "playerPokemon2", "playerPokemon3",
        "playerPokemon4", "playerPokemon5", "playerPokemon6",

        "aiPokemon1", "aiPokemon2", "aiPokemon3",
        "aiPokemon4", "aiPokemon5", "aiPokemon6",
    ]

    static get(teamIndex) {
        const key = PokemonSessionStorage.keys[teamIndex];
        const pokemonStr = sessionStorage.getItem(key);
        if (pokemonStr === null) {
            return new Pokemon();
        } else {
            return objectToPokemon(JSON.parse(pokemonStr));
        }
    }

    static set(pokemon, teamIndex) {
        const key = PokemonSessionStorage.keys[teamIndex];
        sessionStorage.setItem(key, JSON.stringify(pokemon));
    }

    static getPlayerPokemons() {
        const pokemons = []
        for (let i = 0; i < MAX_TEAM_NUM; i++) {
            pokemons.push(PokemonSessionStorage.get(i));
        }
        return pokemons;
    }

    static getAIPokemons() {
        const pokemons = []
        for (let i = 0; i < MAX_TEAM_NUM; i++) {
            pokemons.push(PokemonSessionStorage.get(i + MAX_TEAM_NUM));
        }
        return pokemons;
    }
}

const initPokemonSessionStorageSetter = baseDataLoader
    .then(() => {
        const bothTeamPokeNames = ALL_POKE_NAMES.slice(0, MAX_TEAM_NUM)
            .concat(ALL_POKE_NAMES.slice(0, MAX_TEAM_NUM));

        bothTeamPokeNames.map((pokeName, i) => {
            const pokeData = POKEDEX[pokeName];
            const pokemon = PokemonSessionStorage.get(i);
            if (pokemon.name === null) {
                pokemon.name = pokeName;
            }

            if (pokemon.level === null) {
                pokemon.level = STANDARD_LEVEL;
            }

            if (pokemon.nature === null) {
                pokemon.nature = ALL_NATURES[0];
            }
    
            if (pokemon.moveNames === null) {
                pokemon.moveNames = [pokeData.Learnset[0], EMPTY, EMPTY, EMPTY];
            }

            if (pokemon.pointUps === null) {
                pokemon.pointUps = [MAX_POINT_UP, MAX_POINT_UP, MAX_POINT_UP, MAX_POINT_UP];
            }

            if (pokemon.moveset === null) {
                pokemon.updateMoveset();
            }

            if (pokemon.individualStat.hp === null) {
                pokemon.individualStat.hp = MAX_IV;
            }
    
            if (pokemon.individualStat.atk === null) {
                pokemon.individualStat.atk = MAX_IV;
            }
    
            if (pokemon.individualStat.def === null) {
                pokemon.individualStat.def = MAX_IV;
            }
    
            if (pokemon.individualStat.spAtk === null) {
                pokemon.individualStat.spAtk = MAX_IV;
            }
    
            if (pokemon.individualStat.spDef === null) {
                pokemon.individualStat.spDef = MAX_IV;
            }
    
            if (pokemon.individualStat.speed === null) {
                pokemon.individualStat.speed = MAX_IV;
            }
    
            if (pokemon.effortStat.hp === null) {
                pokemon.effortStat.hp = MIN_EV;
            }
    
            if (pokemon.effortStat.atk === null) {
                pokemon.effortStat.atk = MIN_EV;
            }
    
            if (pokemon.effortStat.def === null) {
                pokemon.effortStat.def = MIN_EV;
            }
    
            if (pokemon.effortStat.spAtk === null) {
                pokemon.effortStat.spAtk = MIN_EV;
            }
    
            if (pokemon.effortStat.spDef === null) {
                pokemon.effortStat.spDef = MIN_EV;
            }
    
            if (pokemon.effortStat.speed === null) {
                pokemon.effortStat.speed = MIN_EV;
            }

            pokemon.updateStat();
            PokemonSessionStorage.set(pokemon, i);
        });
    });