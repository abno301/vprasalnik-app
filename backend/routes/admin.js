const express = require('express');
const { ustvariSejo, dobiAktivnoSejo, zbrisiAktivnoSejo, dobiSeje} = require("../services/admin");
const router = express.Router();

/* Dobi vse seje. */
router.get('/seja', async function(req, res, next) {
  try {
    res.json(await dobiSeje());
  } catch (err) {
    console.error(`Error med dobivanjem sej`, err.message);
    next(err);
  }
});

/* Ustvari novo sejo. */
router.post('/seja', async function(req, res, next) {
  try {
    res.json(await ustvariSejo(req.body));
  } catch (err) {
    console.error(`Error med kreiranjem nove seje`, err.message);
    next(err);
  }
});

/* Dobi aktivno sejo. */
router.get('/aktivna-seja', async function(req, res, next) {
  try {
    res.json(await dobiAktivnoSejo());
  } catch (err) {
    console.error(`Error med dobivanjem aktivne seje`, err.message);
    next(err);
  }
});

/* Zakljuci aktivno sejo. */
router.delete('/aktivna-seja', async function(req, res, next) {
  try {
    res.json(await zbrisiAktivnoSejo());
  } catch (err) {
    console.error(`Error med dobivanjem aktivne seje`, err.message);
    next(err);
  }
});

module.exports = router;
