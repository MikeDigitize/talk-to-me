let hasFoundMatch = false;

const searchText = function(searchResults) {

	return searchResults.reduce((matches, result) => {

		this.searchTerms.forEach((term, i) => {

			let searchFor = Object.keys(this.searchTerms[i])[0];
			let regex = new RegExp(`${searchFor}s?`, 'ig');
			let transcript = result.transcript;
			let found = transcript.match(regex);

			if(found) {
				matches.push({ match : this.searchTerms[i], term : transcript });			    
		    }

    	});

    	return matches;

	}, []);

}

const findMatches = function(evt) {

	let { results, isFinalResult } = evt;

	if(!hasFoundMatch) {
		findMatch.call(this, evt);
	}

	if(hasFoundMatch && !this.getFirstMatchOnly) {
		findMatch.call(this, evt);
	}

};

const findMatch = function(evt) {

	let { results, isFinalResult } = evt;
	let noOfTermsToSearchFor = this.searchTerms.length;
	let matches = searchText.call(this, results);

	console.log(matches)

	// let alreadyFound = matches.reduce((found, match) => {
	// 	if(Object.keys(match)[0].term === searchFor) {
	// 		found = true;
	// 	}
	// 	return found;
	// }, false);

	// if(!alreadyFound) {
	// 	let term = Object.keys(this.searchTerms[i])[0];
	// 	let callback = this.searchTerms[i][term];
	// 	matches.push({ term, callback });
	// }

	// if(matches.length) {
	// 	hasFoundMatch = true;
	// 	if(this.getFirstMatchOnly) {
	// 		//matches[0].callback.call(this, match.term, evt);
	// 	}
		
	// }	

	// if(isFinalResult) {
	// 	if(!hasFoundMatch) {
	// 		this.noMatchFound.call(this, results);
	// 	}
	// 	else if(!this.getFirstMatchOnly) {
	// 		match.callback.call(this, matchedTerms, evt);
	// 	}
	// 	hasFoundMatch = false;
	// }

}

const resultMatcher = function(evt) {
	if(this.support && this.searchTerms.length) {
		findMatches.call(this, evt);
	}
};

const noMatch = function() {
	this.throwWarning('Sorry no matches found, try again?');
}; 

export class Matcher {

	match(matches = {}) {
		if(this.support) {

			if(typeof matches !== 'object' || !Object.keys(matches).length){
				this.throwWarning('match expects an object with a key term and a callback value.');
				return;
			}

			let searchTerms = Object.keys(matches);
			let searches = searchTerms.map(term => {
				let obj = {};
				obj[term] = matches[term];
				return obj;
			});

			if(!this.searchTerms) {
				this.searchTerms = [];
				this.on('result', resultMatcher.bind(this));
			}

			this.searchTerms = this.searchTerms.concat(searches);
			this.onNoMatch();

		}
	}

	onNoMatch(callback = noMatch) {
		if(this.support) {
			this.noMatchFound = callback.bind(this);
		}
	}

	removeMatchTerm(term) {
		this.searchTerms = this.searchTerms.filter(searchItem => Object.keys(searchItem) !== term);
	}

}