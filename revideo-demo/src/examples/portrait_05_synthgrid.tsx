import {createSignal} from '@revideo/core';
import {Circle, Gradient, Layout, Line, Rect, makeScene2D} from '@revideo/2d';
import {addAudio, baseProject, makeTimeSignal, PORTRAIT, wrap01} from './_common';

/**
 * Prompt: "Synthwave horizon grid + neon sun + streaking stars"
 */
const scene = makeScene2D('portrait_05_synthgrid', function* (view) {
  const {t, drive} = makeTimeSignal();
  yield* addAudio(view);

  view.add(
    <Rect
      size={[PORTRAIT.x, PORTRAIT.y]}
      fill={
        new Gradient({
          type: 'linear',
          from: [0, -PORTRAIT.y / 2],
          to: [0, PORTRAIT.y / 2],
          stops: [
            {offset: 0, color: '#070614'},
            {offset: 0.55, color: '#190A2E'},
            {offset: 1, color: '#050718'},
          ],
        })
      }
    />,
  );

  const horizonY = 120;
  const pulse = createSignal(0);
  pulse(() => 0.5 + 0.5 * Math.sin(t() * Math.PI * 2 * 1.2));

  view.add(
    <Layout size={[PORTRAIT.x, PORTRAIT.y]} clip>
      {/* Sun */}
      <Circle
        size={360}
        y={-260}
        fill={
          new Gradient({
            type: 'linear',
            from: [0, -440],
            to: [0, -80],
            stops: [
              {offset: 0, color: 'rgba(255,110,190,0.95)'},
              {offset: 0.55, color: 'rgba(120,240,255,0.90)'},
              {offset: 1, color: 'rgba(255,255,255,0.65)'},
            ],
          })
        }
        shadowColor={'rgba(255,110,190,0.45)'}
        shadowBlur={() => 40 + pulse() * 40}
      />

      {/* Sun scanlines */}
      {Array.from({length: 10}).map((_, i) => (
        <Rect
          size={[420, 8]}
          y={-360 + i * 30}
          fill={'rgba(0,0,0,0.10)'}
          opacity={() => 0.08 + 0.05 * Math.sin(t() * Math.PI * 2 * 2 + i)}
        />
      ))}

      {/* Horizon */}
      <Rect
        size={[PORTRAIT.x * 1.1, 4]}
        y={horizonY}
        fill={'rgba(120,240,255,0.25)'}
        shadowColor={'rgba(120,240,255,0.35)'}
        shadowBlur={20}
      />

      {/* Grid lines */}
      {Array.from({length: 12}).map((_, i) => {
        const x = -PORTRAIT.x / 2 + (i * PORTRAIT.x) / 11;
        return (
          <Line
            points={[
              [x, horizonY] as [number, number],
              [x * 2.2, PORTRAIT.y / 2 + 120] as [number, number],
            ]}
            stroke={'rgba(120,240,255,0.12)'}
            lineWidth={2}
          />
        );
      })}

      {Array.from({length: 11}).map((_, i) => {
        const p = i / 10;
        const y = horizonY + p * (PORTRAIT.y / 2 - horizonY + 120);
        const width = 120 + p * 980;
        return (
          <Rect
            size={[width, 2]}
            y={y}
            fill={'rgba(120,240,255,0.10)'}
            opacity={() => 0.12 + 0.06 * Math.sin(t() * Math.PI * 2 * 1.5 + i)}
          />
        );
      })}

      {/* Stars */}
      {Array.from({length: 60}).map((_, i) => {
        const seed = (i * 911) % 997;
        const p = seed / 997;
        const lane = (i % 10) / 10;
        const speed = 0.4 + lane * 1.4;
        return (
          <Rect
            size={[2 + lane * 10, 2]}
            radius={1}
            fill={'rgba(255,255,255,0.75)'}
            opacity={() => 0.15 + 0.6 * Math.sin((t() + p) * Math.PI * 2)}
            x={() => -PORTRAIT.x / 2 - 60 + wrap01(t() * speed + p) * (PORTRAIT.x + 120)}
            y={() => -PORTRAIT.y / 2 + 80 + lane * 420 + Math.sin((t() + p) * Math.PI * 2) * 6}
          />
        );
      })}
    </Layout>,
  );

  yield* drive();
});

export default baseProject(scene);


