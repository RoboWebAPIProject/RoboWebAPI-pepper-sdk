
var request = require('request');
var async   = require('async');

if (process.argv.length < 4)
{
    console.log("Error!");
    console.log(" missing argument.");
    console.log(" node AnimatedHello.js <robowebapi sever> <client_token>");
    console.log("");
    return;
}

var url = process.argv[2].trim() + "/call/" + process.argv[3].trim();

 async.series([

    // お辞儀をする
    function ( callback ){
        request({
                url: url, method: "POST",json: true,
                headers: {
                    "content-type": "application/json",
                },
                json:
                    { 
                        module: 'ALAnimationPlayer', 
                        method: 'run',
                        params: ['animations/Stand/Gestures/BowShort_1'],
                        module_id: 1
                    }
            },
            function (err, res, body) {
                console.log(body);
                callback( null, 'arg1' );
            });
         },
     
     // 挨拶をする
     function ( callback ){
        request({
                url: url, method: "POST",json: true,
                headers: {
                    "content-type": "application/json",
                },
                json:
                    { 
                        module: 'ALAnimatedSpeech', 
                        method: 'say',
                        params: ['\\vct=135\\ \\RSPD=110\\ ^start(animations/Stand/Gestures/Me_7)こんにちは。Pepper ^wait(animations/Stand/Gestures/Me_7)です。 '],
                        module_id: 1
                    }
            },
            function (err, res, body) {
                console.log(body);
                callback( null, 'arg2' );
            });
        },

],function(err, result){
});
