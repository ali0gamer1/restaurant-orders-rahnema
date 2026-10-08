// Entry point for `npm start`. You do not need to change this file.
import { PORT, startServer } from './server';


startServer();
console.log(`Server is running on http://localhost:${PORT}`);
