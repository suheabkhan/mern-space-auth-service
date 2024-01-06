import bcrypt from 'bcrypt';

export class CredentialService {
    async checkPassword(userPassword: string, passwordHash: string) {
        return await bcrypt.compare(userPassword, passwordHash);
    }
}
