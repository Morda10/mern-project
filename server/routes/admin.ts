import { Router } from 'express';
import { nextTick } from 'process';

const router = Router();


router.get('/add-productd', (_req, res, _next) => {
    res.send(
        '<form action="/product" method="POST"><input type="text" name="title"><button type="submit">submit</button></form>'
    );
})

router.post('/product', (req, res, _next) => {
    console.log(req.body);
    res.redirect('/');
})

export default router;
