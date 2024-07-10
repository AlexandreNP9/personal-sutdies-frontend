const URL = 'https://rms-project-yt.github.io/';

//Função de requisição
async function sendRequest(path, response) {
    try {
        const values = await fetch(`${URL}${path}`);

        if (!values.ok) {
            throw new Error('Erro na solicitação da API');
        }

        const data = await values.json();

        response(data);

    } catch (error) {
        console.log(error);
        alert(`${error}\nNão foi possível obter os dados.`)
    }
}

//Função para adicionar produtos
function addProducts() {
    sendRequest('products/data.json', (data) => {
        console.log(data.products);
    });
}

addProducts();