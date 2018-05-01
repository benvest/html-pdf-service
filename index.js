const http = require('http'),
    path = require('path'),
    os = require('os'),
    fs = require('fs'),
    puppeteer = require('puppeteer'),
    Busboy = require('busboy'),
    bodyParser = require('body-parser'),
    express = require('express');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/generate', (req, res, nxt) => {
  const busboy = new Busboy({ headers: req.headers });
  var fname;
  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    fname = filename.split('.')[0]
    const saveTo = path.join(__dirname, 'public', filename);
    file.pipe(fs.createWriteStream(saveTo));
  });
  busboy.on('finish', () => {
    (async () => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto('file:///'+path.join(__dirname, 'public', fname+'.html'), {waitUntil: 'networkidle2'});
      await page.pdf({path: path.join(__dirname, 'public', fname+'.pdf'), format: 'A4'});
      res.sendFile(path.join(__dirname, 'public', fname+'.pdf'))
      await browser.close();
      res.end("Generated pdf");
    })();
  });
  return req.pipe(busboy);
});


app.listen(3000, () => console.log('Example app listening on port 3000!'))
