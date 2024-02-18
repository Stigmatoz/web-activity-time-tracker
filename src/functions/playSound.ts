import Browser from 'webextension-polyfill';
import { PomodoroSounds } from '../utils/pomodoro';

export function playSound(sound: PomodoroSounds) {
  const myAudio = new Audio(Browser.runtime.getURL(`assets/pomodoro-sounds/${sound}`));
  myAudio.play();
}
