import type { Request, Response } from 'express';
import { AllowedSchema } from 'express-json-validator-middleware';
import { db } from '../../services/db';
import { PostRoute } from '../types';

// curl http://localhost:3000/addChordLinkVisit -XPOST -H Content-Type:application/json --data '{"url": "http://foo.bar"}'

const handler = async (req: Request, res: Response) => {
    const { url } = req.body;
    console.log('Adding visit to', url);
    db.query(
        `INSERT INTO ChordFrequency (url, count, lastAccessDateUnix)
        VALUES (?, 1, UNIX_TIMESTAMP())
        ON DUPLICATE KEY UPDATE count = count+1, lastAccessDateUnix = UNIX_TIMESTAMP()
    `,
        [url],
        (err, rows) => {
            if (err) {
                throw err;
            }

            res.send(rows);
        }
    );
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
