import { Combine } from './combine';
import { Matcher } from './talk-to-me-matcher';
import { Conversate } from './talk-to-me-conversate';
import { TalkToMeBase } from './talk-to-me-base';

class Talk extends Combine(TalkToMeBase, [Matcher, Conversate]) {
	constructor(options) {
		super(options);
	}
}

export function TalkToMe(options) {
	return new Talk(options);
}