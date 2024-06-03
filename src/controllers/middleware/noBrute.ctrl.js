const rateLimit = require("express-rate-limit");

 function bruteLimiter (req,res,next){  
    //app.set('trust proxy', 1);
     rateLimit({
        windowMs: 60 * 60 * 1000, // 1 hour window
        max: 50, // start blocking after 50 requests
        message:
        "Too many accounts created from this IP, please try again after an hour"
    });
 }
 const notBruteSecure =rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min  15 * 60 * 1000
    max: 500000, // start blocking after 50 requests
    message:
    "Excediste el limite de peticiones, debe esperar una hora intentar nuevamente ",
    handler:
    function (req, res, /*next*/) {
        //res.status(options.statusCode).send(options.message);
        res.json({"data":{"result":false,"message":"Excediste el limite de peticiones, debe esperar una hora intentar nuevamente"}})
    }
});
module.exports={bruteLimiter,notBruteSecure};