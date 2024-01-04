import { DataSource } from 'typeorm';

export const truncateTables = async (connection: DataSource) => {
    const entities = connection.entityMetadatas;
    // This will provide all the entities in the DB
    for (const entity of entities) {
        const repository = connection.getRepository(entity.name);
        //This will delete the table
        await repository.clear();
    }
};

export const isJwt = (token: string): boolean => {
    const parts: string[] = token.split('.');
    if (parts.length != 3) return false;
    try {
        parts.forEach((part) => {
            Buffer.from(part, 'base64').toString('utf-8');
        });
        return true;
    } catch (err) {
        return false;
    }
};
