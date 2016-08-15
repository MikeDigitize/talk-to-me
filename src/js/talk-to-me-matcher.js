let hasFoundMatch = false;
let createSearches;
let onResultCallback;

const resultMatcher = function(evt) {
	if(this.support && Object.keys(this.searchForThese).length) {
		findMatches.call(this, evt);
	}
};

const createSearchObject = function(searches, search) {
	let searchResults = {};
	searchResults.term = search;
	searchResults.results = [];
	searchResults.callback = searches[search];
	searchResults.callbackUsed = false;
	searchResults.regex = new RegExp(`${search}`, 'i');
	return searchResults;
};

const addToSearch = function() {
	let records = {};
	return searches => {
		Object.keys(searches).forEach(search => {
			if(!records[search]) {
				records[search] = createSearchObject(searches, search);
			}
		});		
		return records;
	}
}

const findMatches = function(evt) {

	let { results, isFinalResult } = evt;

	if(!hasFoundMatch) {
		findMatch.call(this, evt);
	}
	else if(!this.getFirstMatchOnly) {
		findMatch.call(this, evt);
	}
	else {
		this.off('result', onResultCallback);
		this.on('result', onResultCallback);	
		hasFoundMatch = false;
		// empty results array from each
		return;
	}

	if(isFinalResult && !hasFoundMatch) {
		this.noMatchFound();
	}

};

const findMatch = function(evt) {

	let noOfTermsToSearchFor = this.searchForThese.length;
	
	this.searchForThese = Object.assign({}, searchText.call(this, evt));

	Object.keys(this.searchForThese).forEach(key => {

		let { results, callbackUsed } = this.searchForThese[key];

		if(results.length && !callbackUsed) {
			let { term, results } = this.searchForThese[key];
			this.searchForThese[key].callback.call(this, { term, results, isFinalResult : evt.isFinalResult });
			this.searchForThese[key].callbackUsed = true;
			hasFoundMatch = true;
		}

	});

}

const searchText = function(evt) {

	return Object.keys(this.searchForThese).reduce((results, key) => {

		if(!results[key].results.length) {

			let match = evt.results.filter(result => {
				return result.transcript.match(results[key].regex);
			});

			if(match.length) {
				results[key].results.push(match[0]);
			}

		}	

		return results;

	}, this.searchForThese);

};

const noMatch = function() {
	this.throwWarning('Sorry no matches found, try again?');
}; 

export class Matcher {

	match(searches = {}) {
		if(this.support) {

			if(typeof searches !== 'object' || !Object.keys(searches).length){
				this.throwWarning('match expects an object with a key term and a callback value.');
				return;
			}

			if(!this.searchForThese) {
				createSearches = addToSearch();
				onResultCallback = resultMatcher.bind(this);
				this.on('result', onResultCallback);
			}
			
			this.searchForThese = createSearches(searches);
			
			if(!this.noMatchFound) {
				this.onNoMatch();
			}	

			return true;		

		}
	}

	onNoMatch(callback = noMatch) {
		if(this.support) {
			this.noMatchFound = callback.bind(this);
		}
		return true;
	}

	removeMatchTerm(term) {
		delete this.searchForThese[term];
	}

}