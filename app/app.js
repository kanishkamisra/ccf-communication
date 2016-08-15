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

var auth='AUTH_TOKEN';
var sid='TWILIO_SID';

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + "/public/index.html"));
});

app.get('/home', function(req, res){
	res.sendFile(path.join(__dirname + "/public/landing.html"))
});

//ui-test route
app.get('/uitest', function(req, res){
	res.sendFile(path.join(__dirname + "/public/ui-test.html"))
});

app.post('/text', function(req, res) {
	if(twilio.validateExpressRequest(req, auth)) {
		var receiver = 'RECEIVER_NUMBER'
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

				if(manager_status === 'free' || manager_status === 'Free') {
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

				if(manager_status === 'free' || manager_status === 'Free') {
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

	phonetest[n] = {
		"ReportsTo": r,
		"Phone": p,
		"Status": s
	}

	fs.writeFileSync("../phonetest.json", JSON.stringify(phonetest));

	fs.appendFile("../numbers.txt", "\n" + p, function(err){
		if(err) {
			console.log(err);
		}
	});
});

app.post("/addRecruiter", function(req, res) {
	res.sendFile(path.join(__dirname + "/public/index.html"))

	var n = req.body.recruiterName;
	var c = req.body.recruiterCompany;
	var p = req.body.recruiterPhone;

	recruiter[n] = {
		"Company": c,
		"Phone": p
	}

	fs.writeFileSync("../recruiter.json", JSON.stringify(recruiter));
	fs.appendFile("../recruiterNumbers.txt", p, function(err){
		if(err){
			console.log(err);
		}
	});
	// Add recruiter numbers to numbers.txt file
	// fs.appendFile("../numbers.txt", p, function(err) {
	// 	if(err){
	// 		console.log(err)
	// 	}
	// });
});


app.post("/changeStatus", function(req, res){
	res.sendFile(path.join(__dirname + "/public/index.html"))

	// var statusTest = require("../status-test.json")
	var phoneTest = require("../phonetest.json")

	var n = req.body.volunteerName;
	var s = req.body.volunteerStatus;

	n = n[0].toUpperCase() + n.slice(1);
	// test if it works
	// console.log("Name: " + n + " Status: " + s)
	// It works!

	phoneTest[n].Status = s;
	console.log(n+"\'s status is now " + phoneTest[n].Status)
	// phonetest[n].Status = s
	// console.log(statusTest[n])
	fs.writeFileSync("../phonetest.json", JSON.stringify(phoneTest));
	console.log("fml")

});

app.post('/sendMassTexts', function(req, res) {

	res.sendFile(path.join(__dirname + "/public/index.html"))
	var client = new twilio.RestClient(sid, auth);

	var volunteerNumbers = fs.readFileSync("../numbers.txt").toString().split('\n')
	var recruiterNumbers = fs.readFileSync("../recruiterNumbers.txt").toString().split('\n')

	if(req.body.messageList === "Volunteers"){
		for(var n in volunteerNumbers){
			client.messages.create({
				body: req.body.textMessage,
				to: volunteerNumbers[n],
				from: "+18608650052"
			}, function(err, message){
				if(err) {
					console.error(err.message);
				}
			});
		}
	}

	else if(req.body.messageList === "Recruiters"){
		for(var n in recruiterNumbers){
			client.messages.create({
				body: req.body.textMessage,
				to: recruiterNumbers[n],
				from: "+18608650052"
			}, function(err, message){
				if(err) {
					console.error(err.message);
				}
			});
		}
	}
})


//test
// app.get('/test', function(req, res) {
// 	console.log(phone);
// })

app.listen(4567, function() {
	console.log("listening on port 4567");
});
