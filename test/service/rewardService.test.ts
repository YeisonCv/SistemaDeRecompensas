import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { findCustomerByDocument } from '../../src/service/rewardService';
import { Customer } from '../../src/config/database';

const customers: Customer[] = [
    {
        id: 1,
        document: '1234567890',
        name: 'João Silva',
        points: 10
    }
];

describe('findCustomerByDocument', () => {
    it('devuelve el cliente cuando el documento existe', () => {
        const customer = findCustomerByDocument(customers, '1234567890');

        assert.equal(customer.document, '1234567890');
        assert.equal(customer.name, 'João Silva');
    });

    it('lanza error si el documento no existe', () => {
        assert.throws(
            () => findCustomerByDocument(customers, '0000000000'),
            { message: 'Cliente no encontrado' }
        );
    });
});
