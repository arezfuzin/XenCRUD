const router = require('express').Router();
const {
  postData,
  getDataByOrganization
} = require('../controller')

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Server is live !',
  });
});

router.post('/orgs/:orgName/comments', postData);
router.get('/orgs/:orgName/comments', getDataByOrganization);

module.exports = router;