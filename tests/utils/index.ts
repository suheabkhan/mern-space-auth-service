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
