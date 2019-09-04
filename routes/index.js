const router = require('express').Router();
const {
  postData,
  getDataByOrganization,
  deleteData
} = require('../controller')

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Server is live !',
  });
});

router.post('/orgs/:orgName/comments', postData);
router.get('/orgs/:orgName/comments', getDataByOrganization);
router.delete('/orgs/:orgName/comments', deleteData);

module.exports = router;