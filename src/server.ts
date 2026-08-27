import express from 'express';
import routes from './routes/index';

const app = express();
app.use(express.json());

app.use((req, res, next) => {
    console.log('REQUEST:', req.method, req.url);
    next();
});

app.use(routes);

export default app;