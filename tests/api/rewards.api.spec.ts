import { test, expect } from '@playwright/test';
import { resetDatabase } from '../helpers/reset-database';

const VALID_DOCUMENT = '1234567890';
const UNKNOWN_DOCUMENT = '0000000000';

test.describe('API — Sistema de Recompensas', () => {
    test.beforeEach(async () => {
        await resetDatabase();
    });

    test('GET /rewards/customer/:document — obtiene un cliente existente', async ({ request }) => {
        const response = await request.get(`/rewards/customer/${VALID_DOCUMENT}`);

        // Validamos que la API responda con código 200 (éxito)
        expect(response.status()).toBe(200);

        const body = await response.json();

        // Validamos que el documento coincida con el solicitado
        expect(body.document).toBe(VALID_DOCUMENT);

        // Validamos que el nombre del cliente sea el esperado según database.json
        expect(body.name).toBe('João Silva');

        // Validamos que los puntos iniciales sean los del archivo de prueba (100)
        expect(body.points).toBe(100);
    });

    test('GET /rewards/customer/:document — error si el cliente no existe', async ({ request }) => {
        const response = await request.get(`/rewards/customer/${UNKNOWN_DOCUMENT}`);

        // Validamos que la API responda con código 400 (error del cliente)
        expect(response.status()).toBe(400);

        const body = await response.json();

        // Validamos que el mensaje de error sea el definido en el backend
        expect(body.error).toBe('Cliente no encontrado');
    });

    test('GET /rewards/customer/:document/points — devuelve los puntos del cliente', async ({ request }) => {
        const response = await request.get(`/rewards/customer/${VALID_DOCUMENT}/points`);

        // Validamos que la petición sea exitosa
        expect(response.status()).toBe(200);

        const body = await response.json();

        // Validamos que incluya el documento consultado
        expect(body.document).toBe(VALID_DOCUMENT);

        // Validamos que incluya el nombre del cliente
        expect(body.name).toBe('João Silva');

        // Validamos que los puntos sean un número mayor o igual a cero
        expect(body.points).toBeGreaterThanOrEqual(0);
    });

    test('GET /rewards/customer/:document/points — error si el cliente no existe', async ({ request }) => {
        const response = await request.get(`/rewards/customer/${UNKNOWN_DOCUMENT}/points`);

        // Validamos código de error cuando el documento no está registrado
        expect(response.status()).toBe(400);

        const body = await response.json();

        // Validamos el mensaje de error retornado por la API
        expect(body.error).toBe('Cliente no encontrado');
    });

    test('GET /rewards/customer/:document/purchases — devuelve el historial de compras', async ({ request }) => {
        const response = await request.get(`/rewards/customer/${VALID_DOCUMENT}/purchases`);

        // Validamos respuesta exitosa
        expect(response.status()).toBe(200);

        const body = await response.json();

        // Validamos que la respuesta sea un arreglo
        expect(Array.isArray(body)).toBe(true);

        // Validamos que haya al menos una compra en el historial inicial
        expect(body.length).toBeGreaterThan(0);

        // Validamos que la primera compra tenga el producto esperado
        expect(body[0].product).toBe('Notebook');

        // Validamos que la compra pertenezca al cliente con id 1
        expect(body[0].customer_id).toBe(1);
    });

    test('GET /rewards/customer/:document/purchases — error si el cliente no existe', async ({ request }) => {
        const response = await request.get(`/rewards/customer/${UNKNOWN_DOCUMENT}/purchases`);

        // Validamos que retorne error 400 para documento inexistente
        expect(response.status()).toBe(400);

        const body = await response.json();

        // Validamos el mensaje de error
        expect(body.error).toBe('Cliente no encontrado');
    });

    test('POST /rewards/customer/:document/purchases — registra una compra y suma puntos', async ({ request }) => {
        const response = await request.post(`/rewards/customer/${VALID_DOCUMENT}/purchases`, {
            data: {
                product: 'Teclado',
                value: 350,
            },
        });

        // Validamos que la compra se registró correctamente
        expect(response.status()).toBe(200);

        const body = await response.json();

        // Validamos puntos ganados: 1 punto por cada $1.000 → floor(3500/1000) = 3
        expect(body.pointsEarned).toBe(3);

        // Validamos puntos totales: 100 iniciales + 3 ganados = 103
        expect(body.totalPoints).toBe(103);

        // Validamos que la compra tenga el producto enviado
        expect(body.purchase.product).toBe('Teclado');

        // Validamos que el valor de la compra sea el enviado
        expect(body.purchase.value).toBe(350);

        // Validamos que la fecha tenga formato YYYY-MM-DD
        expect(body.purchase.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);

        const purchasesResponse = await request.get(`/rewards/customer/${VALID_DOCUMENT}/purchases`);
        const purchases = await purchasesResponse.json();

        // Validamos que el historial ahora tenga 2 compras (1 inicial + 1 nueva)
        expect(purchases).toHaveLength(2);

        // Validamos que la compra recién creada aparezca en el historial
        expect(purchases.some((p: { product: string }) => p.product === 'Teclado')).toBe(true);
    });

    test('POST /rewards/customer/:document/purchases — error si el cliente no existe', async ({ request }) => {
        const response = await request.post(`/rewards/customer/${UNKNOWN_DOCUMENT}/purchases`, {
            data: {
                product: 'Mouse',
                value: 100,
            },
        });

        // Validamos que no permita registrar compra a un cliente inexistente
        expect(response.status()).toBe(400);

        const body = await response.json();

        // Validamos el mensaje de error correspondiente
        expect(body.error).toBe('Cliente no encontrado');
    });
});
