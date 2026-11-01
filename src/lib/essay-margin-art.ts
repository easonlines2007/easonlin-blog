import type { ImageMetadata } from 'astro'
import futureLoss from '../assets/essay-margins/future-loss.png'
import ordinaryPerson from '../assets/essay-margins/ordinary-person.png'
import informationOverload from '../assets/essay-margins/information-overload.png'
import nineteen from '../assets/essay-margins/nineteen.png'
import fantasy from '../assets/essay-margins/fantasy.png'
import night from '../assets/essay-margins/night.png'
import noRegrets from '../assets/essay-margins/no-regrets.png'
import timeToLeave from '../assets/essay-margins/time-to-leave.png'
import unfinishedLeft from '../assets/essay-margins/unfinished-left.png'
import unfinishedRight from '../assets/essay-margins/unfinished-right.png'
import abilityAndDesire from '../assets/essay-margins/ability-and-desire.png'

type MarginArt = { pair: ImageMetadata } | { left: ImageMetadata; right: ImageMetadata }

// Shared by the Chinese article and its English translation; directions are baked into the art.
export const essayMarginArt: Record<string, MarginArt> = {
  'future-loss': { pair: futureLoss },
  'ordinary-person': { pair: ordinaryPerson },
  'information-overload': { pair: informationOverload },
  nineteen: { pair: nineteen },
  fantasy: { pair: fantasy },
  night: { pair: night },
  'no-regrets': { pair: noRegrets },
  'time-to-leave': { pair: timeToLeave },
  unfinished: { left: unfinishedLeft, right: unfinishedRight },
  'ability-and-desire': { pair: abilityAndDesire }
}
