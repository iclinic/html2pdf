const config = require('./config.html2pdf');
const {pdf, util, storage} = require('./core');

let $callback;

exports.handler = (event, context, callback) => {
    // make it available globally
    $callback = callback;

    // Get POST request data
    const body = JSON.parse(event.body); // parse body
    const template = body.template;      // get template
    const options = body.options || {};  // get options
    const token = body.token;            // get token

    // Check auth token
    if (token !== config.AUTH_TOKEN) {
        $callback(new Error('Unauthorized'));
        return;
    }

    // Render PDF
    pdf.render(template, options, sendToS3);
};

const sendToS3 = (error, pdfOutput) => {
    // Check if something bad happened
    if (error) {
        $callback(error);
        return;
    }

    // S3 PUT params
    const params = {
        Bucket: config.S3_BUCKET,       // Bucket name
        Key: `${util.strRandom()}.pdf`, // Random file name
        Body: pdfOutput,                // File Buffer
        ACL: 'public-read',
        Expires: 120,
        ContentType: 'application/pdf'
    };

    // Send it away to S3
    storage.put(params, prepareResponse);
};

const prepareResponse = (error, url) => {
    // Check if something bad happened
    if(error) {
        $callback(error);
        return;
    }

    // Respond the callback with the S3 response
    $callback(null, {
        "isBase64Encoded": false,
        "statusCode": 200,
        "headers": { "Content-Type": "application/json; charset=utf-8" },
        "body": JSON.stringify({ url })
    });
};
