
var server_port             = 9091;
var speechreco_webhook_path = "/callback/wordRecognized"

if (process.argv.length < 4)
{
    console.log("Error!");
    console.log(" missing argument.");
    console.log(" node ListenAndResponse.js <robowebapi sever> <client_token>");
    console.log("");
    return;
}

var os                  = require('os');
var express             = require('express');
var bodyParser          = require('body-parser');
var request             = require('request');
var async               = require('async');

var ifaces = os.networkInterfaces();
var localIpAddress;

// Find local IP address
for (var dev in ifaces) {

    var iface = ifaces[dev].filter(function(details) {
        return details.family === 'IPv4' && details.internal === false;
    });

    if(iface.length > 0) localIpAddress = iface[0].address;
}

var call_url = process.argv[2].trim() + "/call/" + process.argv[3].trim();
var addWebhook_baseUrl = process.argv[2].trim() + "/addWebhook/" + process.argv[3].trim();
var callback_url = "http://" + localIpAddress + ":" + String(server_port) + speechreco_webhook_path;



async.series([

    function ( callback ){
        // 言語モードを 日本語に
        request({url: call_url, method: "POST",json: true,headers: { "content-type": "application/json",},
                json: { module: 'ALSpeechRecognition', method: 'setLanguage',params: ['Japanese']}},function (err, res, body) { callback( null, 'arg1' );});
    },

    function ( callback ) {
        // 音声認識のワードリストを設定
        request({url: call_url, method: "POST",json: true,headers: {"content-type": "application/json",},
                json: { 
                    module: 'ALSpeechRecognition', method: 'setVocabulary',
                    params: [['いぬ', 'ねこ'], false],
                    module_id: 1}},
                function (err, res, body) { callback( null, 'arg2' );})
    },

    function ( callback ) {
        // 音声認識 Webhook 登録
        request.get({url: addWebhook_baseUrl + "?key=WordRecognized&url=" + callback_url, json: true},
                function (err, res, body) { callback( null, 'arg3' );})
    },

    function ( callback ) {
        // 「犬と猫どっちが好き？」としゃべる
        request({url: call_url, method: "POST",json: true,headers: {"content-type": "application/json",},
            json: { module: 'ALAnimatedSpeech', method: 'say',
            params: ['\\vct=135\\ 犬と猫どっちが好き？'],
            async: false}},
            function (err, res, body) { callback( null, 'arg4' );})
    },

    function ( callback ) {
        // 音声認識を開始する
        request({url: call_url, method: "POST",json: true,headers: {"content-type": "application/json",},
            json: { module: 'ALSpeechRecognition', method: 'subscribe',
                    params: ['reco1'],
                    module_id: 1}},
            function (err, res, body) { callback( null, 'arg5' );})
    }
]);

/******
 * Webhook URL の処理
 *****/
var app = express();
app.use(bodyParser())

app.post(speechreco_webhook_path, function (req, res) {
    if ("value" in req.body && req.body.value.length >= 1)
    {
        word = req.body.value[0];
        confidence = req.body.value[1];

        var pref = "";
        if (confidence > 0.4) {
            if (word == "いぬ") {
                console.log("\n**************\n主はいぬが好き");
                pref = "dog";
            }
            else if (word == "ねこ") {
                console.log("\n**************\n主はねこが好き");
                pref = "cat";
            }
    
            if (pref != "") {
                 async.series([
                    function ( callback ){
                        //音声認識を止める
                        request({ url: call_url, method: "POST",json: true,headers: {"content-type": "application/json",},
                                  json: { module: 'ALSpeechRecognition', method: 'unsubscribe',
                                          params: ['reco1'], // <-- reco1 は音声認識セッションの識別子。subscribe の時の文字列と一致させる
                                          module_id: 1}},
                                    function (err, res, body) { callback( null, 'arg_r1' );});
                            },

                    function ( callback ) {
                        //音声認識結果で反応を分岐
                        if (pref == "dog") {
                            // 「わんわん」としゃべる
                            request({url: call_url, method: "POST",json: true,headers: {"content-type": "application/json",},
                                json: { module: 'ALAnimatedSpeech', method: 'say',
                                params: ['\\vct=150\\ わんわん'],
                                async: false}},
                                function (err, res, body) { callback( null, 'arg_r21' );})
                        } else if (pref == "cat") {
                            // 「にゅあにゃあ」としゃべる
                            request({url: call_url, method: "POST",json: true,headers: {"content-type": "application/json",},
                                json: { module: 'ALAnimatedSpeech', method: 'say',
                                params: ['\\vct=180\\ にゃあにゃああ'],
                                async: false}},
                                function (err, res, body) { callback( null, 'arg_r22' );})
                        }
                    }
                ],function(err, result){
                    process.exit();
                });
            }
        }
    }

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.end("OK");                 

});

var server = app.listen(server_port, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Listening webhook url at http://%s:%s", host, port)

});

