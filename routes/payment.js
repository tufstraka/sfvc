import express from 'express';
import { initiateSTKPush } from '../controller/paymentController.js';

const router = express.Router();

router.post('/initiateSTKPush', initiateSTKPush);

export default router;