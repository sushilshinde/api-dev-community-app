var express = require('express');
var router = express.Router();

router.post('/githubpush', async function(req, res, next) {
  
    console.log('Got body:', req.body);

    res.sendStatus(200);

});

module.exports = router;
