# ccf-communication
Communication System made for aitp CCF-Fall'16

This system allows hierarchy based routing of phone calls and messages. The phonetree looks something like this:

```{
	"Manager Name" {
		"ReportsTo": "His/Her manager's name",
		"Phone": "+12345678910"
	}
}```

## Dependencies:
* ngrok
* nodemon(optional)
* node

## Running the app

Use nodemon to run the node server so that you dont have to reload the server everytime you make a change.
```nodemon```

I used ngrok to test the twiml logic so that the routing of phone calls and messages is easy.
```ngrok http 4567```

