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

	var ttm = new _ttm2.default(); //import annyang from 'js/annyang';


	console.log(ttm);

	ttm.onNoSupport(function () {
	  alert('Try using a more modern browser like Chrome or Firefox');
	});

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

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var TalkToMe = function () {
		function TalkToMe() {
			_classCallCheck(this, TalkToMe);

			this.speech = TalkToMe.support();
			if (!this.speech) {
				//this.onError('Sorry your browser doesn\'t support speech recognition');
			}
			console.log(this.speech);
		}

		_createClass(TalkToMe, [{
			key: "onError",
			value: function onError(msg) {
				throw new Error(msg);
			}
		}, {
			key: "onNoSupport",
			value: function onNoSupport() {
				var cb = arguments.length <= 0 || arguments[0] === undefined ? function () {} : arguments[0];

				if (!this.speech) {
					cb();
				}
			}
		}], [{
			key: "support",
			value: function support() {
				return window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition || window.oSpeechRecognition || false;
			}
		}]);

		return TalkToMe;
	}();

	exports.default = TalkToMe;

/***/ }
/******/ ]);