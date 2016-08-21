let hasFoundMatch = false;
let createSearches;
let onResultCallback;

const resultMatcher = function(evt) {

	let { isFinalResult } = evt;

	if (!hasFoundMatch || !this.getFirstMatchOnly) {
		findMatches.call(this, evt);
	}	
	else if(hasFoundMatch) {
		resetFindMatches.call(this);
	}
	
};

const resetFindMatches = function() {

	this.off('result', onResultCallback);
	this.searchForThese = emptyResults.call(this);	
	hasFoundMatch = false;
	this.on('result', onResultCallback);	

};

const createSearchObject = function(searches, search) {

	let regex = search.lastIndexOf('s') === search.length - 1 ? `${search}?` : search;
	regex = new RegExp(`${regex}`, 'i');

	return {
		term : search,
		results : [],
		callback : searches[search],
		callbackUsed : false,
		regex : regex
	};

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

	if(isFinalResult) {
		if(hasFoundMatch) {
			resetFindMatches.call(this);
		}
		else {
			this.noMatchFound();
		}		
	}

};

const findMatch = function(evt) {
	
	this.searchForThese = Object.assign({}, searchText.call(this, evt));
	fireResults.call(this, evt.isFinalResult);	

};

const searchText = function(evt) {

	return Object.keys(this.searchForThese).reduce((results, key) => {

		let match = evt.results.filter(result => {
			return result.transcript.match(results[key].regex);
		});

		if(match.length) {
			results[key].results = results[key].results.concat(match[0]);
			hasFoundMatch = true;
		}	

		return results;

	}, this.searchForThese);

};

const fireResults = function(isFinalResult) {

	Object.keys(this.searchForThese).forEach(key => {

		let { results, callbackUsed } = this.searchForThese[key];

		if(results.length && !callbackUsed) {

			let { term, results } = this.searchForThese[key];

			this.searchForThese[key].callbackUsed = true;
			this.searchForThese[key].callback.call(this, { 
				term, 
				results, 
				isFinalResult
			});			

		}

	});

}

const emptyResults = function() {

	return Object.keys(this.searchForThese).reduce((searchForThese, key) => {

		searchForThese[key] = Object.assign({}, this.searchForThese[key], {
			results : [],
			callbackUsed : false
		});

		return searchForThese;

	}, {});

};

const noMatch = function() {
	return this.throwWarning('Sorry no matches found, try again?');
}; 

export class Matcher {

	match(searches = {}) {
		if(typeof searches !== 'object' || !Object.keys(searches).length){
			return this.throwWarning('match expects an object with a key term and a callback value.');
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
	}

	onNoMatch(callback = noMatch) {
		this.noMatchFound = callback.bind(this);
	}

	removeMatchTerm(term) {
		delete this.searchForThese[term];	
	}

}