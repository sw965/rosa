class Pokemon {
    constructor() {
        this.name = null;
        this.nature = null;

        this.moveNames = null;
        this.pointUps = null;

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
}

function objectToPokemon(obj) {
    const pokemon = new Pokemon();
    pokemon.name = obj.name;
    pokemon.nature = obj.nature;
    pokemon.moveNames = obj.moveNames;
    pokemon.pointUps = obj.pointUps;
    pokemon.ivStat = obj.ivStat;
    pokemon.evStat = obj.evStat;
    return pokemon;
}