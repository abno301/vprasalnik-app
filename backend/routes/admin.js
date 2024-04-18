const express = require('express');
const { ustvariSejo, dobiAktivnoSejo, zbrisiAktivnoSejo} = require("../services/admin");
const router = express.Router();

/* Ustvari novo sejo. */
router.post('/seja', async function(req, res, next) {
  try {
    res.json(await ustvariSejo(req.body));
  } catch (err) {
    console.error(`Error med kreiranjem nove seje`, err.message);
    next(err);
  }
});

router.get('/aktivna-seja', async function(req, res, next) {
  try {
    res.json(await dobiAktivnoSejo());
  } catch (err) {
    console.error(`Error med dobivanjem aktivne seje`, err.message);
    next(err);
  }
});

router.delete('/aktivna-seja', async function(req, res, next) {
  try {
    res.json(await zbrisiAktivnoSejo());
  } catch (err) {
    console.error(`Error med dobivanjem aktivne seje`, err.message);
    next(err);
  }
});

module.exports = router;
