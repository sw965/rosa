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

        this.maxHP = null;
        this.currentHP = null;
        this.atk = null;
        this.def = null;
        this.spAtk = null;
        this.spDef = null;
        this.speed = null;
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
        const hp = new StatCalculator(pokeData.BaseHP, this.level, this.ivStat.hp, this.evStat.hp).hp();
        this.maxHP = hp;
        this.currentHP = hp;
        this.atk = new StatCalculator(pokeData.BaseAtk, this.level, this.ivStat.atk, this.evStat.atk).hpOther(natureData.AtkBonus);
        this.def = new StatCalculator(pokeData.BaseDef, this.level, this.ivStat.def, this.evStat.def).hpOther(natureData.DefBonus);
        this.spAtk = new StatCalculator(pokeData.BaseSpAtk, this.level, this.ivStat.spAtk, this.evStat.spAtk).hpOther(natureData.SpAtkBonus);
        this.spDef = new StatCalculator(pokeData.BaseSpDef, this.level, this.ivStat.spDef, this.evStat.spDef).hpOther(natureData.SpDefBonus);
        this.speed = new StatCalculator(pokeData.BaseSpeed, this.level, this.ivStat.speed, this.evStat.speed).hpOther(natureData.SpeedBonus);
    }
}

function objectToPokemon(obj) {
    const pokemon = new Pokemon();
    pokemon.name = obj.name;
    pokemon.level = obj.level;
    pokemon.nature = obj.nature;
    pokemon.moveNames = obj.moveNames;
    pokemon.pointUps = obj.pointUps;
    pokemon.moveset = obj.moveset;
    pokemon.ivStat = obj.ivStat;
    pokemon.evStat = obj.evStat;
    pokemon.maxHP = obj.maxHP;
    pokemon.currentHP = obj.currentHP;
    pokemon.atk = obj.akt;
    pokemon.def = obj.def;
    pokemon.spAtk = obj.spAtk;
    pokemon.spDef = obj.spDef;
    pokemon.speed = obj.speed;
    return pokemon;
}

class StatCalculator {
    constructor(base, level, iv, ev) {
        this.base = base;
        this.level = level;
        this.iv = iv;
        this.ev = ev;
    }

    hp() {
        const evBonus = Math.floor(this.ev/EFFECT_EV);
        return Math.floor(((this.base*2 + this.iv + evBonus) * this.level / 100)) + this.level + 10;
    }

    hpOther(bonus) {
        const evBonus = Math.floor(this.ev/4);
        const stat = (this.base*2 + this.iv + evBonus) * this.level/100 + 5;
        return parseInt(stat * bonus, 10);
    }
}