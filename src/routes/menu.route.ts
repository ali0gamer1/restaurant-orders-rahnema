import type { Request, Response } from 'express';
import express from 'express';
import * as Util from '../lib/util';
import type { MenuItem } from '../models/MenuItem'; 
import type { InMemoryDb } from '../db';        



export function createMenuRouter(MenuDb: InMemoryDb<MenuItem>) {
    const router = express.Router();

    router.get('/', (req: Request, res: Response) => {


        const menuItems = MenuDb.getAll();
        return res.status(200).json(menuItems);

    });

    router.get('/:id', (req: Request, res: Response) => {
        
        //check if id is valid number

        
        
        const id = Number(req.params.id);
        if (isNaN(id)) {
            const error = Util.invalidIDError(req.params.id);
            return res.status(404).json(error);
        }

   

        const menuItem = MenuDb.get(id); 
        if (!menuItem) {
            const error = Util.menuItemNotFoundError(id);
            return res.status(404).json(error);
        }

        return res.status(200).json(menuItem);
    });


    router.post('/', (req: Request, res: Response) => {

        //could be undefined if the client doesn't send a JSON body
        const params = req.body; 

        if (!params) {
            return res.status(204).end();
        }

        //check if it has all required fields
        if (Util.hasNeither(params)) {

            const error = Util.MissingFieldsError;
            return res.status(400).json(error);
        }

        const name = params.name;
        const price = params.price;

        if (typeof name !== 'string' || name.trim() === "") {
            return res.status(400).json(Util.InvalidNameError);
        }

        if (!Util.isValidPrice(price)) {
            return res.status(400).json(Util.InvalidPriceError);
        }

        const newMenuItem: MenuItem = MenuDb.create({
            name: name,
            price: price
        });

        
        return res.status(201).json(newMenuItem);
    });


    router.patch("/:id", (req: Request, res: Response) => {

      

        const id = Number(req.params.id);
        if (isNaN(id)) {
            const error = Util.invalidIDError(req.params.id);
            return res.status(400).json(error);
        }

        const menuItem = MenuDb.get(id);
        if (!menuItem) {
            const error = Util.menuItemNotFoundError(id);
            return res.status(404).json(error);
        }

        const params = req.body;

        if(!params) {
            return res.status(204).end();
        }

        if (Util.hasNeither(params)) {
            const error = Util.MissingFieldsError;
            return res.status(400).json(error);
        }

        
        const updatedData: Partial<MenuItem> = {};

        if ('name' in params) {
            if (typeof params.name !== 'string' || params.name.trim() === "") {
                return res.status(400).json(Util.InvalidNameError);
            }
            updatedData.name = params.name;
        }
        if ('price' in params) {
            const price = params.price;
            if (!Util.isValidPrice(price)) {
                return res.status(400).json(Util.InvalidPriceError);
            }
            updatedData.price = price;
        }

        const updatedMenuItem = MenuDb.update(id, updatedData);
        return res.status(200).json(updatedMenuItem);
        


    });


    router.delete("/:id", (req: Request, res: Response) => {

        const id = Number(req.params.id);
        if (isNaN(id)) {
            const error = Util.invalidIDError(req.params.id);
            
            return res.status(400).json(error);
        }

        const menuItem = MenuDb.get(id);
        if (!menuItem) {
            const error = Util.menuItemNotFoundError(id);
            return res.status(404).json(error);
        }

        MenuDb.delete(id);
        return res.status(204).end();
    });
    
    

    return router;
}