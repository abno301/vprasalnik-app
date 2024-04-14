const express = require('express');
const {dobiSejo} = require("../services/index");
const router = express.Router();
const cors = require('cors')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.options('seja/:sejaId', cors())
router.get('/seja/:sejaId', cors(), async function (req, res) {
  try {
    res.json(await dobiSejo(req.params.sejaId));
  } catch (err) {
    console.error(`Error med dobivanjem seje`, err.message);
  }
})



module.exports = router;
