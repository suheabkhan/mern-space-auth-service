import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameTable1704606938593 implements MigrationInterface {
    name = 'RenameTable1704606938593';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "refreshTokens" DROP CONSTRAINT "FK_265bec4e500714d5269580a0219"`,
        );
        await queryRunner.renameTable('user', 'users');
        await queryRunner.query(
            `ALTER TABLE "refreshTokens" ADD CONSTRAINT "FK_265bec4e500714d5269580a0219" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "refreshTokens" DROP CONSTRAINT "FK_265bec4e500714d5269580a0219"`,
        );
        await queryRunner.renameTable('users', 'user');
        await queryRunner.query(
            `ALTER TABLE "refreshTokens" ADD CONSTRAINT "FK_265bec4e500714d5269580a0219" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }
}
