const URL = 'https://rms-project-yt.github.io/'; /*facilita a manutenção futura*/

//Função de requisição
async function sendRequest(path, response) { /*função criada aqui para poder reutilizar em outras solicitações*/
    try {
        const values = await fetch(`${URL}${path}`); /*utiliza a constante URL e o parametri path*/ /*a função await indica que as próximas instruções só serão executadas após o fetch ser completado*/

        if (!values.ok) { /*tratamento de erro do fetch*/
            throw new Error('Erro na solicitação da API');
        }

        const data = await values.json();

        response(data); /*a responsta da função é a constante data*/

    } catch (error) { /*se der algum erro na solicitação*/
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

addProducts(); /*assim que abre a página, já é feita a chamada dessa função*/