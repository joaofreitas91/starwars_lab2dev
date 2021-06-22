function submitForm(e) {
    e.preventDefault()

    let loading = document.getElementById("loading")
    let curiosity = document.getElementById("curiosity")
    loading.style.display = "block"
    curiosity.style.display = "none"

    let inpTxtSearch = document.getElementById("inp-txt-search").value
    limpar()

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


function inserirElemento(element) {
    // container principal para os resultados
    let resultado = document.getElementById("result")
    const newElement = document.createElement('div');
    newElement.classList.add('card');
    newElement.innerHTML = `
        <div class="card-person">
            <span><b>Nome Completo:</b> ${element.name}</span>
            <span><b>Altura:</b> ${element.height} cm</span>
            <span><b>Peso:</b> ${element.mass} Kg</span>
            <span><b>Planeta Natal:</b> Tatooine</span>
        </div>
        <div class="line"></div>
        <div class="card-person">
            <span><b>Filmes:</b></span>
            <span>A New Hope</span>
            <span>The Empire Strikes Back</span>
            <span>Return Of The Jedi</span>
            <span>Revenge of The Sith</span>
        </div>
    `;
    resultado.append(newElement);

}
