import { expect } from 'chai';
import { TalkToMe } from '../js/talk-to-me';

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
			expect(ttm.speech.interimResults).to.be.true;
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

	describe('Talk to me event listeners', function() {

		it('should add supported event listeners and reject non-supported ones', function() {
			let ttm = new TalkToMe();
			expect(ttm.on('result', () => {})).to.be.true;
			expect(ttm.on('fake-result', () => {})).to.be.false;
		});

		it('should add and remove event listeners', function() {
			let ttm = new TalkToMe();
			function onResult(){}
			expect(ttm.on('result', onResult)).to.be.true;
			expect(ttm.off('result', onResult)).to.be.true;
			expect(ttm.off('result', onResult)).to.be.false;
		});

	});

});