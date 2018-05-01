### Running

`npm install`

`node index.js`

#### In another terminal

`echo '<html><body>hello</body></html>' > test.html`

`curl -v -F file=@test.html http://localhost:3000/generate > test.pdf`

`open test.pdf`
