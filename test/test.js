const request = require('supertest');
const app = require('../src/app');
const assert = require('assert');

describe('GET /contracts/somebodyElseContract', function() {
  it('forbids access', function(done) {
    request(app)
        .get('/contracts/1')
        .set('profile_id', 2)
        .expect('Content-Type', /json/)
        .expect(403, done);
  });
});

describe('GET /contracts/1', function() {
  it('returns contract', function(done) {
    request(app)
        .get('/contracts/1')
        .set('profile_id', 5)
        .expect('Content-Type', /json/)
        .expect(200, done);
  });
});

describe('GET /contracts', function() {
  it('Returns non terminated contracts', function(done) {
    request(app)
      .get('/contracts')
      .set('profile_id', 1)
      .expect(200)
      .end((err, res) => {
        assert.equal(res.body.length, 1);
        assert.notEqual(res.body[0].status, "terminated");
        done()
      });
  });
});