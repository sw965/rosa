class Pokemon {
    constructor() {
        this.name = null;
        this.level = null;
        this.nature = null;

        this.moveNames = null;
        this.pointUps = null;
        this.moveset = null;

        this.ivStat = {
            hp:null,
            atk:null,
            def:null,
            spAtk:null,
            spDef:null,
            speed:null,
        };

        this.evStat = {
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

    getIVArray() {
        return [
            this.ivStat.hp,
            this.ivStat.atk,
            this.ivStat.def,
            this.ivStat.spAtk,
            this.ivStat.spDef,
            this.ivStat.speed,
        ];
    }

    setMaxIVStat() {
        this.ivStat = {
            hp:MAX_IV,
            atk:MAX_IV,
            def:MAX_IV,
            spAtk:MAX_IV,
            spDef:MAX_IV,
            speed:MAX_IV,
        };
    }

    getEVArray() {
        return [
            this.evStat.hp,
            this.evStat.atk,
            this.evStat.def,
            this.evStat.spAtk,
            this.evStat.spDef,
            this.evStat.speed,
        ];
    }

    setMinEVStat() {
        this.evStat = {
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
        const hp = new PokemonEachStatCalculator(pokeData.BaseHP, this.level, this.ivStat.hp, this.evStat.hp).hp();
        this.stat.maxHP = hp;
        this.stat.currentHP = hp;
        this.stat.atk = new PokemonEachStatCalculator(pokeData.BaseAtk, this.level, this.ivStat.atk, this.evStat.atk).hpOther(natureData.AtkBonus);
        this.stat.def = new PokemonEachStatCalculator(pokeData.BaseDef, this.level, this.ivStat.def, this.evStat.def).hpOther(natureData.DefBonus);
        this.stat.spAtk = new PokemonEachStatCalculator(pokeData.BaseSpAtk, this.level, this.ivStat.spAtk, this.evStat.spAtk).hpOther(natureData.SpAtkBonus);
        this.stat.spDef = new PokemonEachStatCalculator(pokeData.BaseSpDef, this.level, this.ivStat.spDef, this.evStat.spDef).hpOther(natureData.SpDefBonus);
        this.stat.speed = new PokemonEachStatCalculator(pokeData.BaseSpeed, this.level, this.ivStat.speed, this.evStat.speed).hpOther(natureData.SpeedBonus);
    }

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

    pokemon.ivStat = obj.ivStat;
    pokemon.evStat = obj.evStat;
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

function getPokemonImgPath(pokeName) {
    return "data/fourth-generation/img/" + pokeName + ".gif";
}