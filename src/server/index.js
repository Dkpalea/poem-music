const express = require('express');
const fs = require('fs');
const os = require('os');

const app = express();
let poem;

try {
  poem = fs.readFileSync('generated-poem.txt', 'utf8');
  // console.log(data);
} catch(e) {
  console.log('Error:', e.stack);
}

app.use(express.static('dist'));
// app.get('/api/getUsername', (req, res) => res.send({ username: os.userInfo().username }));
app.get('/api/getPoem', (req, res) => res.send({ poem }));


app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));
