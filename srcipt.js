//Função para aricionar produtos
function addProducts() {
    fetch('https://rms-project-yt.github.io/products/data.json') /*a API fetch é nativa do javascript. Sua função é buscar e enviar dados para ums ervidor web. Responde uma promise, obtida pelo método .then*/
        .then(response => response.json()) /*transofrma a promise em um JSON*/
        .then(data => { /*imprime as linhas do JSON*/
            console.log(data.products);
        })
        .catch(error => { /*se tiver algum erro, vai mostrar no terminal*/
            console.log(error);
        })
}