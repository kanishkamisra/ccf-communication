var express = require('express'),
	twilio = require('twilio'),
	json = require('json'),
	bodyParser = require('body-parser'),
	path = require('path'),
	fs = require('fs');

var phone = require('../phonetree.json')

var app = express();
app.use(bodyParser.urlencoded({ 
	extended: true 
}));

var auth='AUTH_TOKEN';

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + "/public/index.html"));
});

app.post('/text', function(req, res) {
	if(twilio.validateExpressRequest(req, auth)) {
		var receiver='RECEIVER_NUMBER'
		var twiml = new twilio.TwimlResponse();
		var message = req.body.Body;
		// console.log(req.body.From)
		for (var i in phone) {
			if (req.body.From === phone[i].Phone){
				// console.log(phone[i].Phone)
				// console.log("1")
				// if(i === 'Kanishka') {
				// 	receiver = phone["Kanishka"].Phone;
				// }
				// else if (i != 'Kanishka') {
				// 	receiver = phone[phone[i].ReportsTo].Phone;
				// }
				receiver = phone[phone[i].ReportsTo].Phone;
				console.log(receiver);

				message = message + " Message sent by " + i + "\n Number = " + req.body.From;
			}

			// else {
			// 	console.log("else " + i)
			// 	receiver = "";
			// }
		}

		twiml.message(message, {
			to: receiver
		});

		res.type('text/xml');
		res.send(twiml.toString());
		console.log("Message sent to number: " + receiver);
		console.log("*" + req.body.From+"*");
	}
	else {
		res.send('Invalid Request');
		console.log('Request messed up.');
	}
});

app.post('/call', function(req, res) {
	if(twilio.validateExpressRequest(req, auth)) {
		var receiver = 'RECEIVER_NUMBER';
		var twiml = new twilio.TwimlResponse();
		for (var i in phone) {
			if (req.body.From === phone[i].Phone){
				// console.log(phone[i].Phone)
				// console.log("1")
				// if(i === 'Kanishka') {
				// 	receiver = phone["Kanishka"].Phone;
				// }
				// else if (i != 'Kanishka') {
				// 	receiver = phone[phone[i].ReportsTo].Phone;
				// }
				receiver = phone[phone[i].ReportsTo].Phone;
				console.log(receiver);

				// message = message + " Message sent by " + i + "\n Number = " + req.body.From;
			}

			else {
				//add status = busy functionality
				receiver = phone['David'];
			}
		}

		console.log(req.body)
		twiml.dial(receiver,{
			from: '+18608650025'
		});

		res.type('text/xml');
		res.send(twiml.toString());
		console.log("Calling " + receiver);
	}
	else {
		res.send('Invalid Request');
		console.log('Request messed up son');
	}
});

app.post("/log", function(req, res) {
	
	res.sendFile(path.join(__dirname + "/public/index.html"));

	var n = req.body.name;
	var r = req.body.reports;
	var p = req.body.phone;

	phone[n] = {
		"ReportsTo": r,
		"Phone": p
	}

	fs.writeFileSync("../phonetest.json", JSON.stringify(phone));
});

//testing
// app.get('/test', function(req, res) {
// 	console.log(phone);
// })

app.listen(4567, function() {
	console.log("listening on port 4567");
});
