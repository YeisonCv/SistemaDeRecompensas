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
};

let currentDocument = null;

async function apiRequest(url, options = {}) {
    const response = await fetch(url, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Error en la solicitud');
    }

    return data;
}

function showMessage(text, type = 'error') {
    elements.message.textContent = text;
    elements.message.className = `message message--${type}`;
    elements.message.classList.remove('hidden');
}

function hideMessage() {
    elements.message.classList.add('hidden');
}

function setLoading(button, isLoading) {
    button.disabled = isLoading;
}

function formatCurrency(value) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0,
    }).format(value);
}

function renderPurchases(purchases) {
    if (!purchases.length) {
        elements.purchasesBody.innerHTML = `
            <tr>
                <td colspan="4" class="empty">Sin compras registradas</td>
            </tr>
        `;
        return;
    }

    elements.purchasesBody.innerHTML = purchases
        .slice()
        .reverse()
        .map((purchase) => `
            <tr>
                <td>${purchase.id}</td>
                <td>${escapeHtml(purchase.product)}</td>
                <td>${formatCurrency(purchase.value)}</td>
                <td>${purchase.date}</td>
            </tr>
        `)
        .join('');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

async function loadCustomer(document) {
    const [customer, pointsData, purchases] = await Promise.all([
        apiRequest(`${API_BASE}/customer/${encodeURIComponent(document)}`),
        apiRequest(`${API_BASE}/customer/${encodeURIComponent(document)}/points`),
        apiRequest(`${API_BASE}/customer/${encodeURIComponent(document)}/purchases`),
    ]);

    currentDocument = document;

    elements.customerName.textContent = customer.name;
    elements.customerDocument.textContent = customer.document;
    elements.customerPoints.textContent = pointsData.points.toLocaleString('es-CO');

    renderPurchases(purchases);
    elements.customerSection.classList.remove('hidden');
}

async function handleSearch(event) {
    event.preventDefault();
    hideMessage();

    const document = elements.documentInput.value.trim();

    if (!document) {
        showMessage('Ingresa un número de documento.');
        return;
    }

    setLoading(elements.searchBtn, true);

    try {
        await loadCustomer(document);
        showMessage('Cliente cargado correctamente.', 'success');
    } catch (error) {
        elements.customerSection.classList.add('hidden');
        currentDocument = null;
        showMessage(error.message);
    } finally {
        setLoading(elements.searchBtn, false);
    }
}

async function handlePurchase(event) {
    event.preventDefault();
    hideMessage();

    if (!currentDocument) {
        showMessage('Primero busca un cliente.');
        return;
    }

    const product = elements.productInput.value.trim();
    const value = Number(elements.valueInput.value);

    if (!product) {
        showMessage('Ingresa el nombre del producto.');
        return;
    }

    if (!value || value <= 0) {
        showMessage('Ingresa un valor válido mayor a 0.');
        return;
    }

    setLoading(elements.purchaseBtn, true);

    try {
        const result = await apiRequest(
            `${API_BASE}/customer/${encodeURIComponent(currentDocument)}/purchases`,
            {
                method: 'POST',
                body: JSON.stringify({ product, value }),
            }
        );

        elements.customerPoints.textContent = result.totalPoints.toLocaleString('es-CO');
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
        setLoading(elements.purchaseBtn, false);
    }
}

async function handleRefresh() {
    if (!currentDocument) return;

    hideMessage();
    setLoading(elements.refreshBtn, true);

    try {
        await loadCustomer(currentDocument);
        showMessage('Historial actualizado.', 'success');
    } catch (error) {
        showMessage(error.message);
    } finally {
        setLoading(elements.refreshBtn, false);
    }
}

elements.searchForm.addEventListener('submit', handleSearch);
elements.purchaseForm.addEventListener('submit', handlePurchase);
elements.refreshBtn.addEventListener('click', handleRefresh);
//prueba
