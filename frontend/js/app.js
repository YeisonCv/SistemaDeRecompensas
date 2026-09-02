const API_BASE = '/rewards';

const elements = {
    searchForm: document.getElementById('search-form'),
    documentInput: document.getElementById('document-input'),
    searchBtn: document.getElementById('search-btn'),

    message: document.getElementById('message'),

    customerSection: document.getElementById('customer-section'),
    customerName: document.getElementById('customer-name'),
    customerDocument: document.getElementById('customer-document'),
    customerPoints: document.getElementById('customer-points'),

    purchaseForm: document.getElementById('purchase-form'),
    productInput: document.getElementById('product-input'),
    valueInput: document.getElementById('value-input'),
    purchaseBtn: document.getElementById('purchase-btn'),

    refreshBtn: document.getElementById('refresh-btn'),
    purchasesBody: document.getElementById('purchases-body'),

    redeemForm: document.getElementById('redeemForm'),
    redeemPointsInput: document.getElementById('redeemPoints'),
    redeemMessage: document.getElementById('redeemMessage'),

    redemptionList: document.getElementById('redemptionList')
};

let currentDocument = null;


// API request

async function apiRequest(url, options = {}) {

    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json'
        },
        ...options
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.error || 'Error en la solicitud'
        );
    }

    return data;
}


// Messages

function showMessage(text, type = 'error') {

    elements.message.textContent = text;

    elements.message.className =
        `message message--${type}`;

    elements.message.classList.remove('hidden');
}


function hideMessage() {

    elements.message.classList.add('hidden');
}


// Loading

function setLoading(button, isLoading) {

    button.disabled = isLoading;
}


// Currency

function formatCurrency(value) {

    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0
    }).format(value);
}


// Escape HTML

function escapeHtml(text) {

    const div = document.createElement('div');

    div.textContent = text;

    return div.innerHTML;
}


// Purchase history

function renderPurchases(purchases) {

    if (!purchases.length) {

        elements.purchasesBody.innerHTML = `
            <tr>
                <td colspan="4" class="empty">
                    Sin compras registradas
                </td>
            </tr>
        `;

        return;
    }

    elements.purchasesBody.innerHTML = purchases
        .slice()
        .reverse()
        .map(purchase => `
            <tr>
                <td>${purchase.id}</td>
                <td>${escapeHtml(purchase.product)}</td>
                <td>${formatCurrency(purchase.value)}</td>
                <td>${purchase.date}</td>
            </tr>
        `)
        .join('');
}


// Redemption history

function renderRedemptions(redemptions) {

    if (!redemptions.length) {

        elements.redemptionList.innerHTML = `
            <p>
                No hay canjes registrados.
            </p>
        `;

        return;
    }

    elements.redemptionList.innerHTML = redemptions
        .slice()
        .reverse()
        .map(redemption => `
            <div class="redemption-item">

                <strong>
                    Puntos canjeados:
                    ${redemption.points_redeemed}
                </strong>

                <span>
                    Valor:
                    ${formatCurrency(redemption.redeemed_value)}
                </span>

                <br>

                <span>
                    Fecha:
                    ${redemption.date}
                </span>

            </div>
        `)
        .join('');
}


// Load customer

async function loadCustomer(documentNumber) {

    const [
        customer,
        pointsData,
        purchases,
        redemptions
    ] = await Promise.all([

        apiRequest(
            `${API_BASE}/customer/${encodeURIComponent(documentNumber)}`
        ),

        apiRequest(
            `${API_BASE}/customer/${encodeURIComponent(documentNumber)}/points`
        ),

        apiRequest(
            `${API_BASE}/customer/${encodeURIComponent(documentNumber)}/purchases`
        ),

        apiRequest(
            `${API_BASE}/customer/${encodeURIComponent(documentNumber)}/redemptions`
        )

    ]);

    currentDocument = documentNumber;

    elements.customerName.textContent =
        customer.name;

    elements.customerDocument.textContent =
        customer.document;

    elements.customerPoints.textContent =
        pointsData.points.toLocaleString('es-CO');

    renderPurchases(purchases);

    renderRedemptions(redemptions);

    elements.customerSection.classList.remove('hidden');
}


// Search customer

