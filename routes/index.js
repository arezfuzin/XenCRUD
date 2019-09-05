const router = require('express').Router();
const {
  postData,
  getDataByOrganization,
  deleteData
} = require('../controller/organization')

const {
  signUp,
  signIn,
  signOut,
  getAllMembers,
} = require('../controller/member');

const {
  authentication,
  authorization,
} = require('../middleware');

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Server is live !',
  });
});

// Organization
router.post('/orgs/:orgName/comments', authentication, postData);
router.get('/orgs/:orgName/comments', authentication, getDataByOrganization);
router.delete('/orgs/:orgName/comments',authentication, authorization, deleteData);

// Member
router.post('/signUp', signUp);
router.post('/signIn', signIn);
router.post('/signOut', signOut);
router.get('/orgs/:orgName/members/',authentication, authorization, getAllMembers);


module.exports = router;