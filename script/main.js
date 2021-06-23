function submitForm(e) {
    e.preventDefault()

    let loading = document.getElementById("loading")
    let curiosity = document.getElementById("curiosity")
    loading.style.display = "block"
    curiosity.style.display = "none"

    if (sessionStorage.getItem('starshipsValue') === null) {
        LoadStarships()
    } else {
        document.getElementById('totalStarships').innerText = `${Number(sessionStorage.getItem('starshipsValue')).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`
    }

    let inpTxtSearch = document.getElementById("inp-txt-search").value
    limpar()

    fetch(`https://swapi.dev/api/films/?format=json`)
        .then(res => res.json())
        .then(resultFilm => {
            console.log(resultFilm)
            resultFilm.results.forEach(elementFilm => {

            });
        })



    // consulta de dados na API - primeira promisse
    fetch(`https://swapi.dev/api/people/?search=${inpTxtSearch}&format=json`)
        // segunda promisse
        .then(res => res.json())
        .then(result => {
            console.log(result)

            loading.style.display = "none"
            curiosity.style.display = "block"

            //retorno
            result.results.forEach(element => {
                inserirElemento(element)
            });
        })

}

function limpar() {

    // container principal para os resultados
    let resultado = document.getElementById("result")

    // aqui limpa para entrar novos registros
    resultado.innerHTML = ""
}

// function buscar() {
//     // Pegando o planeta natal
//     var planetaNatal = document.getElementById('planetaNatal')
        // await fetch(element.homeworld)
        //     .then(res => res.json())
        //     .then(result => planetaNatal = result.name)
// }
function inserirElemento(element, elementFilm) {
    // container principal para os resultados
    let resultado = document.getElementById("result")
    const newElement = document.createElement('div');
    newElement.classList.add('card');
    newElement.innerHTML = `
        <div class="card-person">
            <span><b>Nome Completo:</b> ${element.name}</span>
            <span><b>Altura:</b> ${element.height} cm</span>
            <span><b>Peso:</b> ${element.mass} Kg</span>
            <span><b>Planeta Natal:</b><span id="planetaNatal"></span></span>
        </div>
        <div class="line"></div>
        <div class="card-person">
            <span><b>Filmes:</b></span>
            <span></span>
            <span>The Empire Strikes Back</span>
            <span>Return Of The Jedi</span>
            <span>Revenge of The Sith</span>
        </div>
    `;
    resultado.append(newElement);


}

function LoadStarships() {
    fetch('https://swapi.dev/api/starships/?format=json&page=1')
        .then(response => response.json())
        .then(starships => {
            var soma = 0
            console.log("starships ", starships)
            starships.results.forEach(elementStarships => {
                let cost = elementStarships.cost_in_credits
                if (cost == "unknown") {
                    cost = 0
                }
                console.log("Custo da Nave: " + parseFloat(cost))
                soma += parseFloat(cost)
                console.log("Soma da Nave1: " + soma)


            })
            var pag = Math.ceil(starships.count / 10)
            for (let i = 2; i <= pag; i++) {

                fetch('https://swapi.dev/api/starships/?format=json&page=' + i)
                    .then(response => response.json())
                    .then(starships => {
                        starships.results.forEach(elementStarships => {
                            let cost = elementStarships.cost_in_credits
                            if (cost == "unknown") {
                                cost = 0
                            }
                            console.log("Custo da Nave: " + parseFloat(cost))
                            soma += parseFloat(cost)
                            console.log("Soma da Nave: " + soma)

                        })
                        console.log("Soma da TOTAL GERAL: " + soma)
                    })
            }
            document.getElementById('totalStarships').innerText = `${Number(sessionStorage.getItem('starshipsValue')).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`
            sessionStorage.setItem('starshipsValue', soma)
        })
}
