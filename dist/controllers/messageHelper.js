var axios = require('axios');
const { response } = require('express');
require('dotenv').config();
async function whatsappSend(req, res) {
  var data = await getTextMessageInput(process.env.RECIPIENT_WAID, 'Welcome to the Movie Ticket Demo App for Node.js!');
  await sendMessage(data).then(function (response) {
    res.sendStatus(200);
  }).catch(function (error) {
    console.log(error);
    console.log(error.response.data);
    res.sendStatus(500);
    return;
  });
}

async function sendMessage(data) {
  var config = {
    method: 'post',
    url: `https://graph.facebook.com/${process.env.VERSION}/${process.env.PHONE_NUMBER_ID}/messages`,
    headers: {
      'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
      'Content-Type': 'application/json'
    },
    data: data
  };
  const respon = await axios(config);
  console.log(respon);
  return response;
}

function getTextMessageInput(recipient, text) {
  return JSON.stringify({
    "messaging_product": "whatsapp",
    "preview_url": false,
    "recipient_type": "individual",
    "to": "584149021809",
    "type": "text",
    "text": {
      "body": text
    }
  });
}

function getTemplatedMessageInput(recipient, movie, seats) {
  return JSON.stringify({
    "messaging_product": "whatsapp",
    "to": recipient,
    "type": "template",
    "template": {
      "name": "hello_world",
      "language": {
        "code": "en_US"
      },
      "components": [{
        "type": "header",
        "parameters": [{
          "type": "image",
          "image": {
            "link": movie.thumbnail
          }
        }]
      }, {
        "type": "body",
        "parameters": [{
          "type": "text",
          "text": movie.title
        }, {
          "type": "date_time",
          "date_time": {
            "fallback_value": movie.time
          }
        }, {
          "type": "text",
          "text": movie.venue
        }, {
          "type": "text",
          "text": seats
        }]
      }]
    }
  });
}

module.exports = {
  sendMessage: sendMessage,
  getTextMessageInput: getTextMessageInput,
  getTemplatedMessageInput: getTemplatedMessageInput,
  whatsappSend
};