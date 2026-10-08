import { Router } from 'express';
import type { Response, Request } from 'express';
import type { OrderQueue } from '../order-queue';
import  { Order } from '../order-queue';
import type { InMemoryDb } from '../db';

import { MenuItem } from '../models/MenuItem';

import { InvalidDataError, menuItemNotFoundError } from '../lib/util';

export function createOrdersRouter(orderQueue: OrderQueue, menuDb: InMemoryDb<MenuItem>): Router {
    const ordersRouter = Router();


    ordersRouter.get('/', (req: Request, res: Response) => {
        res.status(200).json(orderQueue.list());

    });
    
    ordersRouter.post('/serve', (req: Request, res: Response) => {
        const body = req.body;

        if (!body || Object.keys(body).length === 0) {
            return InvalidDataError(res, 'Invalid serve data', 'INVALID_SERVE_DATA');
        }

        const orderId = Number(body.orderId);
        if (isNaN(orderId)) {
            return InvalidDataError(res, 'Invalid orderId', 'INVALID_ORDER_ID');
        }

        try {
            orderQueue.serve(orderId);
            return res.status(200).json({ message: 'Order served successfully' });
        } catch (error) {
            return res.status(409).json({ error: { message: error instanceof Error ? error.message : String(error), code: 'ORDER_SERVE_FAILED' } });
        }
    });
    

    ordersRouter.post('/', (req: Request, res: Response) => {
    
        const body = req.body;

        if (!body || Object.keys(body).length === 0) {
            
            return InvalidDataError(res, 'Invalid order data', 'INVALID_ORDER_DATA');
        }

        const menuItemId = Number(body.menuItemId);
        if (isNaN(menuItemId)) {
            return InvalidDataError(res, 'Invalid menuItemId', 'INVALID_MENU_ITEM_ID');
        }

        const size = body.size as Order["size"]; //optional. so no checking


        const item = menuDb.get(menuItemId);

        if (!item) {
            return res.status(404).json(menuItemNotFoundError(menuItemId));
        }

        //I'm against this
        try {
            const order = orderQueue.add(item.name, item.price, size);
            return res.status(201).json(order);
        } catch (error) {
            return res.status(409).json({ error: { message: 'Order was rejected by the kitchen', code: 'ORDER_REJECTED' } });
        }
    

    });
    return ordersRouter;
}