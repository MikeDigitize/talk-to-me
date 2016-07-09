import TalkToMe from './ttm';

let numOfAlternativeMatches = 10;
let finalResultsOnly = true;

let ttm = new TalkToMe({
  numOfAlternativeMatches, finalResultsOnly
});

console.log(ttm);

ttm.onNoSupport();
ttm.autoRestart = true;
ttm.on('result', onResult);
ttm.on('poop', onResult);

function onResult(evt) {
  console.log('some results', evt);
}

ttm.start();