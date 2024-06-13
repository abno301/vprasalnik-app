const express = require('express');
const {dobiSejo} = require("../services/index");
const router = express.Router();
const cors = require('cors')
const {shraniRezultat, shraniAktivnoVprasanje} = require("../services");

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.options('seja/:sejaId', cors())

/* Dobi sejo iz URL */
router.get('/seja/:sejaId', cors(), async function (req, res) {
  try {
    res.json(await dobiSejo(req.params.sejaId));
  } catch (err) {
    console.error(`Error med dobivanjem seje`, err.message);
  }
});

/* Shrani uporabnikov rezultat */
router.post('/seja/:sejaId', cors(), async function (req, res) {
  try {
    res.json(await shraniRezultat(req.body));
  } catch (err) {
    console.error(`Error med shranjevanjem rezultata`, err.message);
  }
});

/* Shrani pri katerem vprasanju je uporabnik */
router.post('/aktivna-vprasanja', cors(), async function (req, res) {
  try {
    res.json(await shraniAktivnoVprasanje(req.body));
  } catch (err) {
    console.error(`Error med dodajanjem aktivnega vprasanja`, err.message);
  }
});

module.exports = router;
