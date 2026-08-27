import { Router} from 'express';

import {
    getCustomercontroller,
    getPurchansesController,
    registerPurchanseController,
    getPointscontroller
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

router.post(
    '/customer/:document/purchases',
    registerPurchanseController
);

export default router;