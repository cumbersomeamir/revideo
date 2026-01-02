import {createSignal, linear, makeProject} from '@revideo/core';
import type {ThreadGenerator} from '@revideo/core';
import {Audio, Gradient, makeScene2D, Rect} from '@revideo/2d';

export const PORTRAIT = {x: 720, y: 1280};
export const FPS = 30;
export const DURATION = 6;

export function wrap01(v: number) {
  return ((v % 1) + 1) % 1;
}

export function baseProject(scene: ReturnType<typeof makeScene2D>) {
  return makeProject({
    scenes: [scene],
    settings: {
      shared: {
        range: [0, DURATION],
        size: PORTRAIT,
        background: '#070A12',
      },
      preview: {fps: FPS, resolutionScale: 1},
      rendering: {fps: FPS, resolutionScale: 1},
    },
  });
}

export function* addAudio(view: any): ThreadGenerator {
  // Revideo resolves local assets relative to (outDir/../public).
  // We keep a silence file at repo-root /public/silence.wav.
  yield view.add(<Audio src={'silence.wav'} play={true} />);
}

export function addGradientBg(view: any, stops: Array<[number, string]>) {
  view.add(
    <Rect
      size={[PORTRAIT.x, PORTRAIT.y]}
      fill={
        new Gradient({
          type: 'linear',
          from: [-PORTRAIT.x / 2, -PORTRAIT.y / 2],
          to: [PORTRAIT.x / 2, PORTRAIT.y / 2],
          stops: stops.map(([offset, color]) => ({offset, color})),
        })
      }
    />,
  );
}

export function makeTimeSignal() {
  const t = createSignal(0);
  const drive = function* (): ThreadGenerator {
    yield* t(1, DURATION, linear);
  };
  return {t, drive};
}


