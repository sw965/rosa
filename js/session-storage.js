class PokemonSessionStorage {
    static keys = [
        "pokemon1", "pokemon2", "pokemon3",
        "pokemon4", "pokemon5", "pokemon6",   
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

    static getTeam() {
        const team = [];
        for (let i =0; i < MAX_TEAM_NUM; i++) {
            team.push(PokemonSessionStorage.get(i));
        }
        return team;
    }
}

const initPokemonSessionStorageSetter = baseDataLoader
    .then(() => {
        ALL_POKE_NAMES.slice(0, MAX_TEAM_NUM).map((pokeName, i) => {
            const pokeData = POKEDEX[pokeName];
            const pokemon = PokemonSessionStorage.get(i);
            if (pokemon.name === null) {
                pokemon.name = pokeName;
            }

            if (pokemon.nature === null) {
                pokemon.nature = ALL_NATURES[0];
            }

            if (pokemon.moveNames === null) {
                pokemon.moveNames = [pokeData.Learnset[0], EMPTY, EMPTY, EMPTY];
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
            PokemonSessionStorage.set(pokemon, i);
        });
    });