const loading = document.getElementById("loading")
const spanError = document.getElementById("error")


//Alternativa a função abaixo, loading.addEventListener("click", LoadStarships());

// Referenciadndo a função LoadStarships para trazer os dados ao carregar a pagina
window.onload = loadingStarships


// função para buscar naves e trazar o total em R$
function loadingStarships() {

    //fetch para trazer a primeira página de naves
    fetch("https://swapi.dev/api/starships/?format=json&page=1")
        .then(response => response.json())
        .then(starships => {
            var sum = 0
            // console.log("starships fetch-one ", starships)

            starships.results.forEach(elementStarships => {
                let cost = elementStarships.cost_in_credits
                if (cost == "unknown") {
                    cost = 0
                }
                // console.log("Custo da Nave: " + parseFloat(cost))

                //soma dos custos das naves
                sum += parseFloat(cost)
                // console.log("Soma da Nave1: " + soma)


            })
            //looping para percorrer as demais páginas das naves, inciando no contador 2
            var pag = Math.ceil(starships.count / 10)
            for (let i = 2; i <= pag; i++) {
                ////segundo fetch para trazer as demais paginas das naves
                // ESSE FOR FEITO PARA SE CASO A API RECEBA MAIS DADOS PERCORRER AS PAGINAS
                fetch("https://swapi.dev/api/starships/?format=json&page=" + i)
                    .then(response => response.json())
                    .then(starships => {
                        starships.results.forEach(elementStarships => {
                            let cost = elementStarships.cost_in_credits
                            if (cost == "unknown") {
                                cost = 0
                            }
                            // console.log("Custo da Nave: " + parseFloat(cost))
                            sum += parseFloat(cost)
                            // console.log("Soma da Nave 2: " + soma)

                        })
                    })
            }
            //console para conferir total
            //console.log("Soma da TOTAL GERAL: " + soma)

            // Mostrar valor no footer
            document.getElementById("totalStarships").innerText = `${sum.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`
        })
}

// função para limpar erros do campo inp-txt-search
function clearError() {
    spanError.style.display = "none"
}

function clearResults() {

    // variavel que seleciona o conteudo de resultados
    let result = document.getElementById("result")

    // aqui limpa para entrar novos registros
    result.innerHTML = ""
}

function submitForm(e) {

    //interromper comportamento padrao do form
    e.preventDefault()

    // Escopo das variáveis

    // variavel que vai trazer os dados digitados no input
    let inpTxtSearch = document.getElementById("inp-txt-search").value

    // variavel que seleciona a tag com id error no html
    let inpError = document.getElementById("error")

    //validação se o campo for vazio mostrar o erro senão executar a busca
    if (inpTxtSearch == "") {
        inpError.style.display = "block"
    } else {

        // enquanto está fazendo a busca mostra o loading
        loading.style.display = "block"


        // chamada para a funcão que limpa os resultados anteriores caso hajam buscas seguidas
        clearResults()


        // consulta de dados na API - Fetch principal
        fetch(`https://swapi.dev/api/people/?search=${inpTxtSearch}&format=json`)
            // segunda promisse
            .then(res => res.json())
            .then(result => {
                console.log(result)


                // Testando o retorno da buscar
                if (result.results.length > 0) {
                    result.results.forEach(element => {
                        insertElement(element)
                    });
                } else {
                    // Exibindo mensagem caso não retorne nada
                    spanError.style.display = "block"
                    spanError.innerText = "A busca atual não retornou nenhum resultado"

                    loading.style.display = "none"
                }
            })

    }
}

async function insertElement(element) {
    // Buscando planeta NATAL
    var planet = await searchPlanet(element.homeworld)
    var films = await searchFilm(element.films)

    // container principal para os resultados
    let result = document.getElementById("result")

    // Criar div
    const newElement = document.createElement("div");
    // Adicionar class card a div
    newElement.classList.add("card");

    // Substituir dados dentro da div
    newElement.innerHTML = `
        <div class="card-person">
            <span class="line-title-person"><b>Nome do Personagem:</b></span>
            <span><b>Nome:</b> ${element.name}</span>
            <span><b>Altura:</b> ${element.height === "unknown" ? "desconhecido" : `${element.height} cm`}</span>
            <span><b>Peso:</b> ${element.mass === "unknown" ? "desconhecido" : `${element.mass} Kg`}</span>
            <span><b>Planeta Natal:</b> ${planet}</span>
        </div>
        <div class="card-film">
            <span class="line-title-film"><b>Filmes:</b></span>
            <ul>
                ${films.map(film => {
        // looping para cada link que recebe de filmes retornar os nomes de cada filme
        return `<li>${film}</li>`
    }).join("")}
            </ul>
        </div>
    `;
    // Adiciona um card para cada pessoa que retonar da busca e coloca dentro de da div results
    result.append(newElement);
}

// recebe URL do card pessoas e retorna o planeta natal
async function searchPlanet(url) {

    // Pegando o planeta natal
    var homeWorld = ""
    await fetch(url)
        .then(res => res.json())
        .then(result => {
            if (result.name === "unknown") {
                homeworld = "desconhecido"
            } else {
                homeWorld = result.name
            }
        })

    //retorno da função
    return homeWorld
}

async function searchFilm(array) {
    // recebe um array com as  URL"s dos filmes dos cards pessoas
    var namesFilms = [];
    for (let item of array) {
        await fetch(item)
            .then(res => res.json())
            .then(result => {
                //Adicionar elemento na ultima posição do Array
                namesFilms.push(result.title)
            })
    }

    // esconde loading quando retona a busca
    loading.style.display = "none"

    //retorno da função
    return namesFilms
}
