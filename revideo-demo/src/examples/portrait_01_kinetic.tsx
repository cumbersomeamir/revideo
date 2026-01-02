import {createRef} from '@revideo/core';
import {Layout, Rect, Txt, makeScene2D} from '@revideo/2d';
import {addAudio, addGradientBg, baseProject, makeTimeSignal, PORTRAIT} from './_common';

/**
 * Prompt: "Kinetic typography + glitch scanline + neon accent blocks"
 */
const scene = makeScene2D('portrait_01_kinetic', function* (view) {
  const {t, drive} = makeTimeSignal();

  yield* addAudio(view);
  addGradientBg(view, [
    [0, '#070A12'],
    [0.55, '#0B1630'],
    [1, '#071F1B'],
  ]);

  const title = createRef<Txt>();
  const sub = createRef<Txt>();
  const scan = createRef<Rect>();

  view.add(
    <Layout size={[PORTRAIT.x, PORTRAIT.y]} clip>
      <Rect
        ref={scan}
        size={[PORTRAIT.x * 1.2, 120]}
        y={-PORTRAIT.y / 2 - 120}
        fill={'rgba(120,240,255,0.08)'}
        shadowColor={'rgba(120,240,255,0.35)'}
        shadowBlur={30}
      />

      <Rect
        size={[PORTRAIT.x * 0.78, 18]}
        y={-310}
        radius={9}
        fill={'rgba(160,255,235,0.12)'}
      />

      <Txt
        ref={title}
        text={'SIGNAL\nSTACK'}
        fontFamily={'Poppins'}
        fontWeight={800}
        fontSize={92}
        letterSpacing={2}
        lineHeight={98}
        fill={'rgba(240,255,255,0.92)'}
        y={-160}
        opacity={0}
        shadowColor={'rgba(120,240,255,0.55)'}
        shadowBlur={18}
      />

      <Txt
        ref={sub}
        text={'portrait • 6s • 30fps'}
        fontFamily={'Poppins'}
        fontWeight={600}
        fontSize={26}
        fill={'rgba(190,250,255,0.75)'}
        y={90}
        opacity={0}
      />

      {/* Accent blocks */}
      <Rect
        x={-220}
        y={210}
        size={[180, 18]}
        radius={9}
        fill={'rgba(255,120,180,0.35)'}
        shadowColor={'rgba(255,120,180,0.55)'}
        shadowBlur={20}
        opacity={() => 0.25 + 0.55 * Math.sin(t() * Math.PI * 2 * 2)}
      />
      <Rect
        x={80}
        y={240}
        size={[260, 18]}
        radius={9}
        fill={'rgba(120,240,255,0.28)'}
        shadowColor={'rgba(120,240,255,0.55)'}
        shadowBlur={20}
        opacity={() => 0.25 + 0.55 * Math.sin(t() * Math.PI * 2 * 2 + 1.3)}
      />
    </Layout>,
  );

  // Motion: scanline sweeps + text eases in + subtle glitch jitter
  title().opacity(1);
  sub().opacity(1);

  title().position.y(-160);
  sub().position.y(90);

  title().position.y(() => -160 + Math.sin(t() * Math.PI * 2 * 6) * 3);
  title().position.x(() => Math.sin(t() * Math.PI * 2 * 10) * (t() < 0.12 ? 10 : 2));

  scan().position.y(() => -PORTRAIT.y / 2 - 120 + t() * (PORTRAIT.y + 240));
  scan().opacity(() => 0.12 + 0.08 * Math.sin(t() * Math.PI * 2 * 3));

  yield* drive();
});

export default baseProject(scene);


