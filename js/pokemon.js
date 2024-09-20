class Pokemon {
    constructor() {
        this.name = null;
        this.gender = null;
        this.level = null;

        this.nature = null;
        this.ability = null;
        this.item = null;

        this.moveNames = null;
        this.pointUps = null;
        this.moveset = null;

        this.individualStat = {
            hp:null,
            atk:null,
            def:null,
            spAtk:null,
            spDef:null,
            speed:null,
        };

        this.effortStat = {
            hp:null,
            atk:null,
            def:null,
            spAtk:null,
            spDef:null,
            speed:null,
        };

        this.stat = {
            maxHP:null,
            currentHP:null,
            atk:null,
            def:null,
            spAtk:null,
            spDef:null,
            speed:null,
        }

        //ここからは、バトル中に動的に変わる属性
        this.types =  null;
        this.statusAilment = null;
        this.rankStat = {
            atk:null,
            def:null,
            spAtk:null,
            spDef:null,
            speed:null,
        };
    
        this.isFlinchState = null;
        this.remainingTurnTauntState = null;
        this.isProtectState = null;
        this.protectConsecutiveSuccess = null;
        this.substituteHP = null;
        this.turnCount = null;

        /*
            bippa(go言語)側のPokemon構造体には、下記の属性もあるが、js側からは操作しない為、削除する。
            this.thisTurnPlannedUseMoveName
        */
    }
    
    updateMoveset() {
        const moveset = {};
        this.moveNames.filter(moveName => {
            return moveName !== NONE;
        }).map((moveName, i) => {
            const pointUp = this.pointUps[i];
            const moveData = MOVEDEX[moveName];
            const pp = calcPowerPoint(moveData.BasePP, pointUp);
            moveset[moveName] = {max:pp, current:pp};
        })
        this.moveset = moveset;
    }

    getIndividuals() {
        return [
            this.individualStat.hp,
            this.individualStat.atk,
            this.individualStat.def,
            this.individualStat.spAtk,
            this.individualStat.spDef,
            this.individualStat.speed,
        ];
    }

    setMaxIndividualStat() {
        this.individualStat = {
            hp:MAX_IV,
            atk:MAX_IV,
            def:MAX_IV,
            spAtk:MAX_IV,
            spDef:MAX_IV,
            speed:MAX_IV,
        };
    }

    getEfforts() {
        return [
            this.effortStat.hp,
            this.effortStat.atk,
            this.effortStat.def,
            this.effortStat.spAtk,
            this.effortStat.spDef,
            this.effortStat.speed,
        ];
    }

    setMinEffortStat() {
        this.effortStat = {
            hp:MIN_EV,
            atk:MIN_EV,
            def:MIN_EV,
            spAtk:MIN_EV,
            spDef:MIN_EV,
            speed:MIN_EV,
        };
    }

    updateStat() {
        const pokeData = POKEDEX[this.name];
        const natureData = NATUREDEX[this.nature];
        const hp = new PokemonEachStatCalculator(pokeData.BaseHP, this.level, this.individualStat.hp, this.effortStat.hp).hp();
        this.stat.maxHP = hp;
        this.stat.currentHP = hp;
        this.stat.atk = new PokemonEachStatCalculator(pokeData.BaseAtk, this.level, this.individualStat.atk, this.effortStat.atk).hpOther(natureData.AtkBonus);
        this.stat.def = new PokemonEachStatCalculator(pokeData.BaseDef, this.level, this.individualStat.def, this.effortStat.def).hpOther(natureData.DefBonus);
        this.stat.spAtk = new PokemonEachStatCalculator(pokeData.BaseSpAtk, this.level, this.individualStat.spAtk, this.effortStat.spAtk).hpOther(natureData.SpAtkBonus);
        this.stat.spDef = new PokemonEachStatCalculator(pokeData.BaseSpDef, this.level, this.individualStat.spDef, this.effortStat.spDef).hpOther(natureData.SpDefBonus);
        this.stat.speed = new PokemonEachStatCalculator(pokeData.BaseSpeed, this.level, this.individualStat.speed, this.effortStat.speed).hpOther(natureData.SpeedBonus);
    }

    initBattleAttribute() {
        this.types = POKEDEX[this.name].Types;
        this.statusAilment = "";
        this.rankStat.atk = 0;
        this.rankStat.def = 0;
        this.rankStat.spAtk = 0;
        this.rankStat.spDef = 0;
        this.rankStat.speed = 0;

        this.isFlinchState = false;
        this.remainingTurnTauntState = 0;
        this.isProtectState = false;
        this.protectConsecutiveSuccess = 0;
        this.substituteHP = 0;
        this.turnCount = 0;
    }
}

function objectToPokemon(obj) {
    const pokemon = new Pokemon();
    pokemon.name = obj.name;
    pokemon.gender = obj.gender;
    pokemon.level = obj.level;

    pokemon.nature = obj.nature;
    pokemon.ability = obj.ability;
    pokemon.item = obj.item;

    pokemon.moveNames = obj.moveNames;
    pokemon.pointUps = obj.pointUps;
    pokemon.moveset = obj.moveset;

    pokemon.individualStat = obj.individualStat;
    pokemon.effortStat = obj.effortStat;
    pokemon.stat = obj.stat;
    return pokemon;
}

class PokemonEachStatCalculator {
    constructor(base, level, individual, effort) {
        this.baseStat = base;
        this.level = level;
        this.individual = individual;
        this.effort = effort;
    }

    hp() {
        const evBonus = Math.floor(this.effort/EFFECT_EFFORT);
        return Math.floor(((this.baseStat*2 + this.individual + evBonus) * this.level / 100)) + this.level + 10;
    }

    hpOther(natureBonus) {
        const evBonus = Math.floor(this.effort/EFFECT_EFFORT);
        const stat = (this.baseStat*2 + this.individual + evBonus) * this.level/100 + 5;
        return parseInt(stat * natureBonus, 10);
    }
}