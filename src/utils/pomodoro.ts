import { StorageParams } from '../storage/storage-params';

export type PomodoroAudioParams =
  | StorageParams.POMODORO_AUDIO_AFTER_WORK
  | StorageParams.POMODORO_AUDIO_AFTER_REST
  | StorageParams.POMODORO_AUDIO_AFTER_FINISHED;

export enum PomodoroSounds {
  'Sound 1' = '1.mp3',
  'Sound 2' = '2.mp3',
  'Sound 3' = '3.mp3',
  'Sound 4' = '4.mp3',
  'Sound 5' = '5.mp3',
  'Sound 6' = '6.mp3',
  'Sound 7' = '7.mp3',
  'Sound 8' = '8.mp3',
  'Sound 9' = '9.mp3',
  'Sound 10' = '10.mp3',
  'Sound 11' = '11.mp3',
  'Sound 12' = '12.mp3',
  'Sound 13' = '13.mp3',
}
