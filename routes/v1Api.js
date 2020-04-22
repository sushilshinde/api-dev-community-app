var express = require('express');
var router = express.Router();
const {getEnvironmentDeployments} = require('../services/cciservice')
router.get('/', async function(req, res, next) {
  let d = {}
  let r = await getEnvironmentDeployments()
  d = JSON.stringify(r)
  res.setHeader('content-type', 'application/json');
  res.send(d);
});

module.exports = router;
