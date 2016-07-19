let hasFoundMatch = false;

const searchText = function(results) {
	let searchResults = { term : '', callback : () => {} };
	return results.reduce((matched, result) => {
		
		this.searchTerms.forEach((term, i) => {
			let searchFor = Object.keys(this.searchTerms[i])[0];
			let transcript = result.transcript;

			if(searchFor === transcript || searchFor === `${transcript}s`) {
				matched.term = searchFor;
				matched.callback = this.searchTerms[i][searchFor];
			}
		});

		return matched;		
	}, searchResults);
}

const findMatches = function(evt) {
	let { results, isFinalResult } = evt;
	if(!hasFoundMatch) {
		let match = searchText.call(this, results);
		if(match.term) {
			hasFoundMatch = true;
			match.callback.call(this, match.term);
		}	
	}
	
	if(isFinalResult) {
		if(!hasFoundMatch && this.onNoMatch) {
			this.onNoMatch.call(this, results);
		}
		hasFoundMatch = false;
	}
}

const resultMatcher = function(evt) {
	if(this.support && this.searchTerms.length) {
		findMatches.call(this, evt);
	}
}

const onNoMatch = () => throwWarning('Sorry no matches found, try again?');

export class Matcher {

	match(matches = {}) {
		if(this.support) {
			if(!Object.keys(matches).length){
				throwWarning('match expects an object with a key term and a callback value.');
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
		}
	}

	noMatch(callback = onNoMatch) {
		if(this.support) {
			this.onNoMatch = callback.bind(this);
		}
	}

}