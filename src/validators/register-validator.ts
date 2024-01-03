import { checkSchema } from 'express-validator';

export default checkSchema({
    email: {
        notEmpty: true,
        errorMessage: 'Email is Required!',
        isEmail: {
            errorMessage: 'Email should be a valid Email',
        },
    },
});

//export default [body('email').notEmpty().withMessage('Email is Required!')];
