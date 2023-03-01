const { google } = require("googleapis");
const MESSAGING_SCOPE = "https://www.googleapis.com/auth/firebase.messaging";
const SCOPES = [MESSAGING_SCOPE];
const http = require("http");


function getAccessToken() {
    return new Promise(function(resolve, reject) {
      const key = require('./service-account.json');
      const jwtClient = new google.auth.JWT(
        key.client_email,
        null,
        key.private_key,
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

  
  const server = http.createServer((req,res) => {
      getAccessToken().then(token => {
        res.end(token)
      })
  })

  server.listen(3000, () => {
    console.log("server starting")
  })