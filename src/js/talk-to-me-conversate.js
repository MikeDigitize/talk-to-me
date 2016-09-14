let conversation = [];

export class Conversate {
	conversate(matches) {
		this.getFirstMatchOnly = false;
		this.match(matches);
	}
}

/*

var answers = {
	
}

var start = {
	prompt : "What kind of appliance are you looking for?",
	listenFor : ["washing machine", "TV","freezer"],
	success : next,
	fail : "Sorry, I didn't understand that. Try again!",
	found : false
};

var next = {
	prompt : "Ok so you're looking for a ${answers[0]}, any particular brand?",
	listenFor : ["hotpoint","sony","samsung"],
	success : next,
	fail : "Sorry, I didn't understand that. Try again!"
};

initiate a conversation

"what products are you looking for?"

possible answers:

"washing machine"
"TV"
"freezer"

reply:

"Ok so you're interested in a ${answer}.
Any particular brand?"

possible answers:

"yes"
"no"
"hotpoint"
"sony"
"samsung"





top level object

{
	depth : 1 // the amount of questions
	questions : [{
		question : 'What would you like to shop for?',
		answers : {
			name : ['washing machine', 'TVs']
			verbs : [
				{
					pronoun : 'you',
					verb : 'show'
				}, 
				{
					pronoun : 'you',
					verb : ['info', 'information']
				}
			],
			onMatch : function(evt) {
				console.log('Do you want us to ${verb} ${pronoun} ${results} or ')	
			}
		}
	}]
}




*/