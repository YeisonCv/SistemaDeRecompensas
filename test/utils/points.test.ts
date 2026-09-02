import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
    calculatePoints,
    calculateRedeemedPoints,
    validateRedemption
} from '../../src/utils/points';

describe('calculatePoints', () => {
    it('asigna 0 puntos si el monto es menor a 1000, sin lanzar error', () => {
        assert.doesNotThrow(() => calculatePoints(999));
        assert.equal(calculatePoints(0), 0);
        assert.equal(calculatePoints(1), 0);
        assert.equal(calculatePoints(500), 0);
        assert.equal(calculatePoints(999), 0);
        assert.equal(calculatePoints(999.99), 0);
    });

    it('asigna 1 punto por cada 1000 pesos', () => {
        assert.equal(calculatePoints(1000), 1);
        assert.equal(calculatePoints(1000.99), 1);
        assert.equal(calculatePoints(1500), 1);
        assert.equal(calculatePoints(1999), 1);
        assert.equal(calculatePoints(2000), 2);
        assert.equal(calculatePoints(2500), 2);
        assert.equal(calculatePoints(3000), 3);
    });
});

describe('validateRedemption y calculateRedeemedPoints', () => {
    it('lanza error al redimir 0 puntos', () => {
        assert.throws(
            () => validateRedemption(0, 100),
            { message: 'No se pueden redimir 0 puntos' }
        );
        assert.throws(
            () => calculateRedeemedPoints(0, 100),
            { message: 'No se pueden redimir 0 puntos' }
        );
    });

    it('lanza error si la cantidad es mayor al saldo actual', () => {
        assert.throws(
            () => validateRedemption(101, 100),
            { message: 'No hay puntos suficientes para redimir' }
        );
        assert.throws(
            () => calculateRedeemedPoints(50, 20),
            { message: 'No hay puntos suficientes para redimir' }
        );
    });

    it('lanza error si los puntos no son enteros o son decimales', () => {
        assert.throws(
            () => validateRedemption(10.5, 100),
            { message: 'Los puntos a redimir deben ser un número entero' }
        );
        assert.throws(
            () => calculateRedeemedPoints(3.2, 50),
            { message: 'Los puntos a redimir deben ser un número entero' }
        );
        assert.throws(
            () => validateRedemption(NaN, 100),
            { message: 'Los puntos a redimir deben ser un número entero' }
        );
    });

    it('redime correctamente una cantidad entera dentro del saldo', () => {
        assert.doesNotThrow(() => validateRedemption(10, 100));
        assert.doesNotThrow(() => validateRedemption(100, 100));
        assert.equal(calculateRedeemedPoints(10, 100), 1000);
        assert.equal(calculateRedeemedPoints(1, 1), 100);
        assert.equal(calculateRedeemedPoints(5, 5), 500);
    });
});