async function handleSearch(event) {

    event.preventDefault();

    hideMessage();

    const documentNumber =
        elements.documentInput.value.trim();

    if (!documentNumber) {

        showMessage(
            'Ingresa un número de documento.'
        );

        return;
    }

    setLoading(
        elements.searchBtn,
        true
    );

    try {

        await loadCustomer(documentNumber);

        showMessage(
            'Cliente cargado correctamente.',
            'success'
        );

    } catch (error) {

        elements.customerSection.classList.add(
            'hidden'
        );

        currentDocument = null;

        showMessage(error.message);

    } finally {

        setLoading(
            elements.searchBtn,
            false
        );

    }
}


// Register purchase

async function handlePurchase(event) {

    event.preventDefault();

    hideMessage();

    if (!currentDocument) {

        showMessage(
            'Primero busca un cliente.'
        );

        return;
    }

    const product =
        elements.productInput.value.trim();

    const value =
        Number(elements.valueInput.value);

    if (!product) {

        showMessage(
            'Ingresa el nombre del producto.'
        );

        return;
    }

    if (!value || value <= 0) {

        showMessage(
            'Ingresa un valor válido mayor a 0.'
        );

        return;
    }

    setLoading(
        elements.purchaseBtn,
        true
    );

    try {

        const result = await apiRequest(

            `${API_BASE}/customer/${encodeURIComponent(currentDocument)}/purchases`,

            {
                method: 'POST',

                body: JSON.stringify({
                    product,
                    value
                })
            }

        );

        elements.customerPoints.textContent =
            result.totalPoints.toLocaleString('es-CO');

        elements.productInput.value = '';

        elements.valueInput.value = '';

        const purchases = await apiRequest(

            `${API_BASE}/customer/${encodeURIComponent(currentDocument)}/purchases`

        );

        renderPurchases(purchases);

        showMessage(
            `Compra registrada. Ganaste ${result.pointsEarned} puntos.`,
            'success'
        );

    } catch (error) {

        showMessage(error.message);

    } finally {

        setLoading(
            elements.purchaseBtn,
            false
        );

    }
}


// Redeem points

async function handleRedeem(event) {

    event.preventDefault();

    elements.redeemMessage.textContent = '';

    if (!currentDocument) {

        elements.redeemMessage.textContent =
            'Primero busca un cliente.';

        return;
    }

    const points =
        Number(elements.redeemPointsInput.value);

    try {

        const result = await apiRequest(

            `${API_BASE}/customer/${encodeURIComponent(currentDocument)}/redeem`,

            {
                method: 'POST',

                body: JSON.stringify({
                    points
                })
            }

        );

        elements.customerPoints.textContent =
            result.remainingPoints.toLocaleString('es-CO');

        elements.redeemMessage.textContent =
            `Canje realizado correctamente. Recibiste ${formatCurrency(result.valueRedeemed)}.`;

        elements.redeemPointsInput.value = '';

        const redemptions = await apiRequest(

            `${API_BASE}/customer/${encodeURIComponent(currentDocument)}/redemptions`

        );

        renderRedemptions(redemptions);

    } catch (error) {

        elements.redeemMessage.textContent =
            error.message;
    }
}

<<<<<<< HEAD

// Refresh

async function handleRefresh() {

    if (!currentDocument) {
        return;
    }

    hideMessage();

    setLoading(
        elements.refreshBtn,
        true
    );

    try {

        await loadCustomer(currentDocument);

        showMessage(
            'Historial actualizado.',
            'success'
        );

    } catch (error) {

        showMessage(error.message);

    } finally {

        setLoading(
            elements.refreshBtn,
            false
        );
    }
}


// Event listeners

elements.searchForm.addEventListener(
    'submit',
    handleSearch
);

elements.purchaseForm.addEventListener(
    'submit',
    handlePurchase
);

elements.redeemForm.addEventListener(
    'submit',
    handleRedeem
);

elements.refreshBtn.addEventListener(
    'click',
    handleRefresh
);
=======
elements.searchForm.addEventListener('submit', handleSearch);
elements.purchaseForm.addEventListener('submit', handlePurchase);
elements.refreshBtn.addEventListener('click', handleRefresh);
>>>>>>> d5091cfbb32ba292ae95bff815e8b5333a604bdb
