
var server_port             = 9091;
var speechreco_webhook_path = "/callback/wordRecognized"

if (process.argv.length < 4)
{
    console.log("Error!");
    console.log(" missing argument.");
    console.log(" node sample1.js <robowebapi sever> <client_token>");
    console.log("");
    return;
}

var os                  = require('os');
var express             = require('express');
var bodyParser          = require('body-parser');
var request             = require('request');

var ifaces = os.networkInterfaces();
var localIpAddress;

// Find local IP address
for (var dev in ifaces) {

    // ... and find the one that matches the criteria
    var iface = ifaces[dev].filter(function(details) {
        return details.family === 'IPv4' && details.internal === false;
    });

    if(iface.length > 0) localIpAddress = iface[0].address;
}

var call_url = process.argv[2].trim() + "/call/" + process.argv[3].trim();
var addWebhook_baseUrl = process.argv[2].trim() + "/addWebhook/" + process.argv[3].trim();
var callback_url = "http://" + localIpAddress + ":" + String(server_port) + speechreco_webhook_path;

var app = express();
app.use(bodyParser())

app.post(speechreco_webhook_path, function (req, res) {
    console.log(req.body);
    if ("value" in req.body && req.body.value.length >= 1)
    {
        word = req.body.value[0];
        confidence = req.body.value[1];


        if (confidence > 0.4)
        {
            if (word == "いぬ")
            {
                console.log("いぬが好き");
            }
            else if (word == "ねこ")
            {
                console.log("ねこが好き");
            }
    
            //音声認識を止める
            request({
                url: call_url, method: "POST",json: true,headers: {"content-type": "application/json",},
                json: { 
                    module: 'ALSpeechRecognition', method: 'unsubscribe',
                    params: ['reco1'], // <-- reco1 は音声認識セッションの識別子。subscribe の時の文字列と一致させる
                    module_id: 1}
            },function (err, res, body) {
                console.log(body);
                //終了
                process.exit();
                });
        }
    }

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.end("OK");                 

});


var server = app.listen(server_port, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("RoboWebAPI app listening at http://%s:%s", host, port)

});

// 言語モードを 日本語に
request({url: call_url, method: "POST",json: true,headers: { "content-type": "application/json",},
        json: { module: 'ALTextToSpeech', method: 'setLanguage',params: ['Japanese']}},function (err, res, body) { console.log(body);});

// 音声認識のワードリストを設定
request({
        url: call_url, method: "POST",json: true,headers: {"content-type": "application/json",},
        json: { 
            module: 'ALSpeechRecognition', method: 'setVocabulary',
            params: [['いぬ', 'ねこ'], false],
            module_id: 1}
    },function (err, res, body) {console.log(body);});

// 音声認識 Webhook 登録
request.get({url: addWebhook_baseUrl + "?key=WordRecognized&url=" + callback_url, json: true}
    ,function (err, res, body) {console.log(body);});

// 「犬と猫どっちが好き？」としゃべる
request({url: call_url, method: "POST",json: true,headers: {"content-type": "application/json",},
        json: { module: 'ALTextToSpeech', method: 'say',
        params: ['\\vct=135\\ 犬と猫どっちが好き？'],
        async: false}
    },function (err, res, body) {
        // say の実行結果が成功だったかどうか確認
        if (body && ("timeout" in body) && body.timeout == false && !("exception" in body))
        {
            // say が成功だった時、音声認識を開始する
            request({
                    url: call_url, method: "POST",json: true,headers: {"content-type": "application/json",},
                    json: { 
                        module: 'ALSpeechRecognition', method: 'subscribe',
                        params: ['reco1'],
                        module_id: 1}
                },function (err, res, body) {console.log(body);});
        }
});



