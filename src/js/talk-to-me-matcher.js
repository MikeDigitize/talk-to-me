let hasFoundMatch = false;
let createSearches;
let onResultCallback;

// the initial result handler
const resultMatcher = function(evt) {

	let { isFinalResult } = evt;

	if (!hasFoundMatch || !this.getFirstMatchOnly) {
		findMatches.call(this, evt);
	}	
	else if(hasFoundMatch) {
		resetFindMatches.call(this);
	}
	
};

// will remove the callback and re-initialise the searches
const resetFindMatches = function() {

	this.off('result', onResultCallback);
	this.searchForThese = emptyResults.call(this);	
	hasFoundMatch = false;
	this.on('result', onResultCallback);	

};

// returns a function that adds new search terms
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

};

// new search terms are stored as objects
const createSearchObject = function(searches, search) {

	let regex = search.lastIndexOf('s') === search.length - 1 ? search : `${search}s?`;
	regex = new RegExp(`${regex}`, 'i');

	return {
		term : search,
		results : [],
		callback : searches[search],
		callbackUsed : false,
		regex : regex
	};

};

// handles finding matches and when the last result fires and no matches are found
const findMatches = function(evt) {

	let { results, isFinalResult } = evt;

	if(!hasFoundMatch || !this.getFirstMatchOnly) {
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

// searches for matches against each stored search item and updates the search objects
const findMatch = function(evt) {
	
	this.searchForThese = Object.assign({}, searchText.call(this, evt));
	fireResults.call(this, evt.isFinalResult);	

};

// searches for matches and updates search objects if found
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

// fires results when a new match has been made
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

};

// refreshes the search objects upon completion
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

/*
	Expects an object of key (search term) and value (callback)

	Creates an object property on the instance called searchForThese to store the above

	Each time `match` is called it adds to the existing search terms

	All results are captured in a single handler

	If a match is yet to be found and events are being produced it will continue to attempt to find matches

	Once a match is found the callback is fired and the results are stored

	The callback for a match is only fired once

	If no matches are found and the Speech Recognition API has finished the no match handler will fire

*/

export class Matcher {

	match(searches = {}) {

		if(typeof searches !== 'object' || !Object.keys(searches).length){
			return this.throwWarning('match expects an object with a key term and a callback value.');
		}

		/*
		 *	If match hasn't been called before add the result callback 
		 *	and create a cache to use to add new searches to
		 */

		if(!this.searchForThese) {
			createSearches = addToSearch();
			onResultCallback = resultMatcher.bind(this);
			this.on('result', onResultCallback);
		}
		
		this.searchForThese = createSearches(searches);
		
		// set a default on no match found handler
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