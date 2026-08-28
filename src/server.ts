import express from 'express';
import path from 'path';

import routes from './routes/index';

const app = express();

app.use(express.json());

app.use((req, res, next) => {
    console.log('REQUEST:', req.method, req.url);
    next();
});


// API routes

app.use(routes);


// Frontend

const frontendPath = path.join(
    process.cwd(),
    'frontend'
);

app.use(express.static(frontendPath));


export default app;