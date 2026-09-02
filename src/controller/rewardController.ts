import { Request, Response } from 'express';

import {
    getCustomer,
    getPoints,
    registerPurchase,
    getPurchases,
    getRedemptions,
    redeemPoints
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
                : 'Error desconocido'
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
                : 'Error desconocido'
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
                : 'Error desconocido'
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

        console.log('PURCHASE DEBUG:', {
            product,
            value,
            type: typeof value
        });

        const purchase = await registerPurchase(
            document,
            product,
            value
        );

        res.status(200).json(purchase);
    } catch (error) {
        res.status(400).json({
            error: error instanceof Error
                ? error.message
                : 'Error desconocido'
        });
    }
}


async function redeemPointsController(
    req: Request,
    res: Response
): Promise<void> {

    try {

        const document = req.params.document as string;

        const { points } = req.body;

        const redeemed = await redeemPoints(
            document,
            points
        );

        res.status(200).json(redeemed);

    } catch (error) {

        res.status(400).json({
            error: error instanceof Error
                ? error.message
                : 'Error desconocido'
        });

    }
}


async function getRedemptionsController(
    req: Request,
    res: Response
): Promise<void> {

    try {

        const document = req.params.document as string;

        const redemptions = await getRedemptions(document);

        res.status(200).json(redemptions);

    } catch (error) {

        res.status(400).json({
            error: error instanceof Error
                ? error.message
                : 'Error desconocido'
        });

    }
}


export {
    getCustomercontroller,
    getPurchansesController,
    registerPurchanseController,
    getPointscontroller,
    redeemPointsController,
    getRedemptionsController
};