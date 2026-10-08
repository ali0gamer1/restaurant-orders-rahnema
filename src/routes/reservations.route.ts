import type { Request, Response } from 'express';
import express from 'express';
import type { ErrorFormat } from '../lib/errorFormat';


export function createReservationsRouter() {

    const router = express.Router();


    //Repeat for now...
    router.get('/', (req: Request, res: Response) => {

        const error: ErrorFormat = {error: {
            message: `Route ${req.method} ${req.originalUrl} is not implemented yet`,
            code: "NOT_IMPLEMENTED"
        }};

        return res.status(501).json(error);

    });

    router.post('/', (req: Request, res: Response) => {

        const error: ErrorFormat = {error: {
            message: `Route ${req.method} ${req.originalUrl} is not implemented yet`,
            code: "NOT_IMPLEMENTED"
        }};

        return res.status(501).json(error);

    });
    return router;
}


