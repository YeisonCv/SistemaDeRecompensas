import { Router} from 'express';

import {
    getCustomercontroller,
    getPurchansesController,
    registerPurchanseController,
    getPointscontroller,
    redeemPointsController,
    getRedemptionsController
} from '../controller/rewardController';

const router = Router();

router.get(
    '/customer/:document',
    getCustomercontroller
);

router.get(
    '/customer/:document/points',
    getPointscontroller
);

router.get(
    '/customer/:document/purchases',
    getPurchansesController
);

router.get(
    '/customer/:document/redemptions',
    getRedemptionsController
);

router.post(
    '/customer/:document/purchases',
    registerPurchanseController
);

router.post(
    '/customer/:document/redeem',
    redeemPointsController
);


export default router;