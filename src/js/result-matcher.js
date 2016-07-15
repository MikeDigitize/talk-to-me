import { TalkToMe as TTM } from './talk-to-me';

let hasFoundMatch = false;

const findMatches = function(evt) {

		let { results, isFinalResult } = evt;

		if(!hasFoundMatch) {

			let match = results.reduce((matched, result) => {
				this.searchTerms.forEach((term, i) => {
					let searchFor = Object.keys(this.searchTerms[i])[0];
					if(searchFor === result.transcript || searchFor === `${result.transcript}s`) {
						matched.term = searchFor;
						matched.callback = this.searchTerms[i][searchFor];
					}
				});
				return matched;
			}, { term : '', callback : () => {} });

			if(match.term) {
				hasFoundMatch = true;
			}

			match.callback.call(this, match.term);

		}
		
		if(isFinalResult) {
			if(!hasFoundMatch && this.onNoMatch) {
				this.onNoMatch.call(this, results);
			}
			hasFoundMatch = false;
		}

	}

export class TalkToMe extends TTM {

	constructor(options) {
		super(options);
		this.searchTerms = [];
		this.on('result', this.resultMatcher.bind(this));
	}

	match(matches) {
		if(this.support) {
			let searchTerms = Object.keys(matches);
			let searches = searchTerms.map(term => {
				let obj = {};
				obj[term] = matches[term];
				return obj;
			});
			this.searchTerms = this.searchTerms.concat(searches);
		}
	}

	noMatch(callback) {
		if(this.support) {
			this.onNoMatch = callback;
		}
	}

	resultMatcher(evt) {
		if(this.support && this.searchTerms.length) {
			findMatches.call(this, evt);
		}		
	}

}

function onMatch(term) {
	console.log(`So you're interested in ${term}?`);
}

function onNoMatch(results) {
	console.log(`Sorry, do you want to try saying that again?`, results);
}

var ttm = new TalkToMe();
ttm.autoRestart = true;
ttm.noMatch(onNoMatch);
ttm.match({ 
	'washing machines' : onMatch,
	'TVs' : onMatch,
	'AO' : onMatch
});
ttm.start();