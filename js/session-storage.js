class PokemonSessionStorage {
    static keys = [
        "selfPokemon1", "selfPokemon2", "selfPokemon3",
        "selfPokemon4", "selfPokemon5", "selfPokemon6",

        "opponentPokemon1", "opponentPokemon2", "opponentPokemon3",
        "opponentPokemon4", "opponentPokemon5", "opponentPokemon6",
    ]

    static get(teamIndex) {
        const key = PokemonSessionStorage.keys[teamIndex];
        const item = sessionStorage.getItem(key);
        if (item === null) {
            return new Pokemon();
        } else {
            return objectToPokemon(JSON.parse(item));
        }
    }

    static set(pokemon, teamIndex) {
        const key = PokemonSessionStorage.keys[teamIndex];
        sessionStorage.setItem(key, JSON.stringify(pokemon));
    }

    static getBothTeam() {
        const bothTeam = [];
        for (let i =0; i < MAX_BOTH_TEAM_NUM; i++) {
            bothTeam.push(PokemonSessionStorage.get(i));
        }
        return bothTeam;
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

            if (pokemon.ivStat.hp === null) {
                pokemon.ivStat.hp = MAX_IV;
            }
    
            if (pokemon.ivStat.atk === null) {
                pokemon.ivStat.atk = MAX_IV;
            }
    
            if (pokemon.ivStat.def === null) {
                pokemon.ivStat.def = MAX_IV;
            }
    
            if (pokemon.ivStat.spAtk === null) {
                pokemon.ivStat.spAtk = MAX_IV;
            }
    
            if (pokemon.ivStat.spDef === null) {
                pokemon.ivStat.spDef = MAX_IV;
            }
    
            if (pokemon.ivStat.speed === null) {
                pokemon.ivStat.speed = MAX_IV;
            }
    
            if (pokemon.evStat.hp === null) {
                pokemon.evStat.hp = MIN_EV;
            }
    
            if (pokemon.evStat.atk === null) {
                pokemon.evStat.atk = MIN_EV;
            }
    
            if (pokemon.evStat.def === null) {
                pokemon.evStat.def = MIN_EV;
            }
    
            if (pokemon.evStat.spAtk === null) {
                pokemon.evStat.spAtk = MIN_EV;
            }
    
            if (pokemon.evStat.spDef === null) {
                pokemon.evStat.spDef = MIN_EV;
            }
    
            if (pokemon.evStat.speed === null) {
                pokemon.evStat.speed = MIN_EV;
            }
            
            pokemon.updateStat();
            PokemonSessionStorage.set(pokemon, i);
        });
    });