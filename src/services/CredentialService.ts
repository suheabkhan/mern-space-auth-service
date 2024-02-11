import bcrypt from 'bcryptjs';

export class CredentialService {
    async checkPassword(userPassword: string, passwordHash: string) {
        return await bcrypt.compare(userPassword, passwordHash);
    }
}
