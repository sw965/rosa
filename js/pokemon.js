class Pokemon {
    constructor() {
        this.name = null;
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
}

function objectToPokemon(obj) {
    const pokemon = new Pokemon();
    pokemon.name = obj.name;
    pokemon.nature = obj.nature;
    pokemon.moveNames = obj.moveNames;
    pokemon.pointUps = obj.pointUps;
    pokemon.moveset = obj.moveset;
    pokemon.ivStat = obj.ivStat;
    pokemon.evStat = obj.evStat;
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
        return ((this.base*2 + this.iv + this.ev/4) * this.level / 100) + this.level + 10;
    }

    hpOther(bonus) {
        const stat = (this.base*2 + this.iv + this.ev/4) * this.level / 100 + 5;
        return parseInt(stat * bonus, 10);
    }
}