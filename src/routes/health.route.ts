import type { Request, Response } from 'express';
import express from 'express';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
    return res.status(200).json({ status: 'ok' });
});

export default router;