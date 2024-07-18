const crypto = require('crypto');
const { body, validationResult } = require('express-validator');

const Shorturl = require('../models/shorturl');

exports.generateHash = async (input, min = 0, max = 8) => {
    const hash = crypto.createHash('sha256').update(input).digest('base64').substring(min, max);

    const hashcheck = await Shorturl.checkHashExistsOrNot(hash);
    if (hashcheck.length > 0) {
        return this.generateHash(input, 9, 16);
    }

    return hash;
};

exports.urlvalidator = async (req) => {
    await body('long_url')
        .isURL().withMessage('Invalid URL')
        .trim()
        .run(req);

    const sanitizedUrl = req.body.long_url;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return { valid: false, sanitizedUrl: sanitizedUrl, errors: errors.array() };
    }
    return { valid: true, sanitizedUrl: sanitizedUrl, errors: [] };
};