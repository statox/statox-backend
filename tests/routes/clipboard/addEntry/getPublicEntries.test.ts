import request from 'supertest';
import { DateTime } from 'luxon';
import { mysqlFixture } from '../../../helpers';
import { app } from '../../../..';
import { expect } from 'chai';

describe('clipboard/getPublicEntries', () => {
    it('Should retieve only public entries', async () => {
        const publicEntry = {
            id: 1,
            name: 'public entry',
            content: 'foo',
            creationDateUnix: Math.floor(DateTime.now().toSeconds()),
            ttl: 60,
            linkId: 'aaaaaaaa',
            isPublic: 1
        };
        const privateEntry = {
            id: 2,
            name: 'private entry',
            content: 'bar',
            creationDateUnix: Math.floor(DateTime.now().toSeconds()),
            ttl: 60,
            linkId: 'bbbbbbbb',
            isPublic: 0
        };
        await mysqlFixture({
            Clipboard: [publicEntry, privateEntry]
        });

        await request(app)
            .get('/clipboard/getPublicEntries')
            .set('Accept', 'application/json')
            .expect(200)
            .then((response) => {
                expect(response.body).to.have.same.deep.members([publicEntry]);
            });
    });

    it('Should retieve only entries with valid ttl', async () => {
        const ttlOk = {
            id: 1,
            name: 'public entry',
            content: 'foo',
            creationDateUnix: Math.floor(DateTime.now().toSeconds()),
            ttl: 60,
            linkId: 'aaaaaaaa',
            isPublic: 1
        };
        const ttlOver = {
            id: 2,
            name: 'private entry',
            content: 'bar',
            creationDateUnix: Math.floor(DateTime.now().toSeconds()) - 120,
            ttl: 60,
            linkId: 'bbbbbbbb',
            isPublic: 0
        };
        await mysqlFixture({
            Clipboard: [ttlOk, ttlOver]
        });

        await request(app)
            .get('/clipboard/getPublicEntries')
            .set('Accept', 'application/json')
            .expect(200)
            .then((response) => {
                expect(response.body).to.have.same.deep.members([ttlOk]);
            });
    });
});