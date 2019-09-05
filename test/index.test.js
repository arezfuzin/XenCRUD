/* eslint-disable */
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const Member = require('../model/member');

const expect = chai.expect;
chai.use(chaiHttp);

const user = {
	username : 'user',
	email: 'user@mail.com',
	password: 'myname94',
	organization: 'xendit'
}

const admin = {
  role: 'admin',
	username : 'admin',
	email: 'admin@mail.com',
	password: 'myname94',
	organization: 'xendit'
}

const dummyUser = {
	username : 'dummyUser',
	organization: 'xendit'
}

let userId = ''
const userEmail = user.email
const userPassword = user.password
let userToken = ''

let adminId = ''
const adminEmail = admin.email
const adminPassword = admin.password
let adminToken = ''

describe('Health server check', () => {
  it('Should server connection status', (done) => {
    chai.request(app)
      .get('/')
      .end((err, res) => {
        if (err) throw err;
        expect(res).to.have.status(200);
        done();
      });
  });
});

describe('Member Flow', () => {
  beforeEach(function(done) {
    this.timeout(3000);
    setTimeout(done, 2500);
  });

  after( async function() {
    await Member.findByIdAndRemove(adminId)
    await Member.findByIdAndRemove(userId)
  });

  it('Should sign up new member data with role as an user', (done) => {
    chai.request(app)
      .post('/signUp')
      .type('form')
      .send(user)
      .end((err, res) => {
        if (err) throw err;
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal('Account Created !');
        expect(res.body.userData.role).to.equal('user');
        expect(res.body.userData).to.be.an('object');
        userToken = res.body.token
        userId = res.body.userData.id
        done();
      });
  });

  it('Should error if sign up with same email and user name', (done) => {
    chai.request(app)
      .post('/signUp')
      .type('form')
      .send(user)
      .end((err, res) => {
        if (err) throw err;
        expect(res).to.have.status(400);
        expect(res.body.message).to.equal('Can\'t create account, possibility your username already taken or your email already used.');
        done();
      });
  });

  it('Should sign up new member data with role as an admin', (done) => {
    chai.request(app)
      .post('/signUp')
      .type('form')
      .send(admin)
      .end((err, res) => {
        if (err) throw err;
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal('Account Created !');
        expect(res.body.userData.role).to.equal('admin');
        expect(res.body.userData).to.be.an('object');
        adminToken = res.body.token
        adminId = res.body.userData.id
        done();
      });
  });

  it('Should error if sign up with same email and user name', (done) => {
    chai.request(app)
      .post('/signUp')
      .type('form')
      .send(admin)
      .end((err, res) => {
        if (err) throw err;
        expect(res).to.have.status(400);
        expect(res.body.message).to.equal('Can\'t create account, possibility your username already taken or your email already used.');
        done();
      });
  });

  it('Should error when sign up with invalid email', (done) => {
    dummyUser.email = 'dummyUser.com'
    dummyUser.password = 'myname94'
    chai.request(app)
      .post('/signUp')
      .type('form')
      .send(dummyUser)
      .end((err, res) => {
        if (err) throw err;
        expect(res).to.have.status(400);
        expect(res.body.message).to.equal('Please fill a valid email address');
        done();
      });
  });

  it('Should error when sign up with invalid password format', (done) => {
    dummyUser.email = 'dummyUser@mail.com'
    dummyUser.password = '123'
    chai.request(app)
      .post('/signUp')
      .type('form')
      .send(dummyUser)
      .end((err, res) => {
        if (err) throw err;
        expect(res).to.have.status(400);
        expect(res.body.message).to.equal('Your password minimum eight characters, at least one letter and one number');
        done();
      });
  });

  it('Should error when sign in to system with invalid email and password', (done) => {
    chai.request(app)
      .post('/signIn')
      .type('form')
      .send({ email: 'xxx@mail.com', password: 'testing123' })
      .end((err, res) => {
        if (err) throw err;
        expect(res).to.have.status(400);
        expect(res.body.message).to.equal('Email invalid !');
        done();
      });
  });

  it('Should error when sign in to system with wrong password', (done) => {
    chai.request(app)
      .post('/signIn')
      .type('form')
      .send({ email: 'wolverine@mail.com', password: 'testing123' })
      .end((err, res) => {
        if (err) throw err;
        expect(res).to.have.status(400);
        expect(res.body.message).to.equal('Wrong password !');
        done();
      });
  });

  it('Should sign in to system as user', (done) => {
    chai.request(app)
      .post('/signIn')
      .type('form')
      .send({ email: userEmail, password: userPassword })
      .end((err, res) => {
        if (err) throw err;
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal('Log in !');
        expect(res.body.data.role).to.equal('user');
        expect(res.body.data.isLogin).to.equal(true);
        expect(res.body.data).to.be.an('object');
        userToken = res.body.token
        done();
      });
  });

  it('Should sign in to system as admin', (done) => {
    chai.request(app)
      .post('/signIn')
      .type('form')
      .send({ email: adminEmail, password: adminPassword })
      .end((err, res) => {
        if (err) throw err;
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal('Log in !');
        expect(res.body.data.role).to.equal('admin');
        expect(res.body.data.isLogin).to.equal(true);
        expect(res.body.data).to.be.an('object');
        adminToken = res.body.token
        done();
      });
  });
});