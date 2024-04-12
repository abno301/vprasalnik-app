const express = require('express');
const { ustvariSejo} = require("../services/admin");
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

module.exports = router;
