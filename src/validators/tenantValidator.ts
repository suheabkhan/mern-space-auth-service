import { checkSchema } from 'express-validator';

export default checkSchema({
    name: {
        notEmpty: true,
        errorMessage: 'name is Required!',
        trim: true,
        escape: true,
    },
    address: {
        notEmpty: true,
        errorMessage: 'address is Required!',
        trim: true,
        escape: true,
    },
});
