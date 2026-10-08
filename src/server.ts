// Level 4: read ../level-4/README.md, then complete PORT and startServer below.

import type { Server } from 'node:http';
import { createApp } from './app';


export const PORT = 3000;


export function startServer(): Server {
    
    const app = createApp();


    const server = app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
  

    return server;
}
