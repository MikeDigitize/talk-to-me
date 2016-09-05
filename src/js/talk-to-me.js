import { Combine } from './combine';
import { Matcher } from './talk-to-me-matcher';
import { Conversate } from './talk-to-me-conversate';
import { TalkToMeBase } from './talk-to-me-base';

export var TalkToMe = Combine(TalkToMeBase, [Matcher, Conversate]);