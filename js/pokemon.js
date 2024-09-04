class Pokemon {
    constructor() {
        this.name = null;
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
        this.rankStat = null;
    
        this.isFlinchState = false;
        this.remainingTurnTauntState = 0;
        this.isProtectState = false;
        this.protectConsecutiveSuccess = 0;
        this.substituteHP = 0;
    
        //場に出てから経過したターンをカウントする。ねこだましなどに使う。
        this.turnCount = 0;
        this.thisTurnPlannedUseMoveName = null;
    }
    
    updateMoveset() {
        const moveset = {};
        this.moveNames.filter(moveName => {
            return moveName !== EMPTY;
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

    //命名が気になる
    getStatText() {
        let text = "";
        text += "(HP：" + this.stat.maxHP + ")";
        text += " (攻撃：" + this.stat.atk + ")";
        text += " (防御：" + this.stat.def + ")";
        text += " (特攻：" + this.stat.spAtk + ")";
        text += " (特防：" + this.stat.spDef + ")";
        text += " (素早さ：" + this.stat.speed + ")";
        return text;
    }

}

//属性が足りてない
function objectToPokemon(obj) {
    const pokemon = new Pokemon();
    pokemon.name = obj.name;
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
        const evBonus = Math.floor(this.effort/EFFECT_EV);
        return Math.floor(((this.baseStat*2 + this.individual + evBonus) * this.level / 100)) + this.level + 10;
    }

    hpOther(natureBonus) {
        const evBonus = Math.floor(this.effort/EFFECT_EV);
        const stat = (this.baseStat*2 + this.individual + evBonus) * this.level/100 + 5;
        return parseInt(stat * natureBonus, 10);
    }
}

//命名やグローバルが気になる
function getPokemonImgPath(pokeName) {
    return "data/fourth-generation/img/" + pokeName + ".gif";
}