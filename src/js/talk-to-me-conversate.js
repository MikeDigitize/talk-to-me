let conversation = [];

const createSearch = function(searches) {
	return new RegExp(searches.reduce((text, term, i) => {
		if(i > 0) {
			text += '|';
		}
		text += `${term}s?`;
		return text;
	}, ''), 'i');
}

export class Conversate {
	conversate(matches) {
		this.getFirstMatchOnly = false;
		//this.match(matches);
		console.log(createSearch(Object.keys(matches)));
	}
}

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