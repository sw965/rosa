let ALL_POKE_NAMES;
const allPokeNamesLoader =
fetch(makeDawnFullURL("all_poke_names"))
    .then(response => {
        return response.json();
    })
    .then(json => {
        return new Promise(resolve => {
            ALL_POKE_NAMES = Array.from(JSON.parse(JSON.stringify(json)));
            resolve();
        })
    })

let POKEDEX;
const pokedexLoader =
    fetch(makeDawnFullURL("pokedex"))
        .then(response => {
            return response.json();
        })
        .then(json => {
            return new Promise(resolve => {
                POKEDEX = JSON.parse(JSON.stringify(json));
                resolve();
            })
        });

let ALL_NATURES
const allNaturesLoader =
    fetch(makeDawnFullURL("all_natures"))
        .then(response => {
            return response.json();
        })
        .then(json => {
            return new Promise(resolve => {
                ALL_NATURES = Array.from(JSON.parse(JSON.stringify(json)));
                resolve();
            })
        })

const baseDataLoader = Promise.all([pokedexLoader, allPokeNamesLoader, allNaturesLoader])
    .catch(err => {
        alert("dawn.exeファイルが実行されていないかもしれません。");
        console.error(err);
    });