// get
// title, keyword, description
const HTML = require('node-html-parser');
const request = require('request');
const validURL = function (s) {
    return s && /((http(s)?):\/\/[\w\.\/\-=?#]+)/i.test(s);
}

const fetchHtml = (url) => {
    return new Promise((resolve, reject) => {
        request.get(url, function (err, res, body) {
            if (!err) {
                resolve({
                    success: true,
                    html: body
                });
            } else {
                reject({
                    success: false,
                    html: ''
                })
            }
        });
    })
}

const readMeta = (meta, name) => {
    const attr = meta.getAttribute('property');
    return attr == name ? meta.getAttribute('content') : null;
}

const scrapeMetaTag = (html) => {
    return new Promise((resolve, reject) => {
        const root = HTML.parse(html);
        const metas = root.querySelectorAll('meta');
        const og = {};
        const images = [];
        metas.forEach((metaData) => {
            // console.log(metaData);
            if (readMeta(metaData, 'og:title')) {
                og.title = readMeta(metaData, 'og:title')
            }

            if (readMeta(metaData, 'og:description')) {
                og.description = readMeta(metaData, 'og:description')
            }

            if (readMeta(metaData, 'og:image')) {
                images.push(readMeta(metaData, 'og:image'))
            }

            if (readMeta(metaData, 'og:image:url')) {
                images.push(readMeta(metaData, 'og:image:url'))
            }

            if (readMeta(metaData, 'og:keywords')) {
                og.keywords = readMeta(metaData, 'og:keywords')
            }

            if (readMeta(metaData, 'og:url'))
                og.url = readMeta(metaData, 'og:url');

            if (readMeta(metaData, 'og:site_name'))
                og.site_name = readMeta(metaData, 'og:site_name');

            if (readMeta(metaData, 'og:type'))
                og.type = readMeta(metaData, 'og:type');
        });

        if (images.length > 0) {
            og.images = images;
        }
        resolve(Object.keys(og).length > 0 ? { success: true, og } : { success: false, og: {} });
    });
}

const scrape = (event, context, cb) => {
    const url = event.body.url;
    if (!validURL(url)) {
        return cb(null, {
            success: false,
            message: "Invalid URL"
        });
    } else {
        fetchHtml(url).then((response) => {
            return scrapeMetaTag(response.html)
        }).then((response) => {
            return cb(null, response);
        }).catch((response) => {
            return cb(null, response);
        });
    }
}

module.exports.scrape = scrape;
module.exports.validURL = validURL;
module.exports.fetchHtml = fetchHtml;
module.exports.scrapeMetaTag = scrapeMetaTag;