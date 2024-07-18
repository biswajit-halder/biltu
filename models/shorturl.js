const mysql = require('mysql2');

const pool = require('../util/mysql');

exports.checkUrlExistsOrNot = async (longurl) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM `url_logs` WHERE `long_url` = ?', [longurl], (err, rows) => {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
};

exports.checkHashExistsOrNot = async (hash) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM `url_logs` WHERE `key` = ?', [hash], (err, rows) => {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
};

exports.storeUrlData = async (longurl, key, short_url) => {
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO url_logs (`long_url`, `key`, `short_url`) VALUES (?, ?, ?)', [longurl, key, short_url], (err, rows) => {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
};