const express = require('express');
const {dobiSejo} = require("../services/index");
const router = express.Router();
const cors = require('cors')
const {shraniRezultat} = require("../services");

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
});

router.post('/seja/:sejaId', cors(), async function (req, res) {
  try {
    res.json(await shraniRezultat(req.body));
  } catch (err) {
    console.error(`Error med dobivanjem seje`, err.message);
  }
});

module.exports = router;
