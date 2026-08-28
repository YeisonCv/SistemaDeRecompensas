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
const redemptionHistorySection = document.getElementById(
    'redemptionHistorySection'
);

const redemptionList = document.getElementById('redemptionList');

const redeemSection = document.getElementById('redeemSection');

const redeemForm = document.getElementById('redeemForm');

const redeemPointsInput = document.getElementById('redeemPoints');

const redeemMessage = document.getElementById('redeemMessage');

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
        await loadRedemptions(documentNumber);

        searchMessage.textContent = '';

    } catch (error) {

        customerSection.style.display = 'none';
        purchaseSection.style.display = 'none';
        historySection.style.display = 'none';
        redeemSection.style.display = 'none';
        redemptionHistorySection.style.display = 'none';

        searchMessage.textContent = error.message;

    }
}

//Mostrar el cliente 
function displayCustomer(customer) {

    customerSection.style.display = 'block';
    purchaseSection.style.display = 'block';
    historySection.style.display = 'block';
    redeemSection.style.display = 'block';
    redemptionHistorySection.style.display = 'block';

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

async function loadRedemptions(documentNumber) {
    const response = await fetch(
        `${API_URL}/rewards/customer/${documentNumber}/redemptions`
    );

    if (!response.ok) {
        throw new Error('Could not load redemptions');
    }

    const redemptions = await response.json();

    displayRedemptions(redemptions);
}

//mostrar redenciones
function displayRedemptions(redemptions) {

    redemptionList.innerHTML = '';

    if (redemptions.length === 0) {

        redemptionList.innerHTML =
            '<p>No redemptions registered.</p>';

        return;
    }

    redemptions.forEach(redemption => {

        const item = document.createElement('div');

        item.classList.add('redemption-item');

        item.innerHTML = `
            <strong>Points Redeemed: ${redemption.points_used}</strong>
            <span>Value: $${redemption.redeemed_value}</span>
            <br>
            <span>Date: ${redemption.date}</span>
        `;

        redemptionList.appendChild(item);

    });
}

function displayRedemptions(redemptions) {
    redemptionList.innerHTML = '';

    if (redemptions.length === 0) {
        redemptionList.innerHTML =
            '<p>No redemptions registered.</p>';
        return;
    }

    redemptions.forEach(redemption => {
        const item = document.createElement('div');

        item.classList.add('redemption-item');

        item.innerHTML = `
            <strong>Points redeemed: ${redemption.points_used}</strong>

            <span>
                Value: $${redemption.redeemed_value}
            </span>

            <br>

            <span>
                Date: ${redemption.date}
            </span>
        `;

        redemptionList.appendChild(item);
    });
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

// Redeem points

redeemForm.addEventListener(
    'submit',
    redeemCustomerPoints
);

async function redeemCustomerPoints(event) {
    event.preventDefault();

    const documentNumber = documentInput.value.trim();

    const points = Number(
        redeemPointsInput.value
    );

    if (!documentNumber) {
        redeemMessage.textContent =
            'Please search for a customer first.';
        return;
    }

    try {
        const response = await fetch(
            `${API_URL}/rewards/customer/${documentNumber}/redeem`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    points
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error || 'Could not redeem points'
            );
        }

        redeemMessage.textContent =
            `Points redeemed successfully! You received $${data.valueRedeemed}.`;

        customerPoints.textContent =
            data.remainingPoints;

        redeemForm.reset();

        await loadRedemptions(documentNumber);

    } catch (error) {
        redeemMessage.textContent =
            error.message;
    }
}
