const { google } = require("googleapis");
const MESSAGING_SCOPE = "https://www.googleapis.com/auth/firebase.messaging";
const SCOPES = [MESSAGING_SCOPE];
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const request = require("request");
const router = express.Router();
const dotenv  = require("dotenv")
dotenv.config()

const port = process.env.PORT || 3000;;

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send({
      status:200,
      results:'haii -_-'
  });
});

router.post('/send', (req,resp) => {

  getAccessToken().then(acces_token => {
    const title = req.body.title
    const body = req.body.body
    const token = req.body.token

    request.post({
      headers: {
        authorization : `Bearer ${acces_token}`
      },
      url: 'https://fcm.googleapis.com/v1/projects/wgther-b4fc3/messages:send',
      body: JSON.stringify(
        {"message": {
          "token": token,
          "notification": {
            "title": title,
            "body": body
          }
        }
      }
      )
    }, function(error, response, body){
      resp.end(body);
    })
  })
})

router.get('/get-token', (req,resp) => {
  getAccessToken().then(acces_token => {
    resp.end(acces_token)
  })
})


app.use('/api', router);

app.listen(port, () => {
    console.log("starting "+ port)
})

function getAccessToken() {
    return new Promise(function(resolve, reject) {
      const key = require('./service-account.json');
      const jwtClient = new google.auth.JWT(
        key.client_email,
        null,
        process.env.data_private_key,
        SCOPES,
        null
      );
      jwtClient.authorize(function(err, tokens) {
        if (err) {
          reject(err);
          return;
        }
        resolve(tokens.access_token);
      });
    });
  }
