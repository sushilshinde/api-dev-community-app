var express = require('express');
var router = express.Router();
const {getEnvironmentDeployments} = require('../services/cciservice')
const {getReleases} = require('../services/gitservice')

router.get('/deployments', async function(req, res, next) {
  let d = {}
  let r = await getEnvironmentDeployments()
  d = JSON.stringify(r)
  res.setHeader('access-control-allow-origin', '*');
  res.setHeader('content-type', 'application/json');
  res.setHeader('content-length', '31882');  
  res.send(d);
});


router.get('/releases', async function(req, res, next) {
  let d = {}
  let r = await getReleases()
  d = JSON.stringify(r)
  res.setHeader('access-control-allow-origin', '*');
  res.setHeader('content-type', 'application/json');
  res.setHeader('content-length', '31882');  
  res.send(d);
});


module.exports = router;
