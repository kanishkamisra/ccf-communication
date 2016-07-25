var express = require('express'),
	twilio = require('twilio'),
	json = require('json'),
	bodyParser = require('body-parser'),
	path = require('path'),
	fs = require('fs');

var phone = require('../phonetree.json'),
	phonetest = require('../phonetest.json'),
	recruiter = require('../recruiter.json')

var app = express();
app.use(bodyParser.urlencoded({ 
	extended: true 
}));

app.use('/', express.static(__dirname + '/public'));

// var auth='AUTH_TOKEN';
var auth='91c4b91672fd9b9f4b4d4bd18446d090';

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + "/public/index.html"));
});

app.post('/text', function(req, res) {
	if(twilio.validateExpressRequest(req, auth)) {
		var receiver='RECEIVER_NUMBER'
		var twiml = new twilio.TwimlResponse();
		var message = req.body.Body;
		// console.log(req.body.From)
		for (var i in phonetest) {
			if (req.body.From === phonetest[i].Phone){
				// console.log(phone[i].Phone)
				// console.log("1")
				// if(i === 'Kanishka') {
				// 	receiver = phone["Kanishka"].Phone;
				// }
				// else if (i != 'Kanishka') {
				// 	receiver = phone[phone[i].ReportsTo].Phone;
				// }
				manager_status = phonetest[phonetest[i].ReportsTo].Status;
				manager_reports_to = phonetest[phonetest[i].ReportsTo].ReportsTo;
				manager_reports_to_number = phonetest[manager_reports_to].Phone

				if(manager_status === 'free') {
					receiver = phonetest[phonetest[i].ReportsTo].Phone;
					console.log(receiver);

					message = message + " Message sent by " + i + "\n Number = " + req.body.From;
				}
				else {
					receiver = manager_reports_to_number;
					console.log(receiver);
					message = message + " Message sent by " + i + "\n Number = " + req.body.From;
				}


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
		for (var i in phonetest) {
			if (req.body.From === phonetest[i].Phone){
				// console.log(phone[i].Phone)
				// console.log("1")
				// if(i === 'Kanishka') {
				// 	receiver = phone["Kanishka"].Phone;
				// }
				// else if (i != 'Kanishka') {
				// 	receiver = phone[phone[i].ReportsTo].Phone;
				// }
				manager_status = phonetest[phonetest[i].ReportsTo].Status;
				manager_reports_to = phonetest[phonetest[i].ReportsTo].ReportsTo;
				manager_reports_to_number = phonetest[manager_reports_to].Phone

				if(manager_status === 'free') {
					receiver = phonetest[phonetest[i].ReportsTo].Phone;
					console.log(receiver);
				}
				else {
					receiver = manager_reports_to_number;
					console.log(receiver);
				}
			}

			else {
				receiver = phonetest['David'];
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
	var s = req.body.status;

	phone[n] = {
		"ReportsTo": r,
		"Phone": p,
		"Status": s
	}

	fs.writeFileSync("../phonetest.json", JSON.stringify(phone));
});

app.post("/addRecruiter", function(req, res) {
	res.sendFile(path.join(__dirname + "/public/index.html"))

	var n = req.body.recruiterName;
	var c = req.body.recruiterCompany;
	var p = req.body.recruiterPhone;

	recruiter[c] = {
		"Name": n,
		"Phone": p
	}

	fs.writeFileSync("../recruiter.json", JSON.stringify(recruiter));
});


//test
// app.get('/test', function(req, res) {
// 	console.log(phone);
// })

app.listen(4567, function() {
	console.log("listening on port 4567");
});
