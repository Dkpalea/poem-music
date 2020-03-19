const express = require('express');
const fs = require('fs');
const os = require('os');
const axios = require('axios');
const bodyParser =require('body-parser');

const app = express();
let poem;

app.use(express.static('dist'));
app.use(bodyParser.json());
app.post('/api/getPoem', (req, res) => {
  console.log(req.body.poemPrompt);
  try {
    //read poem file
    poem = fs.readFileSync('generated-poem.txt', 'utf8');
    // trim poem to 550 char (max length for api)
    // 50 for now
    poem = poem.substr(0, 550);

    // disabled for now
    // // post to voice api
    // axios.post('https://streamlabs.com/polly/speak', {
    //   voice: 'Justin',
    //   text: poem,
    // })
    //   .then((apiResponse) => {
    //     // console.log(apiResponse.data.speak_url);
    //     // send data to frontend
    //     res.send({ poem, apiResponseUrl: apiResponse.data.speak_url, });
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });

    res.send({ poem, apiResponseUrl: 'abc123', });

  } catch(e) {
    console.log('Error:', e.stack);
  }
});

app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));
