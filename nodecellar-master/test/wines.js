var url = 'http://localhost:3000';
var request = require('supertest');
var should = require('should'); 
var assert = require('assert');

describe('Test wines', function(){

  describe('GET /wines', function(){
    it('should initially have 24 wines', function(done){
      request(url)
      .get('/wines')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err,res) {
        if (err) {
          throw err;
        }
        res.body.length.should.equal(24);
        done();
      })
    })
  })

  describe('GET /wines/:id', function(){
    it('should get the wine of valid id', function(done){
      request(url)
      .get('/wines/53d6baaf109915b214000001')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err,res) {
        if (err) {
          throw err;
        }
        res.body._id.should.equal('53d6baaf109915b214000001');
        //name and grapes are required
        res.body.should.have.property('name')
        res.body.should.have.property('grapes')
        done();
      })
    })

    it('should not found if wine does not exist', function(done){
      request(url)
      .get('/wines/53d5e472091d02c13b000123')
      .expect(404, done)
    })
  
    it('should error if id is invalid', function(done){
      request(url)
      .get('/wines/123')
      .expect(500, done)
    })
  })

  describe('POST /wines', function(){
    it('should create a new wine', function(done){
      var data = {
        name: 'Delicious one',
        grapes: 'Amazing grape'
      };

      request(url)
      .post('/wines')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send(data)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err,res) {
        if (err) {
          throw err;
        }
        // response should send back the new wine's ID
        res.body.should.have.property('_id');
        res.body.name.should.not.equal(null);
        done();
      })
    })

    it('should be an empty item when no data posted', function(done){
      request(url)
      .post('/wines')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({})
      .expect(200)
      .end(function(err,res) {
        if (err) {
          throw err;
        }
        res.body.should.have.property('_id');
        res.body.should.not.have.property('name');
        done();
      })
    })
  })

  describe('PUT /wines/:id', function(){
    it('should update the wine', function(done){
      var data = {
        name: 'Better than ever',
        grapes: 'Best grape'
      };

      request(url)
      .put('/wines/53d6baaf109915b214000003')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send(data)
      .end(function(err, res){
        if (err) return done(err);
        res.body.name.should.equal('Better than ever');
        res.body.grapes.should.equal('Best grape');
        done();
      })
    })

    it('should error on inappropriate update', function(done){
      var data = {'somthingWrong': 'not right'};

      request(url)
      .put('/wines/53d6baaf109915b214000003')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send(data)
      .end(function(err, res){
        if (err) return done(err);
        res.body.should.not.have.property('name');
        res.body.should.not.have.property('grape');
        done();
      })
    })
  })

  describe('DELETE /wines/:id', function(){
    it('should delete the wine', function(done){
      request(url)
      .delete('/wines/53d6baaf109915b214000002')
      .expect(200)
      .end(function(err, res){
        request(url)
        .get('/wines/53d6baaf109915b214000002')
        .expect(404,done);
      })
    })

    it('should delete the wine', function(done){
      request(url)
      .delete('/wines/abc')
      .expect(500, done);
    })
  })
})
