import {createSignal} from '@revideo/core';
import {Circle, Layout, Rect, Spline, makeScene2D} from '@revideo/2d';
import {addAudio, addGradientBg, baseProject, makeTimeSignal, PORTRAIT, wrap01} from './_common';

/**
 * Prompt: "HUD radar sweep + blips + trailing arcs"
 */
const scene = makeScene2D('portrait_02_radar', function* (view) {
  const {t, drive} = makeTimeSignal();

  yield* addAudio(view);
  addGradientBg(view, [
    [0, '#050910'],
    [0.6, '#071B1A'],
    [1, '#021012'],
  ]);

  const sweep = createSignal(0);
  const centerY = -70;

  const ringR = [120, 200, 280, 360];
  const blips = [
    {r: 160, a: 0.25, p: 0.10},
    {r: 240, a: 1.55, p: 0.42},
    {r: 320, a: 2.35, p: 0.76},
  ];

  view.add(
    <Layout size={[PORTRAIT.x, PORTRAIT.y]} clip>
      {/* Grid */}
      <Rect
        size={[PORTRAIT.x * 1.1, PORTRAIT.y * 1.1]}
        opacity={0.22}
        stroke={'rgba(120,240,255,0.12)'}
        lineWidth={1}
        radius={40}
      />

      {/* Rings */}
      {ringR.map(r => (
        <Circle
          size={r * 2}
          y={centerY}
          stroke={'rgba(120,240,255,0.14)'}
          lineWidth={2}
          fill={null}
        />
      ))}

      {/* Crosshair */}
      <Rect
        size={[520, 2]}
        y={centerY}
        fill={'rgba(120,240,255,0.18)'}
      />
      <Rect
        size={[2, 520]}
        y={centerY}
        fill={'rgba(120,240,255,0.18)'}
      />

      {/* Sweep cone (fake with a rotating tall rect + opacity) */}
      <Rect
        width={520}
        height={520}
        y={centerY}
        fill={'rgba(120,240,255,0.06)'}
        rotation={() => sweep() * 360}
        shadowColor={'rgba(120,240,255,0.25)'}
        shadowBlur={30}
        opacity={() => 0.12 + 0.06 * Math.sin(t() * Math.PI * 2 * 2)}
      />

      {/* Trailing arc */}
      <Spline
        y={centerY}
        lineWidth={6}
        stroke={'rgba(120,240,255,0.22)'}
        smoothness={0.45}
        points={[
          [0, -360] as [number, number],
          [220, -120] as [number, number],
          [180, 180] as [number, number],
          [0, 360] as [number, number],
        ]}
        start={() => wrap01(sweep() - 0.22)}
        end={() => sweep()}
        lineCap={'round'}
      />

      {/* Blips */}
      {blips.map(b => (
        <Circle
          size={() => 10 + 12 * Math.max(0, Math.sin((t() + b.p) * Math.PI * 2 * 2.5))}
          y={() => centerY + Math.sin(b.a) * b.r}
          x={() => Math.cos(b.a) * b.r}
          fill={'rgba(200,255,255,0.92)'}
          shadowColor={'rgba(120,240,255,0.85)'}
          shadowBlur={24}
          opacity={() => {
            const ang = sweep() * Math.PI * 2;
            const d = Math.abs(Math.atan2(Math.sin(ang - b.a), Math.cos(ang - b.a)));
            return 0.25 + 0.75 * Math.max(0, 1 - d / 0.5);
          }}
        />
      ))}
    </Layout>,
  );

  sweep(() => wrap01(t() * 1.1));
  yield* drive();
});

export default baseProject(scene);


