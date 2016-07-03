/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/build";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _ttm = __webpack_require__(1);

	var _ttm2 = _interopRequireDefault(_ttm);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var numOfAlternativeMatches = 10; //import annyang from 'js/annyang';

	var finalResultsOnly = true;

	var ttm = new _ttm2.default({
	  numOfAlternativeMatches: numOfAlternativeMatches, finalResultsOnly: finalResultsOnly
	});

	console.log(ttm);

	ttm.onNoSupport(function () {
	  alert('Try using a more modern browser like Chrome or Firefox');
	});

	// ttm.on('result', evt => {
	//   console.log(evt);
	// });

	// ttm.on('speechstart', evt => {
	//   console.log('speechstart')
	// });

	// ttm.on('speechend', evt => {
	//   console.log('speechend')
	// });

	// ttm.on('soundstart', evt => {
	//   console.log('soundstart')
	// });

	// ttm.on('soundend', evt => {
	//   console.log('soundend')
	// });

	// ttm.on('end', evt => {
	//   console.log('end')
	// });

	ttm.start();

	// let allow = true;

	// let categories = ['washing machine', 'dishwasher', 'fridge', 'freezer', 'TV', 'microwave'];

	// function createCommands(...keywords) {
	//   let commands = {};
	//   function callback(keyword) {
	//     SpeechKITT.setInstructionsText(`So you want to shop for ${keyword}?`);
	//     SpeechKITT.vroom();
	//   }
	//   keywords.forEach(keyword => {
	//     commands[keyword] = callback.bind(null, keyword)
	//   });
	//   return commands;
	// }

	// // Add our commands to annyang
	// annyang.addCommands(createCommands('washing machines', 'dishwashers', 'fridges', 'freezers', 'TVs'));

	// // Tell KITT to use annyang
	// SpeechKITT.annyang();

	// SpeechKITT.setInstructionsText('What would you like to shop for today?');

	// // Render KITT's interface
	// SpeechKITT.vroom();

	// SpeechKITT.startRecognition();
	// annyang.trigger('What would you like to shop for today?');
	// annyang.addCallback('result', checkforMatches);

	// function checkforMatches(result) {
	//   let match;
	//   if(allow) {
	//     match = checkForCategories(result.speech, categories);
	//     if(match.found) {
	//       allow = false;
	//     }
	//     console.log(match);
	//   }
	//   if(result.isFinalResult) {
	//     allow = true;
	//   }
	// }

	// function checkForCategories(results, cats) {
	//   return results.reduce((match, phrase) => {
	//     let check = searchForCategoryText(phrase.text, cats);
	//     match.phrase = phrase.text;
	//     if(check.found) {
	//       match = check;
	//     }
	//     return match;
	//   }, { found : false, phrase : ''});
	// }

	// function pluraliseWord(word) {
	//   return /s$/i.test(word) ? word : `${word}s`;
	// }

	// function pluraliseRegex(word) {
	//   return new RegExp(`${word}s?`, 'g');
	// }

	// function searchForCategoryText(phrase, collection) {
	//   return collection.reduce((match, category) => {
	//       let reg = pluraliseRegex(category);
	//       if(phrase.match(reg) !== null) {
	//         match.found = true;
	//         match.phrase = pluraliseWord(category);
	//       }
	//       return match;
	//   }, { found : false, phrase : ''})
	// }

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var addEvents = function addEvents(listeners) {
		var _this = this;

		Object.keys(listeners).forEach(function (listener) {
			return _this.addEventListener(listener, listeners[listener][0]);
		});
	};

	var eventListeners = {
		start: [function () {
			return console.log('started!');
		}],
		end: [function () {
			return console.log('end!');
		}],
		audioend: [function () {
			return console.log('audioend!');
		}],
		audiostart: [function () {
			return console.log('audiostart!');
		}],
		error: [function () {
			return console.log('error!');
		}],
		nomatch: [function () {
			return console.log('nomatch!');
		}],
		result: [function () {
			return console.log('result!');
		}],
		soundend: [function () {
			return console.log('soundend!');
		}],
		soundstart: [function () {
			return console.log('soundstart!');
		}],
		speechend: [function () {
			return console.log('speechend!');
		}],
		speechstart: [function () {
			return console.log('speechstart!');
		}]
	};

	var TalkToMe = function () {
		function TalkToMe(options) {
			_classCallCheck(this, TalkToMe);

			var _TalkToMe$getSpeechRe = TalkToMe.getSpeechRecogniserConstructor();

			var speech = _TalkToMe$getSpeechRe.speech;
			var support = _TalkToMe$getSpeechRe.support;

			this.support = support;

			if (this.support) {
				var numOfAlternativeMatches = options.numOfAlternativeMatches;
				var finalResultsOnly = options.finalResultsOnly;
				var language = options.language;
				var continuous = options.continuous;

				this.speech = new speech();
				this.speech.maxAlternatives = numOfAlternativeMatches || 5;
				this.speech.continuous = continuous || true; // not supported in some browsers
				this.speech.interimResults = finalResultsOnly || true; // continuously anlayses results if true
				this.speech.lang = language || 'en-US'; // HTML lang attribute - defaults to English
				this.isListening = false;
				this.stopListening = false;

				addEvents.call(this.speech, eventListeners);
			}
		}

		_createClass(TalkToMe, [{
			key: 'onNoSupport',
			value: function onNoSupport() {
				var cb = arguments.length <= 0 || arguments[0] === undefined ? function () {} : arguments[0];

				if (!this.support) {
					cb();
				}
			}
		}, {
			key: 'start',
			value: function start() {
				if (this.support && !this.isListening && !this.stopListening) {
					this.speech.start();
					this.isListening = true;
				}
			}
		}, {
			key: 'on',
			value: function on(evt, callback) {
				//this.callbacks.push({ evt, callback})
			}
		}], [{
			key: 'getSpeechRecogniserConstructor',
			value: function getSpeechRecogniserConstructor() {
				var speech = window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition || window.oSpeechRecognition;
				return { speech: speech, support: !!speech };
			}
		}]);

		return TalkToMe;
	}();

	exports.default = TalkToMe;

/***/ }
/******/ ]);