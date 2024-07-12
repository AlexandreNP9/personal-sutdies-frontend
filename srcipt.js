const URL = 'https://rms-project-yt.github.io/'; /*facilita a manutenção futura*/

const tbody = document.querySelector('.products-table__tbody');
const totalQuantity = document.querySelector('#total-quantity');
const totalPrice = document.querySelector('#total-price');

let quantity = 0;
let price = 0;

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

//Melhora o arredondamento do JavaScript
// para não apresentar dados errados.
function roundToNearest(value, precision) {
    const factor = Math.pow(10, precision);
    return Math.round(value * factor) / factor;
}

//Converte de casa flutuante para vírgula.
function convertToComma(value) {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
}

//Converte para casa flutuante para ponto.
function convertToPoint(value) {
    let string = value.replace('R$', '');

    return parseFloat(string.replace(',', '.'));
}

//Atualiza os valores totais.
function updateTotals() {
    totalQuantity.textContent = quantity;

    totalPrice.textContent = convertToComma(price);
}

//Função para adicionar produtos
function addProducts() {

    sendRequest('products/data.json', (data) => {

        data.products.forEach(product => {
            const tr = document.createElement('tr');
            tr.id = product.id;
            tr.classList.add("products-table__row");

            tr.innerHTML = `
                    <td class="products-table__cell">
                        <figure class="products-table__figure center">
                            <img class="figure__image" src="${product.image}" alt="${product.name}">
                        </figure>
                    </td>

                    <td class="products-table__cell">${product.name}</td>

                    <td class="products-table__cell unit_price">${convertToComma(product.unitPrice)}</td>

                    <td class="products-table__cell total_price">${convertToComma(product.unitPrice * product.quantity)}</td>

                    <td class="products-table__cell center">
                        <button class="products-table__button button--decrement">-</button>
                        <span class="products-table__quantity">${product.quantity}</span>
                        <button class="products-table__button button--increment">+</button>
                    </td>

                    <td class="products-table__cell">
                        <button class="products-table__button button--delete material-symbols-outlined">
                            delete
                        </button>
                    </td>
            `;

            tbody.appendChild(tr);

            quantity += parseInt(product.quantity);

            price += product.unitPrice * product.quantity;

            const increaseButton = tr.querySelector('.button--increment');
            increaseButton.addEventListener('click', increaseQuantity);

            const reduceButton = tr.querySelector('.button--decrement');
            reduceButton.addEventListener('click', reduceQuantity);

            const deleteButton = tr.querySelector('.button--delete');
            deleteButton.addEventListener('click', removeProduct);
        });

        updateTotals();
    });
};

//Função para reduzir a quantidade de produtos.
function reduceQuantity(event) {
    const tr = event.target.closest('tr');

    const quantitySpan = tr.querySelector('.products-table__quantity');

    if(quantitySpan.textContent == '1') {
        return;
    }

    const unitPrice = convertToPoint(
        tr.querySelector('.unit_price').textContent
    );

    const total = price - unitPrice;

    price = roundToNearest(total, 2);

    const totalPrice = tr.querySelector('.total_price');

    totalPrice.textContent = convertToComma(
        convertToPoint(totalPrice.textContent) - unitPrice
    );

    const newQuantity = parseInt(quantitySpan.textContent) - 1;

    quantitySpan.textContent = newQuantity;

    --quantity;

    updateTotals();
}

//Função para adicionar mais um do mesmo produto.
function increaseQuantity(event) {
    const tr = event.target.closest('tr');

    const quantitySpan = tr.querySelector('.products-table__quantity');

    const unitPrice = convertToPoint(
        tr.querySelector('.unit_price').textContent
    );

    const total = price + unitPrice;

    price = roundToNearest(total, 2);

    const totalPrice = tr.querySelector('.total_price');

    const value = convertToPoint(totalPrice.textContent) + unitPrice;

    totalPrice.textContent = convertToComma(value);

    const newQuantity = parseInt(quantitySpan.textContent) + 1;

    quantitySpan.textContent = newQuantity;

    ++quantity;

    updateTotals();
}

//Função para remover um produto.
function removeProduct(event) {
    const tr = event.target.closest('tr');

    quantity -= parseInt(tr.querySelector('.products-table__quantity').textContent);

    const totalProduct = convertToPoint(tr.querySelector('.total_price').textContent);

    const total = price - totalProduct;
    price = roundToNearest(total, 2);

    updateTotals();

    tbody.removeChild(tr);
}

//Funçã para finalizar a compra.
function sendProducts() {
    const tableRows = document.querySelectorAll('.products__table tr');
    const data = [];

    tableRows.forEach((tableRow, counter) => {
        if (counter === 0) return;

        const value = {};
        value.id = tableRow.id;
        value.quantity = tableRow.querySelector('.products-table__quantity').textContent;

        data.push(value);
    });

    const json = JSON.stringify(data);

    console.log(json);
}

const sendButton = document.querySelector('.send__button');
sendButton.addEventListener('click', sendProducts);

addProducts(); /*assim que abre a página, já é feita a chamada dessa função*/