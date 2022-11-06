import {autocomplete} from "./auto.js"
let res = document.querySelector("main#main");
var bar = document.querySelector("input#search");
var pokemondata = document.querySelector("h1.pokemon__data");
var search = "";
var currentId = null;
var namesArr = [];

Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}

const loadPokemon = async (id, cb) => {
    return fetch(id != null ? `https://pokeapi.co/api/v2/pokemon/${id}` : `https://pokeapi.co/api/v2/pokemon/?limit=1154`)
        .then(handleErrors)
        .then(res => res.json())
        .then(data => {
            cb(data);
        })
}
const getBasics = id => {
    loadPokemon(id, (data) => {
        let name = data.name;
        let dyn = document.getElementById("dynamic-image")
        pokemondata.innerHTML = "";
        dyn.innerHTML = "";
        currentId = data.id;
        let pokeimg = data.sprites.versions['generation-v']['black-white'].animated.front_default || data.sprites.front_default || data.sprites.other['official-artwork'].front_default;

        var pokemonnumber = document.createElement("span");
        pokemonnumber.setAttribute("class", "pokemon__number");
        pokemonnumber.innerHTML = currentId + ' - ';
        pokemondata.appendChild(pokemonnumber);

        var pokemonname = document.createElement("span");
        pokemonname.setAttribute("class", "pokemon__name");
        pokemonname.innerHTML = name;
        pokemondata.appendChild(pokemonname);

        var imagem = document.createElement("img");
        imagem.setAttribute("src", pokeimg);
        imagem.setAttribute("class", "pokemon");
        dyn.appendChild(imagem);
    });
}
function handleErrors(response) {
    if (!response.ok) {
        alert('Invalid Name or ID.');
        throw Error(response.statusText);
    }
    return response;
}

export function procurar() {
    search = bar.value;
    if (search != '') {
        if (isNaN(search)) {
            getBasics(String(search).toLowerCase());
        } else {
            getBasics(search);
        }
    } else {
        window.alert('Input a Name or ID')
    }
}
function prevP() {
    getBasics(currentId - 1);
}
function nextP() {
    getBasics(currentId + 1);
}

document.getElementById('prev').addEventListener("click", prevP, false)
document.getElementById('next').addEventListener("click", nextP, false)
bar.addEventListener('keyup', evento => {
    if (evento.keyCode === 13) {
        evento.preventDefault();
        procurar();
    }
});
document.addEventListener('keyup', evento => {
    if (evento.keyCode === 37) {
        evento.preventDefault();
        prevP();
    }
});
document.addEventListener('keyup', evento => {
    if (evento.keyCode === 39) {
        evento.preventDefault();
        nextP();
    }
});



(async () => {
    if (localStorage.getObj('pokeNome') == null) {
        await loadPokemon(null, data => {
            data.results.forEach(pokemon => {
                namesArr.push(pokemon.name);
            })
        })
        localStorage.setObj('pokeNome', namesArr);
        setTimeout(autocomplete(document.getElementById("search"), namesArr || ''), 1000)
    }
})()
