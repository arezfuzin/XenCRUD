/* eslint-disable */
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const Member = require('../model/member');
const Organization = require('../model/organization');

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

const commentMessage = {
  comment: 'Looking to hire SE Asia\'s top dev talent!'
}
const organizationName = 'xendit'
let commentId = ''

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
    this.timeout(5000);
    setTimeout(done, 4500);
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
        expect(res.body.data).to.be.an('object');
        adminToken = res.body.token
        done();
      });
  });

  it('Should error when trying to get all data member without login', (done) => {
    chai.request(app)
      .get('/orgs/xendit/members/')
      .set('token', '')
      .end((err, res) => {
        if (err) throw err;
        expect(res).to.have.status(401);
        expect(res.body.message).to.equal('You not have permission to do this action !');
        done();
      });
  });

  it('Should error when trying to get all data member with user account', (done) => {
    chai.request(app)
      .get('/orgs/xendit/members/')
      .set('token', userToken)
      .end((err, res) => {
        if (err) throw err;
        expect(res).to.have.status(401);
        expect(res.body.message).to.equal('You not have access to do this action !');
        done();
      });
  });

  it('Should get all data member when sign in as an admin', (done) => {
    chai.request(app)
      .get('/orgs/xendit/members/')
      .set('token', adminToken)
      .end((err, res) => {
        if (err) throw err;
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal('Data found !');
        expect(res.body.data).to.be.an('array');
        done();
      });
  });
});

describe('Organization flow', () => {
  beforeEach(function(done) {
    this.timeout(5000);
    setTimeout(done, 4500);
  });

  after( async function() {
    await Organization.findByIdAndRemove(commentId)
    await Organization.updateMany({
      organization: organizationName,
      isDeleted: true
    }, {
      $set: {
        isDeleted: false
      }
    }, {
      multi: true
    })
  });

  it('Should save organization comment', (done) => {
    chai.request(app)
      .post(`/orgs/${organizationName}/comments`)
      .type('form')
      .set('token', userToken)
      .send(commentMessage)
      .end((err, res) => {
        if (err) throw err;
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal('Data Saved !');
        expect(res.body.data).to.be.an('object');
        commentId = res.body.data._id
        done();
      });
  });

  it('Should error when post organization comment without login', (done) => {
    chai.request(app)
      .post(`/orgs/${organizationName}/comments`)
      .type('form')
      .set('token', '')
      .send(commentMessage)
      .end((err, res) => {
        if (err) throw err;
        expect(res).to.have.status(401);
        expect(res.body.message).to.equal('You not have permission to do this action !');
        done();
      });
  });

  it('Should error when post organization comment without the comment data', (done) => {
    chai.request(app)
      .post(`/orgs/${organizationName}/comments`)
      .type('form')
      .set('token', userToken)
      .send()
      .end((err, res) => {
        if (err) throw err;
        expect(res).to.have.status(400);
        expect(res.body.message).to.equal('Can\'t save data');
        done();
      });
  });

  it('Should get all organization comment data base on organization parameter', (done) => {
    chai.request(app)
      .get(`/orgs/${organizationName}/comments`)
      .set('token', userToken)
      .end((err, res) => {
        if (err) throw err;
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal('Data found !');
        expect(res.body.data).to.be.an('array');
        done();
      });
  });

  it('Should get empty array if the organization not recorded in database', (done) => {
    chai.request(app)
      .get('/orgs/something/comments')
      .set('token', userToken)
      .end((err, res) => {
        if (err) throw err;
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal('There is no data !');
        expect(res.body.data).to.be.an('array');
        expect(res.body.data.length).equal(0);
        done();
      });
  });

  it('Should error to get all organization comment data without login', (done) => {
    chai.request(app)
      .get(`/orgs/${organizationName}/comments`)
      .set('token', '')
      .end((err, res) => {
        if (err) throw err;
        expect(res).to.have.status(401);
        expect(res.body.message).to.equal('You not have permission to do this action !');
        done();
      });
  });

  it('Should error when trying to soft delete all organization comment base on params without login', (done) => {
    chai.request(app)
      .delete(`/orgs/${organizationName}/comments`)
      .set('token', '')
      .end((err, res) => {
        if (err) throw err;
        expect(res).to.have.status(401);
        expect(res.body.message).to.equal('You not have permission to do this action !');
        done();
      });
  });

  it('Should error when trying to soft delete all organization comment base on params if login as user account', (done) => {
    chai.request(app)
      .delete(`/orgs/${organizationName}/comments`)
      .set('token', userToken)
      .end((err, res) => {
        if (err) throw err;
        expect(res).to.have.status(401);
        expect(res.body.message).to.equal('You not have access to do this action !');
        done();
      });
  });

  it('Should soft delete all organization comment data base on the organization params if sign as admin', (done) => {
    chai.request(app)
      .delete(`/orgs/${organizationName}/comments`)
      .set('token', adminToken)
      .end((err, res) => {
        if (err) throw err;
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal('Data deleted !');
        done();
      });
  });
});

describe('User sign out', () => {
  beforeEach(function(done) {
    this.timeout(5000);
    setTimeout(done, 4500);
  });

  after( async function() {
    await Member.findByIdAndRemove(adminId)
    await Member.findByIdAndRemove(userId)
    adminToken = ''
    userToken = ''
  });

  it('User account should log out from system', (done) => {
    chai.request(app)
      .post('/signOut')
      .type('form')
      .send({ email: userEmail })
      .end((err, res) => {
        if (err) throw err;
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal('You already log out !');
        done();
      });
  });

  it('Admin account should log out from system', (done) => {
    chai.request(app)
      .post('/signOut')
      .type('form')
      .send({ email: adminEmail })
      .end((err, res) => {
        if (err) throw err;
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal('You already log out !');
        done();
      });
  });

  it('Should error if the email data wrong or not found when trying to log out', (done) => {
    chai.request(app)
      .post('/signOut')
      .type('form')
      .send({ email: 'xx@mail.com' })
      .end((err, res) => {
        if (err) throw err;
        expect(res).to.have.status(400);
        expect(res.body.message).to.equal('Filed to log out !');
        done();
      });
  });
});