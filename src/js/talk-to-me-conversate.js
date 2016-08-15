let conversation = [];

export class Conversate {
	conversate(matches) {
		// this.getFirstMatchOnly = false;
		this.match(matches);
	}
}

// const createSearch = function() {
// 	return new RegExp(this.searchFor.reduce((text, term, i) => {
// 		if(i > 0) {
// 			text += '|';
// 		}
// 		text += `${Object.keys(term)[0]}s?`;
// 		return text;
// 	}, ''), 'i');
// }

/*

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