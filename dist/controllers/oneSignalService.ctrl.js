require('dotenv').config();
const { json } = require('express/lib/response');
var https = require("https");
async function sendNotification(data, callback) {
    console.log("key->" + process.env.ONE_SIGNAL_API_KEY);
    let headers = {
        "Content-type": "application/json; charset=utf-8",
        "Authorization": "Basic " + process.env.ONE_SIGNAL_API_KEY
    };

    let options = {
        host: "onesignal.com",
        port: 443,
        path: "/api/v1/notifications",
        method: "POST",
        headers: headers
    };

    let req = https.request(options, function (res) {
        res.on("data", function (data) {
            console.log(data);
            return callback(null, JSON.parse(data));
        });
    });
    req.on("error", function (e) {
        return callback({
            message: e
        });
    });
    req.write(JSON.stringify(data));
    req.end();
}
module.exports = { sendNotification };