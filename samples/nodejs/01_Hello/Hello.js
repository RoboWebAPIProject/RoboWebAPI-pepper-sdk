
var request = require('request');

if (process.argv.length < 4)
{
	console.log("Error!");
	console.log(" missing argument.");
	console.log(" node Hello.js <robowebapi sever> <client_token>");
	console.log("");
	return;
}

var url = process.argv[2].trim() + "/call/" + process.argv[3].trim();

/*
 * 言語モードを 日本語に
 */
request({
	    url: url, method: "POST",json: true,
	    headers: {
	        "content-type": "application/json",
	    },
	    json:
			{ 
	    		module: 'ALTextToSpeech', 
	    		method: 'setLanguage',
	    		params: ['Japanese']
	    	}
	},
    function (err, res, body) {
        console.log(body);
    });

/*
 * 「こんにちは」としゃべる
 */
request({
	    url: url, method: "POST",json: true,
	    headers: {
	        "content-type": "application/json",
	    },
	    json:
			{ 
	    		module: 'ALTextToSpeech', 
	    		method: 'say',
	    		params: ['こんにちは']
	    	}
	},
    function (err, res, body) {
        console.log(body);
    });

