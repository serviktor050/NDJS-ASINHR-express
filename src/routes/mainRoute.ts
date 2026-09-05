import * as express from 'express';
import type { Request, Response } from 'express';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
    res.render('main', {
        title: 'Главная',
        user: req.user,
    });
});

export default router;