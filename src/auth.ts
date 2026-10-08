import dotenv from 'dotenv';
import type { NextFunction, Request, Response } from 'express';

dotenv.config({ path: './.env' });


export function requireAuth(req: Request, res: Response, next: NextFunction) {

    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader !== `Bearer ${process.env.API_TOKEN}`) { 
        return res.status(401).json({error:{ message: (!authHeader ? 'Missing token' : 'Invalid token'), code: 'UNAUTHORIZED' }});
    }

    next();

}