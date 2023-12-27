import type { NextFunction, Request, Response } from 'express';
import { AllowedSchema } from 'express-json-validator-middleware';
import { PostRoute } from '../types';
import { addLinkVisit } from '../../services/chords';

const handler = async (req: Request, res: Response, next: NextFunction) => {
    const { url } = req.body;
    console.log('Adding visit to', url);

    addLinkVisit({ url }, (error) => {
        if (error) {
            return next(error);
        }

        res.send();
    });
};

const inputSchema: AllowedSchema = {
    type: 'object',
    required: ['url'],
    additionalProperties: false,
    properties: {
        url: {
            type: 'string'
        }
    }
};

export const route: PostRoute = {
    method: 'post',
    path: '/chords/addLinkVisit',
    inputSchema,
    handler,
    protected: true
};
