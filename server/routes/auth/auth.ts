import { Router } from 'express';
import { body } from 'express-validator';
import authController from '../../controllers/authController';
import { registerValidation } from './validations';
const router = Router();


router.post('/register',registerValidation,authController.signup);

router.post('/product', (req, res, _next) => {
    console.log(req.body);
    res.redirect('/');
})

export default router;