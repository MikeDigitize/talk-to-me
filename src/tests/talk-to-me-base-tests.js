import { expect } from 'chai';
import { TalkToMe } from '../js/talk-to-me-base';

describe('Talk to me', function() {

	describe('Talk to me initialisation', function() {

		it('should initialise with default properties', function() {
			let ttm = new TalkToMe();
			expect(ttm).to.have.ownProperty('support');
			expect(ttm).to.have.ownProperty('speech');
			expect(ttm).to.have.ownProperty('isListening');
			expect(ttm).to.have.ownProperty('autoRestart');
			expect(ttm).to.have.ownProperty('eventListeners');
			expect(ttm.onNoSupport).to.be.a('function');
			expect(ttm.start).to.be.a('function');
			expect(ttm.stop).to.be.a('function');
			expect(ttm.on).to.be.a('function');
			expect(ttm.off).to.be.a('function');		
		});

		it('should initialise with default property values', function() {
			let ttm = new TalkToMe();
			expect(ttm.isListening).to.be.false;
			expect(ttm.autoRestart).to.be.false;
			expect(ttm.eventListeners).to.have.all.keys([
				'start', 
				'end',
				'audioend',
				'audiostart',
				'error',
				'nomatch',
				'result',
				'soundend',
				'soundstart',
				'speechend',
				'speechstart']);
			expect(ttm.speech.maxAlternatives).to.equal(5);
			expect(ttm.speech.interimResults).to.be.false;
			expect(ttm.speech.lang).to.equal('en-US');
		});

		it('should initialise with set parameters', function() {
			let numOfAlternativeMatches = 10, language = 'nl-NL', finalResultsOnly = true;
			let ttm = new TalkToMe({ numOfAlternativeMatches, language, finalResultsOnly });
			expect(ttm.speech.maxAlternatives).to.equal(10);
			expect(ttm.speech.interimResults).to.be.false;
			expect(ttm.speech.lang).to.equal('nl-NL');
		});

	});	

	describe('Talk to me starting and stopping', function() {

		it('should start', function() {
			let ttm = new TalkToMe();
			expect(ttm.start()).to.be.true;
		});

		it('should not throw an error when trying to start a started instance', function() {
			let ttm = new TalkToMe();
			expect(ttm.isListening).to.be.false;
			expect(ttm.start()).to.be.true;
			expect(ttm.isListening).to.be.true;
			expect(ttm.start()).to.be.false;
		});

		it('should start then stop', function() {
			let ttm = new TalkToMe();
			expect(ttm.start()).to.be.true;
			expect(ttm.isListening).to.be.true;
			ttm.stop();
			expect(ttm.isListening).to.be.false;
		});

		it('should abort multiple times and not throw an error', function() {
			let ttm = new TalkToMe();
			ttm.stop();
			ttm.stop();
			ttm.stop();
			ttm.stop();
			ttm.stop();
			expect(ttm.start()).to.be.true;
			ttm.stop();
			ttm.stop();
			expect(ttm.isListening).to.be.false;
		});

	});

	describe('Adding and removing event listeners', function() {

		it('should add a new compatible event', function() {
			let ttm = new TalkToMe();
			ttm.on('result', () => {});
			expect(ttm.eventListeners.result.length).to.equal(2);
			ttm.on('result', () => {});
			expect(ttm.eventListeners.result.length).to.equal(3);
		});

		it('should throw when a non-compatible event is added', function() {
			let ttm = new TalkToMe();
			expect(ttm.on('noEvent', () => {})).to.be.false;
		});

		it('should add and remove an event', function() {
			
			let ttm = new TalkToMe();
			let count = ttm.eventListeners.start.length;
			let testFn = () => {};
			ttm.on('start', testFn);
			expect(ttm.eventListeners.start.length).to.equal(count + 1);
			ttm.off('start', testFn);
			expect(ttm.eventListeners.start.length).to.equal(count);
		});

		it('should add and remove an event then warn when attempting to remove a listener that doesnt exist', function() {
			
			let ttm = new TalkToMe();
			let count = ttm.eventListeners.start.length;
			let testFn = () => {};
			ttm.on('start', testFn);
			expect(ttm.eventListeners.start.length).to.equal(count + 1);
			ttm.off('start', testFn);
			expect(ttm.eventListeners.start.length).to.equal(count);
			expect(ttm.off('start', testFn)).to.be.false;
		});

		it('should add a result event, then when removed should remove the remaining result listener, then add it again', function() {
			
			let ttm = new TalkToMe();
			let count = ttm.eventListeners.result.length;
			let testFn = function blah(){};
			ttm.on('result', testFn);
			expect(ttm.eventListeners.result.length).to.equal(count + 1);
			let original = ttm.eventListeners.result[0];
			ttm.off('result', testFn);			
			expect(ttm.eventListeners.result.length).to.equal(count);
			expect(ttm.eventListeners.result[0]).to.equal(original);
			ttm.on('result', testFn);
			expect(ttm.eventListeners.result.length).to.equal(count + 1);
			ttm.off('result', testFn);			
			expect(ttm.eventListeners.result.length).to.equal(count);
			expect(ttm.eventListeners.result[0]).to.equal(original);
			ttm.on('result', testFn);
			expect(ttm.eventListeners.result.length).to.equal(count + 1);
		});

	});


});