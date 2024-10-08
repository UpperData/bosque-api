const oneSignalService = require('./oneSignalService.ctrl');

oneSignalSend = (req, res, next) => {
    const { msj, title, largeIcon } = req.body;
    var message = {
        app_id: process.env.ONE_SIGNAL_APP_ID,
        contents: {
            en: msj

        },
        headings: {
            en: title
        },
        subtitle: {
            "en": "Puedes hacer tu pedido"
        },
        large_icon: largeIcon,
        // android_accent_color: "FFFFFF00000",
        small_icon: "ic_stat_onesignal_default",
        included_segments: ["Active Subscriptions"],
        // content_available:true,
        // small_icon:"ic_notification_icon",
        data: {
            PushTitle: "Bosque Marino"
        }

    };
    oneSignalService.sendNotification(message, (error, results) => {
        if (error) return next(error);
        return res.status(200).send({
            message: "Success",
            data: results
        });
    });
};
module.exports = { oneSignalSend };