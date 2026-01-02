import {createRefArray} from '@revideo/core';
import {Gradient, Layout, Rect, Txt, makeScene2D} from '@revideo/2d';
import {addAudio, baseProject, makeTimeSignal, PORTRAIT, wrap01} from './_common';

/**
 * Prompt: "Isometric glass cards + parallax + neon edge glows"
 */
const scene = makeScene2D('portrait_04_cards', function* (view) {
  const {t, drive} = makeTimeSignal();
  yield* addAudio(view);

  view.add(
    <Rect
      size={[PORTRAIT.x, PORTRAIT.y]}
      fill={
        new Gradient({
          type: 'linear',
          from: [-PORTRAIT.x / 2, -PORTRAIT.y / 2],
          to: [PORTRAIT.x / 2, PORTRAIT.y / 2],
          stops: [
            {offset: 0, color: '#070A12'},
            {offset: 0.6, color: '#101436'},
            {offset: 1, color: '#071C1A'},
          ],
        })
      }
    />,
  );

  const cards = createRefArray<Rect>();

  view.add(
    <Layout size={[PORTRAIT.x, PORTRAIT.y]} clip>
      <Txt
        text={'GLASS STACK'}
        fontFamily={'Poppins'}
        fontWeight={800}
        fontSize={56}
        y={-490}
        fill={'rgba(240,255,255,0.9)'}
        shadowColor={'rgba(120,240,255,0.45)'}
        shadowBlur={18}
      />

      {Array.from({length: 5}).map((_, i) => {
        const z = i / 5;
        return (
          <Rect
            ref={cards}
            size={[520, 230]}
            radius={32}
            rotation={-12}
            y={-80 + i * 70}
            x={-40 + i * 18}
            fill={'rgba(255,255,255,0.06)'}
            stroke={'rgba(140,245,255,0.14)'}
            lineWidth={2}
            shadowColor={i % 2 === 0 ? 'rgba(255,110,190,0.35)' : 'rgba(120,240,255,0.35)'}
            shadowBlur={28}
          >
            <Rect
              size={[520, 40]}
              y={-95}
              fill={'rgba(120,240,255,0.06)'}
            />
            <Rect
              size={[460, 12]}
              y={-25}
              radius={6}
              fill={'rgba(255,255,255,0.07)'}
            />
            <Rect
              size={[320, 12]}
              y={10}
              radius={6}
              fill={'rgba(255,255,255,0.06)'}
            />
            <Rect
              size={[220, 12]}
              y={45}
              radius={6}
              fill={'rgba(255,255,255,0.05)'}
            />
          </Rect>
        );
      })}
    </Layout>,
  );

  // Parallax sway
  cards.forEach((card, i) => {
    const p = i / 5;
    card.x(() => -40 + i * 18 + Math.sin(t() * Math.PI * 2 * 1.2 + p * 2) * (18 + p * 12));
    card.y(() => -80 + i * 70 + Math.cos(t() * Math.PI * 2 * 1.1 + p) * (12 + p * 8));
    card.rotation(() => -12 + Math.sin(t() * Math.PI * 2 * 0.9 + p) * (2 + p * 1.5));
    card.opacity(() => 0.85 - p * 0.06 + 0.08 * Math.sin((t() + p) * Math.PI * 2 * 2));
  });

  // Floating micro highlights
  view.add(
    <Rect
      size={[PORTRAIT.x * 1.1, 2]}
      y={() => -PORTRAIT.y / 2 + 180 + wrap01(t() * 0.7) * (PORTRAIT.y - 360)}
      fill={'rgba(120,240,255,0.10)'}
      opacity={() => 0.12 + 0.08 * Math.sin(t() * Math.PI * 2 * 3)}
    />,
  );

  yield* drive();
});

export default baseProject(scene);


