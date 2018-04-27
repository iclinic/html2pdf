const pdf = require('./lib');
const AWS = require('aws-sdk');

const strRandom = (size = 16) => {
    charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
    for (let i = 0; i < size; i++) {
        let randomPos = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPos, randomPos + 1);
    }

    return randomString;
}

const render = (template, options, callback) => {
    pdf.create(template, options)
       .toBuffer( callback );
}

const renderFile = (template, options, callback) => {
    pdf.create(template, options)
       .toFile( `./tmp/${strRandom()}.pdf`, callback );
}

const put = (config, callback) => {
    const s3 = new AWS.S3({signatureVersion: 'v4'});
    s3.putObject(config, () => {
        s3.getSignedUrl('getObject', {Bucket: config.Bucket, Key: config.Key}, callback);
    });
}

module.exports = {
    pdf: { render, renderFile },
    util: { strRandom },
    storage: { put }
}
