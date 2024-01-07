import { TenantService } from '../services/TenantService';
import { NextFunction, Response } from 'express';
import { createTenantRequest } from '../types/index';
import { Logger } from 'winston';

export class TenantController {
    constructor(
        private tenantService: TenantService,
        private logger: Logger,
    ) {}

    async create(req: createTenantRequest, res: Response, next: NextFunction) {
        const { name, address } = req.body;
        this.logger.debug('A new request for creation of tenant {}', req.body);
        try {
            const tenant = await this.tenantService.create({
                name,
                address,
            });
            this.logger.info('Tenant has been created with details:{}', tenant);
            res.status(201).json({ id: tenant.id });
        } catch (err) {
            return next(err);
        }
    }
}
