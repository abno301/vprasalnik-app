const express = require('express');
const { ustvariSejo, dobiAktivnoSejo, zbrisiAktivnoSejo, dobiSeje, dobiAktivnaVprasanja, spremeniDovoljenjeVprasanja} = require("../services/admin");
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

/* Dobi pri katerem vprasanju je kateri uporabnik */
router.get('/aktivna-seja/aktivna-vprasanja', async function(req, res, next) {
  try {
    res.json(await dobiAktivnaVprasanja());
  } catch (err) {
    console.error(`Error med dobivanjem aktivnih vprasanj`, err.message);
    next(err);
  }
});

/* Admin dovoli napredovanje pri tem vprasanju */
router.post('/aktivna-seja/dovoli-vprasanje', async function(req, res, next) {
  try {
    res.json(await spremeniDovoljenjeVprasanja(req.body));
  } catch (err) {
    console.error(`Error med spreminjanjem dovoljenja`, err.message);
    next(err);
  }
});

module.exports = router;
