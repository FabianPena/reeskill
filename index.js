const axios = require('axios');
const http = require('http');



http.createServer(function(request, response){
if(request.url.startsWith('/pokemones')){    
    let poketoons = [];

    async function getPokemonesGenOne(){
        const { data } = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=150');
        return data.results;
    }
    
    async function getPokemonData(poke){
        const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${poke}`);
        return data;
    }
    
    getPokemonesGenOne()
    .then((resultados) => {
        resultados.forEach(pokemon => {
            let pokeName = pokemon.name;
            poketoons.push(getPokemonData(pokeName));
        });
        Promise.all(poketoons)
        .then((data) => {
            let pokeData = [];
            data.forEach((elemento) => {
                let imagen = elemento.sprites.other["official-artwork"].front_default;
                let nombre = elemento.name;
                let id = elemento.id;
                pokeData.push({id, imagen, nombre});
            });
            response.writeHead(200, {'Access-Control-Allow-Origin': '*', /* @dev First, read about security */
                                    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
                                    'Access-Control-Max-Age': 2592000,
                                    'Content-Type':'application/json'})
            response.write(JSON.stringify(pokeData));
            response.end();
        });
    });


}

}).listen(3000);
