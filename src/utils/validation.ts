function validateDocument(document: unknown): string {
    if (typeof document !== 'string' || document.trim() === '') {
        throw new Error('El documento es obligatorio');
    }

    return document.trim();
}

function validatePurchaseData(
    product: unknown,
    value: unknown
): { product: string; value: number } {
    if (typeof product !== 'string' || product.trim() === '') {
        throw new Error('El producto es obligatorio');
    }

    if (value === undefined || value === null || value === '') {
        throw new Error('El valor es obligatorio');
    }

    const numericValue = Number(value);

    if (!Number.isFinite(numericValue)) {
        throw new Error('El valor debe ser un número válido');
    }

    if (numericValue <= 0) {
        throw new Error('El valor debe ser mayor a 0');
    }

    return {
        product: product.trim(),
        value: numericValue
    };
}

export {
    validateDocument,
    validatePurchaseData
};
