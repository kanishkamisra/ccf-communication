// var volunteers = require('../../../../phonetree.json')
var volunteers = require('../../../../phonetree.json')

$(document).ready(function(){
	for(i in volunteers){
	  	var row$ = $('<tr/>');
	    row$.append($('<td/>').html(i));
	    $('#volunteerData').append(row$);
	}
});