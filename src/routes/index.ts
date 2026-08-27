import { Router } from 'express';
import rewardRoutes from './rewardRoutes';

const router = Router();

router.use('/rewards', rewardRoutes);

export default router;