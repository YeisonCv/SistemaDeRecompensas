import { Request, Response } from 'express';

import {
    getCustomer,
    getPoints,
    registerPurchase,
    getPurchases
} from '../service/rewardService';

async function getCustomercontroller(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const document = req.params.document as string;

        const customer = await getCustomer(document);

        res.status(200).json(customer);
    } catch (error) {
        res.status(400).json({ 
            error: error instanceof Error 
            ? error.message 
            : 'Unknown error'
        });
    }
}

async function getPointscontroller(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const document = req.params.document as string;
        const points = await getPoints(document);

        res.status(200).json(points);
    } catch (error) {
        res.status(400).json({
            error: error instanceof Error
            ? error.message
            : 'Unknown error'
        });
    }
}

async function getPurchansesController(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const document = req.params.document as string;

        const purchases = await getPurchases(document);

        res.status(200).json(purchases);
    } catch (error) {
        res.status(400).json({ 
            error: error instanceof Error 
            ? error.message 
            : 'Unknown error'
        });
    }
}

async function registerPurchanseController(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const document = req.params.document as string;
        const { product, value } = req.body;

        const purchase = await registerPurchase(
            document,
            product,
            Number(value)
        );
    res.status(200).json(purchase);
    } catch (error) {
        res.status(400).json({ 
            error: error instanceof Error 
            ? error.message 
            : 'Unknown error'
        });
    }
}

export {
    getCustomercontroller,
    getPurchansesController,
    registerPurchanseController,
    getPointscontroller
};