import { test, expect } from '@playwright/test';
import { resetDatabase } from '../helpers/reset-database';

const VALID_DOCUMENT = '1234567890';

test.describe('Frontend — Sistema de Recompensas', () => {
    test.beforeEach(async () => {
        await resetDatabase();
    });

    test('carga la página principal correctamente', async ({ page }) => {
        await page.goto('/');

        // Validamos que el título de la pestaña sea el correcto
        await expect(page).toHaveTitle(/Sistema de Recompensas/);

        // Validamos que el formulario de búsqueda esté visible
        await expect(page.getByRole('heading', { name: 'Buscar cliente' })).toBeVisible();

        // Validamos que el campo de documento esté disponible
        await expect(page.getByLabel('Documento')).toBeVisible();
    });

    test('busca un cliente y muestra sus datos', async ({ page }) => {
        await page.goto('/');

        await page.getByLabel('Documento').fill(VALID_DOCUMENT);
        await page.getByRole('button', { name: 'Buscar' }).click();

        // Validamos que se muestre el nombre del cliente
        await expect(page.getByRole('heading', { name: 'João Silva' })).toBeVisible();

        // Validamos que los puntos iniciales sean 100 (dato del seed de prueba)
        await expect(page.locator('#customer-points')).toHaveText('100');

        // Validamos que aparezca una compra previa en la tabla
        await expect(page.getByRole('cell', { name: 'Notebook' })).toBeVisible();
    });

    test('muestra error cuando el documento no existe', async ({ page }) => {
        await page.goto('/');

        await page.getByLabel('Documento').fill('0000000000');
        await page.getByRole('button', { name: 'Buscar' }).click();

        // Validamos que se muestre el mensaje de error de la API
        await expect(page.locator('#message')).toContainText('Cliente no encontrado');

        // Validamos que la sección del cliente permanezca oculta
        await expect(page.locator('#customer-section')).toBeHidden();
    });

    test('registra una compra y actualiza los puntos en pantalla', async ({ page }) => {
        await page.goto('/');

        await page.getByLabel('Documento').fill(VALID_DOCUMENT);
        await page.getByRole('button', { name: 'Buscar' }).click();

        // Validamos puntos antes de registrar la compra
        await expect(page.locator('#customer-points')).toHaveText('100');

        await page.getByLabel('Producto').fill('Auriculares');
        await page.getByLabel('Valor ($)').fill('200');
        await page.getByRole('button', { name: 'Registrar compra' }).click();

        // Validamos mensaje de éxito con los puntos ganados (200/10 = 20)
        await expect(page.locator('#message')).toContainText('Ganaste 20 puntos');

        // Validamos que los puntos se actualicen en pantalla (100 + 20 = 120)
        await expect(page.locator('#customer-points')).toHaveText('120');

        // Validamos que la nueva compra aparezca en la tabla
        await expect(page.getByRole('cell', { name: 'Auriculares' })).toBeVisible();
    });
});
