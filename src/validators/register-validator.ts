import { checkSchema } from 'express-validator';

export default checkSchema({
    email: {
        trim: true,
        notEmpty: true,
        errorMessage: 'Email is Required!',
        isEmail: {
            errorMessage: 'Email should be a valid Email',
        },
        escape: true,
    },
    firstName: {
        notEmpty: true,
        errorMessage: 'firstName is Required!',
        trim: true,
        escape: true,
    },
    lastName: {
        notEmpty: true,
        errorMessage: 'lastName is Required!',
        trim: true,
        escape: true,
    },
    password: {
        notEmpty: true,
        errorMessage: 'password is Required!',
        trim: true,
        escape: true,
        isLength: {
            options: {
                min: 8,
            },
            errorMessage: 'Password should be of atleast 8 chars!',
        },
    },
});

//export default [body('email').notEmpty().withMessage('Email is Required!')];
