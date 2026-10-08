// Level 4: read ../level-4/README.md, then build the Express app below.


import express, { type Express } from 'express';
import healthRouter from './routes/health.route';
import { createReservationsRouter } from './routes/reservations.route';
import { createMenuRouter } from './routes/menu.route';
import { createOrdersRouter } from './routes/orders.route';
import { InMemoryDb } from './db';
import { requireAuth } from './auth';
import { OrderQueue } from './order-queue';
import type { MenuItem } from './models/MenuItem';


export function createApp(): Express {
  const app = express();

  const MenuDb = new InMemoryDb<MenuItem>();
  const orderQueue = new OrderQueue();
  

  app.use(express.json({
    limit: '10mb',        // Max body size
    strict: true,         // Only accept arrays and objects
    type: 'application/json', // Content types to parse
  }));

  app.use("/orders", requireAuth, createOrdersRouter(orderQueue, MenuDb));
  app.use("/health", healthRouter);
  app.use("/reservations", createReservationsRouter());
  app.use("/menu", createMenuRouter(MenuDb));


  app.all("/{*splat}", (req, res) => {
    res.status(404).json({ error: { message: `Route ${req.method} ${req.originalUrl} not found`, code: "ROUTE_NOT_FOUND" } });
  });

  return app;
}
