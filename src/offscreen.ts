import Browser from 'webextension-polyfill';
import { Messages } from './utils/messages';

console.log('ofscreen');

Browser.runtime.onMessage.addListener(msg => {
  console.log('ofscreen message');
  if (msg.message == Messages.PlayAudio) {
    if (msg.offscreen == undefined) return;

    playAudio(msg.sound);
  }
});

function playAudio(sound: string) {
  const audio = document.querySelector('audio');
  if (!audio) return;

  const path = Browser.runtime.getURL(`../assets/pomodoro-sounds/${sound}`);
  audio.src = path;
  audio.volume = 1;
  audio.play();
}
