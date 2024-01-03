import { UserData } from '@/types';
import { User } from '../entity/User';
import { Repository } from 'typeorm';
import createHttpError from 'http-errors';
import { Roles } from '../../src/constants/index';
import bcrypt from 'bcrypt';
export class UserService {
    constructor(private userRepository: Repository<User>) {}
    async create({ firstName, lastName, email, password }: UserData) {
        //check if user already present
        const user = await this.userRepository.findOne({
            where: {
                email: email,
            },
        });
        if (user) {
            const userAlreadyExistsError = createHttpError(
                400,
                'Email Alreadys Exists!',
            );
            throw userAlreadyExistsError;
        }
        //Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        try {
            return await this.userRepository.save({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                role: Roles.CUSTOMER,
            });
        } catch (err) {
            const error = createHttpError(
                500,
                'Failed to store the data in database with error ',
            );
            throw error;
        }
    }
}
