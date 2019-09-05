const router = require('express').Router();
const {
  postData,
  getDataByOrganization,
  deleteData
} = require('../controller/organization')

const {
  signUp,
  signIn,
} = require('../controller/member');

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Server is live !',
  });
});

// Organization
router.post('/orgs/:orgName/comments', postData);
router.get('/orgs/:orgName/comments', getDataByOrganization);
router.delete('/orgs/:orgName/comments', deleteData);

// Member
router.post('/signUp', signUp);
router.post('/signIn', signIn);

module.exports = router;