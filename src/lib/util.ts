import { ErrorFormat } from "./errorFormat";
import type { MenuItem } from '../models/MenuItem'; 
import type { Response } from 'express';


export function isValidPrice(price: unknown): price is number {
    return typeof price === "number" && Number.isFinite(price) && price > 0;
}

export function NotFoundError(res: Response, message: string, code: string): Response {
    return res.status(404).json({ error: { message, code } });
}

export function InvalidDataError(res: Response, message: string, code: string): Response {
    return res.status(400).json({ error: { message, code } });
}

export const InvalidNameError: ErrorFormat = {
    error: {
        message: `name is required`,
        code: "VALIDATION_ERROR"
    }
};

export const InvalidPriceError: ErrorFormat = {
    error: {
        message: `price must be a positive number`,
        code: "VALIDATION_ERROR"
    }
};

export function invalidIDError(id: any): ErrorFormat {
    return {
        error: {
            message: `Invalid id ${id}`,
            code: "INVALID_ID"
        }
    };
}

export const MissingFieldsError: ErrorFormat = {
    error: {
        message: `Missing required fields`,
        code: "MISSING_FIELDS"
    }
};

export function menuItemNotFoundError(id: number): ErrorFormat {
    return {
        error: {
            message: `Menu item ${id} not found`,
            code: "MENU_ITEM_NOT_FOUND"
        }
    };
}

export function hasNeither(obj:Omit<MenuItem, "id">): boolean {
    return !("name" in obj) && !("price" in obj);
}