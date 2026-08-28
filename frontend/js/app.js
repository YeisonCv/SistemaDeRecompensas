const API_URL = '';

//Obtener los elementos html
const documentInput = document.getElementById('documentInput');
const searchButton = document.getElementById('searchButton');

const customerSection = document.getElementById('customerSection');
const purchaseSection = document.getElementById('purchaseSection');
const historySection = document.getElementById('historySection');

const customerName = document.getElementById('customerName');
const customerDocument = document.getElementById('customerDocument');
const customerPoints = document.getElementById('customerPoints');

const searchMessage = document.getElementById('searchMessage');

const purchaseForm = document.getElementById('purchaseForm');
const purchaseMessage = document.getElementById('purchaseMessage');

const purchaseList = document.getElementById('purchaseList');

// Buscar cliente por documento
searchButton.addEventListener('click', searchCustomer);

async function searchCustomer() {

    const documentNumber = documentInput.value.trim();

    if (!documentNumber) {
        searchMessage.textContent = 'Please enter your document.';
        return;
    }

    try {

        searchMessage.textContent = 'Searching...';

        const response = await fetch(
            `${API_URL}/rewards/customer/${documentNumber}`
        );

        if (!response.ok) {

            throw new Error('Customer not found');

        }

        const customer = await response.json();

        displayCustomer(customer);

        await loadPoints(documentNumber);

        await loadPurchases(documentNumber);

        searchMessage.textContent = '';

    } catch (error) {

        customerSection.style.display = 'none';
        purchaseSection.style.display = 'none';
        historySection.style.display = 'none';

        searchMessage.textContent = error.message;

    }
}

//Mostrar el cliente 
function displayCustomer(customer) {

    customerSection.style.display = 'block';
    purchaseSection.style.display = 'block';
    historySection.style.display = 'block';

    customerName.textContent = customer.name;
    customerDocument.textContent = customer.document;
    customerPoints.textContent = customer.points;
}

//obtener puntos 
async function loadPoints(documentNumber) {

    const response = await fetch(
        `${API_URL}/rewards/customer/${documentNumber}/points`
    );

    if (!response.ok) {
        throw new Error('Could not load points');
    }

    const data = await response.json();

    customerPoints.textContent = data.points;
}

//obtener compras
async function loadPurchases(documentNumber) {

    const response = await fetch(
        `${API_URL}/rewards/customer/${documentNumber}/purchases`
    );

    if (!response.ok) {
        throw new Error('Could not load purchases');
    }

    const purchases = await response.json();

    displayPurchases(purchases);
}

//mostrar compras
function displayPurchases(purchases) {

    purchaseList.innerHTML = '';

    if (purchases.length === 0) {

        purchaseList.innerHTML =
            '<p>No purchases registered.</p>';

        return;
    }

    purchases.forEach(purchase => {

        const item = document.createElement('div');

        item.classList.add('purchase-item');

        item.innerHTML = `
            <strong>${purchase.product}</strong>
            <span>Value: $${purchase.value}</span>
            <br>
            <span>Date: ${purchase.date}</span>
        `;

        purchaseList.appendChild(item);

    });
}

//registrar compra
purchaseForm.addEventListener(
    'submit',
    registerPurchase
);
async function registerPurchase(event) {

    event.preventDefault();

    const documentNumber = documentInput.value.trim();

    const product = document
        .getElementById('product')
        .value
        .trim();

    const value = Number(
        document.getElementById('value').value
    );

    if (!documentNumber) {
        purchaseMessage.textContent =
            'Please search for a customer first.';
        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/rewards/customer/${documentNumber}/purchases`,
            {
                method: 'POST',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({
                    product,
                    value
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error || 'Could not register purchase'
            );
        }

        purchaseMessage.textContent =
            `Purchase registered! You earned ${data.pointsEarned} point(s).`;

        customerPoints.textContent =
            data.totalPoints;

        purchaseForm.reset();

        await loadPurchases(documentNumber);

    } catch (error) {

        purchaseMessage.textContent =
            error.message;

    }
}
