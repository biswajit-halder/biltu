const express = require('express');
const router = express.Router();

const shortUrl = require('../controllers/shorturl');

router.get('/', shortUrl.getIndex);

router.post('/', shortUrl.generateShortUrl);

module.exports = router;