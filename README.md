# iClinic html2pdf

This is an AWS Lambda funcion that serves as endpoint to create PDF from an HTML template. This script works with a modified version of [html-pdf](https://www.npmjs.com/package/html-pdf) package.

## Instalation

First off, clone this repository. On the projec's root folder, install the dependencies:

```bash
npm install   // If you're using npm
yarn          // If you're using yarn
```

### Configure env

On your `config.html2pdf.js`, add your S3 bucket name to which the Lambda function will store the new files. Next, create an access token which will be required to print the PDF.

### AWS Lambda

Before deploying, make sure you have [serverless](https://serverless.com) installed in your machine. To configure the AWS Lambda server, on your project's root, run the Serverless command:

```bash
serverless deploy -v
```

> Make sure you have the appropriate user permission.

The upload should include the `node_modules` folder since you won't be able to pull in the modules from the server.

## Usage

To generate the PDF, send a POST request with the header `application/json` to your lambda's endpoint and a payload of:

```json
{
    "template": "<h1>Your HTML</h1>",
    "options": { ... }
}
```

The response will be a JSON object containing a link to the S3 file:

```json
{
  "url": "https://{ ACCOUNT }.s3.sa-east-1.amazonaws.com/{ FILE NAME }.pdf?X-Amz-Algorithm=xxx&X-Amz-Credential=xxx&X-Amz-Date=xxx&X-Amz-Expires=xxx&X-Amz-Security-Token=xxx&X-Amz-Signature=xxx&X-Amz-SignedHeaders=xxx"
}
```

> If you are using Windows or MacOS, you might get the error `html-pdf: Received the exit code '126'\n/var/task/node_modules/phantomjs-prebuilt/lib/phantom/bin/phantomjs: /var/task/node_modules/phantomjs-prebuilt/lib/phantom/bin/phantomjs: cannot execute binary file`. This means that the PhantomJS binary file included by npm is not compatible with the Amazon Linux. to fix this, go to the [PhantomJS download](http://phantomjs.org/download.html) page and download the Linux 64-bit file. After downloading and decompressing the file, copy the `./phantomjs-x.x.x-linux-x86_64/bin/phantomjs` to your project's `./node_modules/phantomjs-prebuilt/lib/phantom/bin` and overwrite the file.

## Options

As described on the [html-pdf](https://www.npmjs.com/package/html-pdf)'s repo, the available PDF options are:

```js
{
  // Export options
  "directory": "/tmp",       // The directory the file gets written into if not using .toFile(filename, callback). default: '/tmp'

  // Papersize Options: http://phantomjs.org/api/webpage/property/paper-size.html
  "height": "10.5in",        // allowed units: mm, cm, in, px
  "width": "8in",            // allowed units: mm, cm, in, px
  - or -
  "format": "Letter",        // allowed units: A3, A4, A5, Legal, Letter, Tabloid
  "orientation": "portrait", // portrait or landscape

  // Page options
  "border": "0",             // default is 0, units: mm, cm, in, px
  - or -
  "border": {
    "top": "2in",            // default is 0, units: mm, cm, in, px
    "right": "1in",
    "bottom": "2in",
    "left": "1.5in"
  },

  paginationOffset: 1,       // Override the initial pagination number
  "header": {
    "height": "45mm",
    "contents": '<div style="text-align: center;">Author: Marc Bachmann</div>'
  },
  "footer": {
    "height": "28mm",
    "contents": {
      first: 'Cover page',
      2: 'Second page', // Any page number is working. 1-based index
      default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
      last: 'Last Page'
    }
  },

  // Rendering options
  "base": "file:///home/www/your-asset-path", // Base path that's used to load files (images, css, js) when they aren't referenced using a host

  // Zooming option, can be used to scale images if `options.type` is not pdf
  "zoomFactor": "1", // default is 1

  // File options
  "type": "pdf",             // allowed file types: png, jpeg, pdf
  "quality": "75",           // only used for types png & jpeg

  // Script options
  "phantomPath": "./node_modules/phantomjs/bin/phantomjs", // PhantomJS binary which should get downloaded automatically
  "phantomArgs": [], // array of strings used as phantomjs args e.g. ["--ignore-ssl-errors=yes"]
  "script": '/url',           // Absolute path to a custom phantomjs script, use the file in lib/scripts as example
  "timeout": 30000,           // Timeout that will cancel phantomjs, in milliseconds

  // Time we should wait after window load
  // accepted values are 'manual', some delay in milliseconds or undefined to wait for a render event
  "renderDelay": 1000,

  // HTTP Headers that are used for requests
  "httpHeaders": {
    // e.g.
    "Authorization": "Bearer ACEFAD8C-4B4D-4042-AB30-6C735F5BAC8B"
  },

  // To run Node application as Windows service
  "childProcessOptions": {
    "detached": true
  }

  // HTTP Cookies that are used for requests
  "httpCookies": [
    // e.g.
    {
      "name": "Valid-Cookie-Name", // required
      "value": "Valid-Cookie-Value", // required
      "domain": "localhost",
      "path": "/foo", // required
      "httponly": true,
      "secure": false,
      "expires": (new Date()).getTime() + (1000 * 60 * 60) // e.g. expires in 1 hour
    }
  ]

}
```

## Testing

On the lambda's testing dropdown, click on __Configure test events__. On the "Configure test event" modal, add the following body content:

```json
{
  "body": "{\"template\": \"<h1>TEST</h1>\",\"options\": {}}"
}
```

Save your changes and run the test.

### Contributing

See the [Contributors Guide](/CONTRIBUTING.md)

## License

[MIT](/LICENSE.md)
