const ShorturlModel = require('../models/shorturl');

const functions = require('../util/functions');

exports.getIndex = (req, res, next) => {
    res.render('index', {
        pageTitle: 'Short Url Genereator',
        error: '',
        value: '',
        key: '',
        short_url: ''
      });
};

exports.generateShortUrl = async (req, res, next) => {
    const serverUrl = `${process.env.PROTOCOL}//${process.env.DB_HOST}:${process.env.PORT}/`;
    const validation = await functions.urlvalidator(req);
    const sanitizedUrl = validation.sanitizedUrl;
    const urlobj = new URL(sanitizedUrl);
    const filteredurl = urlobj.origin + urlobj.pathname + urlobj.search + urlobj.hash;
    
    const resObj = {
        pageTitle: 'Short Url Genereator',
        error: validation.valid == false ? validation.errors[0].msg : '',
        value: sanitizedUrl
    };

    if(validation.valid === true) {
        const olddata = await ShorturlModel.checkUrlExistsOrNot(filteredurl);

        if(olddata.length > 0){
            resObj.key = olddata[0].key;
            resObj.short_url = olddata[0].short_url;
        }else{
            const hash = await functions.generateHash(sanitizedUrl);
            const short_url = serverUrl + hash;
            await ShorturlModel.storeUrlData(filteredurl, hash, short_url);

            resObj.key = hash;
            resObj.short_url = short_url;
        }
    }
    
    res.render('index', resObj);
};

exports.fetchUrlData = async (req, res, next) => {
    const path = req.path.replace(/\//g, '');
    console.log(req);
    const urldata = await ShorturlModel.checkHashExistsOrNot(path);
    if (urldata.length > 0) {
        res.redirect(urldata[0].long_url);
    } else {
        res.status(404).render('404', {
            pageTitle: 'URL Not Found',
            errormsg: 'URL not found!!',
            value: `${process.env.PROTOCOL}//${process.env.DB_HOST}:${process.env.PORT}/${path}`
          });
    }
};