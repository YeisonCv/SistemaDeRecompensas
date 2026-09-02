import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
    validateDocument,
    validatePurchaseData
} from '../../src/utils/validation';

import { calculatePoints } from '../../src/utils/points';

describe('validateDocument', () => {
    it('acepta un documento válido', () => {
        assert.equal(validateDocument('1234567890'), '1234567890');
    });

    it('lanza error si el documento está vacío', () => {
        assert.throws(
            () => validateDocument(''),
            { message: 'El documento es obligatorio' }
        );
        assert.throws(
            () => validateDocument('   '),
            { message: 'El documento es obligatorio' }
        );
    });
});

describe('validatePurchaseData — campos obligatorios', () => {
    it('lanza error si el producto está vacío', () => {
        assert.throws(
            () => validatePurchaseData('', 1500),
            { message: 'El producto es obligatorio' }
        );
        assert.throws(
            () => validatePurchaseData('   ', 1500),
            { message: 'El producto es obligatorio' }
        );
    });

    it('lanza error si el valor está vacío', () => {
        assert.throws(
            () => validatePurchaseData('Teclado', ''),
            { message: 'El valor es obligatorio' }
        );
        assert.throws(
            () => validatePurchaseData('Teclado', undefined),
            { message: 'El valor es obligatorio' }
        );
        assert.throws(
            () => validatePurchaseData('Teclado', null),
            { message: 'El valor es obligatorio' }
        );
    });
});

describe('validatePurchaseData — valores no numéricos', () => {
    it('lanza error si el valor no es un número', () => {
        assert.throws(
            () => validatePurchaseData('Teclado', 'abc'),
            { message: 'El valor debe ser un número válido' }
        );
        assert.throws(
            () => validatePurchaseData('Teclado', 'mil'),
            { message: 'El valor debe ser un número válido' }
        );
        assert.throws(
            () => validatePurchaseData('Teclado', Infinity),
            { message: 'El valor debe ser un número válido' }
        );
    });
});

describe('validatePurchaseData — rangos permitidos', () => {
    it('lanza error si el valor es menor o igual a 0', () => {
        assert.throws(
            () => validatePurchaseData('Teclado', 0),
            { message: 'El valor debe ser mayor a 0' }
        );
        assert.throws(
            () => validatePurchaseData('Teclado', -100),
            { message: 'El valor debe ser mayor a 0' }
        );
    });

    it('acepta montos menores a 1000 porque sí están en el rango permitido', () => {
        const result = validatePurchaseData('Cable', 500);
        assert.equal(result.value, 500);
        assert.equal(calculatePoints(result.value), 0);
    });
});

describe('validatePurchaseData — caso exitoso', () => {
    it('procesa una compra válida y calcula los puntos', () => {
        const result = validatePurchaseData('Teclado', 1500);

        assert.equal(result.product, 'Teclado');
        assert.equal(result.value, 1500);
        assert.equal(calculatePoints(result.value), 1);
    });

    it('acepta el valor numérico enviado como texto', () => {
        const result = validatePurchaseData('Monitor', '2000');

        assert.equal(result.product, 'Monitor');
        assert.equal(result.value, 2000);
        assert.equal(calculatePoints(result.value), 2);
    });
});
