import {createSignal} from '@revideo/core';
import {Circle, Gradient, Layout, Rect, Spline, makeScene2D} from '@revideo/2d';
import {addAudio, baseProject, makeTimeSignal, PORTRAIT, wrap01} from './_common';

/**
 * Prompt: "Liquid gradient blob + orbiting highlights + soft splines"
 */
const scene = makeScene2D('portrait_03_blob', function* (view) {
  const {t, drive} = makeTimeSignal();

  // Local helper (not exported by @revideo/core in this version)
  const smoothstep = (edge0: number, edge1: number, x: number) => {
    const tt = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
    return tt * tt * (3 - 2 * tt);
  };

  yield* addAudio(view);

  // Dark base + subtle diagonal tint.
  view.add(
    <Rect
      size={[PORTRAIT.x, PORTRAIT.y]}
      fill={
        new Gradient({
          type: 'linear',
          from: [-PORTRAIT.x / 2, -PORTRAIT.y / 2],
          to: [PORTRAIT.x / 2, PORTRAIT.y / 2],
          stops: [
            {offset: 0, color: '#050713'},
            {offset: 0.55, color: '#0B0F24'},
            {offset: 1, color: '#0B1C21'},
          ],
        })
      }
    />,
  );

  const wobble = createSignal(0);
  wobble(() => t());

  const centerY = -40;

  const blobPoints = () => {
    const a = t() * Math.PI * 2;
    const r = 250;
    const k1 = 0.22 * Math.sin(a * 2.0);
    const k2 = 0.18 * Math.cos(a * 3.0 + 1.2);
    return [
      [-r * (1 + k1), centerY - 140] as [number, number],
      [-r * 0.6, centerY - 260 * (1 - k2)] as [number, number],
      [r * (1 - k2), centerY - 120] as [number, number],
      [r * 0.7, centerY + 260 * (1 + k1)] as [number, number],
      [-r * (1 + k2), centerY + 170] as [number, number],
    ];
  };

  view.add(
    <Layout size={[PORTRAIT.x, PORTRAIT.y]} clip>
      {/* Soft blob outline */}
      <Spline
        points={blobPoints}
        smoothness={0.55}
        lineWidth={18}
        stroke={'rgba(120,240,255,0.12)'}
        lineCap={'round'}
      />

      {/* Filled blob */}
      <Spline
        points={blobPoints}
        smoothness={0.55}
        closed
        fill={
          new Gradient({
            type: 'conic',
            from: [0, centerY],
            angle: () => t() * Math.PI * 2,
            stops: [
              {offset: 0, color: 'rgba(255,110,190,0.55)'},
              {offset: 0.35, color: 'rgba(120,240,255,0.55)'},
              {offset: 0.7, color: 'rgba(120,255,190,0.55)'},
              {offset: 1, color: 'rgba(255,110,190,0.55)'},
            ],
          })
        }
        opacity={0.9}
        shadowColor={'rgba(120,240,255,0.25)'}
        shadowBlur={40}
      />

      {/* Orbiting highlights */}
      {Array.from({length: 6}).map((_, i) => {
        const p = i / 6;
        return (
          <Circle
            size={() => 14 + 18 * smoothstep(0, 1, 0.5 + 0.5 * Math.sin((t() + p) * Math.PI * 2 * 2))}
            x={() => Math.cos((t() + p) * Math.PI * 2) * 260}
            y={() => centerY + Math.sin((t() + p) * Math.PI * 2) * 260}
            fill={'rgba(245,255,255,0.92)'}
            shadowColor={'rgba(255,255,255,0.6)'}
            shadowBlur={28}
            opacity={() => 0.35 + 0.65 * (1 - p)}
          />
        );
      })}

      {/* Subtle particles */}
      {Array.from({length: 28}).map((_, i) => {
        const seed = (i * 997) % 101;
        const p = seed / 101;
        const lane = (i % 7) / 7;
        return (
          <Circle
            size={3}
            fill={'rgba(190,250,255,0.6)'}
            opacity={() => 0.1 + 0.4 * Math.sin((t() + p) * Math.PI * 2)}
            x={() => -PORTRAIT.x / 2 - 40 + wrap01(t() * (0.6 + lane * 0.9) + p) * (PORTRAIT.x + 80)}
            y={() => -PORTRAIT.y / 2 + 120 + lane * (PORTRAIT.y - 240) + Math.sin((t() + p) * Math.PI * 2) * 8}
          />
        );
      })}
    </Layout>,
  );

  yield* drive();
});

export default baseProject(scene);


