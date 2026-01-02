import {createSignal, linear, makeProject} from '@revideo/core';
import {Vector2} from '@revideo/core';
import {Audio, Circle, Gradient, Layout, makeScene2D, Rect, Spline} from '@revideo/2d';

const DURATION = 6;
const SIZE = {x: 1280, y: 720};

function wrap01(v: number) {
  // Keep in [0, 1)
  return ((v % 1) + 1) % 1;
}

/**
 * Neural-network signal flow + data particles (lightweight, ~6s).
 */
const scene = makeScene2D('neural', function* (view) {
  const t = createSignal(0);

  // Provide a real audio track so the renderer doesn't need to synthesize
  // silent audio via fluent-ffmpeg's `lavfi` inputFormat (which it can't detect).
  yield view.add(<Audio src={'silence.wav'} play={true} />);

  // Background gradient.
  view.add(
    <Rect
      size={[SIZE.x, SIZE.y]}
      fill={
        new Gradient({
          type: 'linear',
          from: [-SIZE.x / 2, -SIZE.y / 2],
          to: [SIZE.x / 2, SIZE.y / 2],
          stops: [
            {offset: 0, color: '#070A12'},
            {offset: 0.55, color: '#081B2A'},
            {offset: 1, color: '#0B2B2E'},
          ],
        })
      }
    />,
  );

  // Slight vignette to add depth.
  view.add(
    <Rect
      size={[SIZE.x + 2, SIZE.y + 2]}
      opacity={0.55}
      fill={
        new Gradient({
          type: 'radial',
          from: [0, 0],
          to: [0, 0],
          fromRadius: 30,
          toRadius: Math.max(SIZE.x, SIZE.y) * 0.75,
          stops: [
            {offset: 0, color: 'rgba(0,0,0,0)'},
            {offset: 1, color: 'rgba(0,0,0,0.55)'},
          ],
        })
      }
    />,
  );

  const colX = [-420, 0, 420];
  const rowY = [-220, -110, 0, 110, 220];

  // Node positions.
  const nodes: Vector2[][] = colX.map(x => rowY.map(y => new Vector2(x, y)));

  // Base network (nodes + connections).
  view.add(
    <Layout>
      {/* Connections (subtle). */}
      {nodes[0].flatMap((p, i) =>
        nodes[1]
          .filter((_, j) => Math.abs(i - j) <= 1)
          .map((q, j) => (
            <Spline
              lineWidth={3}
              stroke={'rgba(120, 220, 255, 0.16)'}
              smoothness={0.35}
              points={[
                [p.x, p.y] as [number, number],
                [-180, (p.y + q.y) / 2 + (i - j) * 20] as [number, number],
                [q.x, q.y] as [number, number],
              ]}
            />
          )),
      )}

      {nodes[1].flatMap((p, i) =>
        nodes[2]
          .filter((_, j) => Math.abs(i - j) <= 1)
          .map((q, j) => (
            <Spline
              lineWidth={3}
              stroke={'rgba(120, 220, 255, 0.16)'}
              smoothness={0.35}
              points={[
                [p.x, p.y] as [number, number],
                [180, (p.y + q.y) / 2 + (j - i) * 20] as [number, number],
                [q.x, q.y] as [number, number],
              ]}
            />
          )),
      )}

      {/* Nodes */}
      {nodes.flatMap((col, ci) =>
        col.map((pos, ri) => {
          const phase = ci * 1.6 + ri * 0.65;
          const pulse = () => 0.5 + 0.5 * Math.sin(t() * Math.PI * 2 * 3 - phase);

          return (
            <Layout position={[pos.x, pos.y]}>
              <Circle
                size={42}
                fill={'rgba(140, 245, 255, 0.22)'}
                opacity={() => 0.25 + pulse() * 0.55}
                shadowColor={'rgba(110, 240, 255, 0.9)'}
                shadowBlur={() => 10 + pulse() * 22}
              />
              <Circle
                size={20}
                fill={'rgba(220, 252, 255, 0.92)'}
                stroke={'rgba(110, 240, 255, 0.55)'}
                lineWidth={2}
                shadowColor={'rgba(110, 240, 255, 0.65)'}
                shadowBlur={6}
              />
            </Layout>
          );
        }),
      )}
    </Layout>,
  );

  // A few "data particles" traveling left -> right along smooth paths.
  // We add invisible splines just to sample positions from.
  const paths: Array<Array<[number, number]>> = [
    [
      [-640, -180],
      [-260, -260],
      [0, -140],
      [260, -210],
      [640, -110],
    ],
    [
      [-640, 40],
      [-320, -40],
      [0, 60],
      [320, 20],
      [640, 120],
    ],
    [
      [-640, 220],
      [-280, 120],
      [0, 260],
      [280, 140],
      [640, 260],
    ],
  ];

  const pathSignals = paths.map(points => {
    const path = new Spline({
      points,
      smoothness: 0.42,
      lineWidth: 2,
      stroke: 'rgba(140, 245, 255, 0.10)',
    });
    // Add a faint path for extra polish.
    view.add(path);
    return path;
  });

  const particles = [
    {path: 0, offset: 0.05, speed: 1.6, size: 10},
    {path: 1, offset: 0.32, speed: 2.2, size: 8},
    {path: 2, offset: 0.61, speed: 1.9, size: 9},
    {path: 1, offset: 0.78, speed: 2.6, size: 7},
  ];

  for (const p of particles) {
    const spline = pathSignals[p.path];
    view.add(
      <Circle
        size={p.size}
        fill={'rgba(170, 252, 255, 0.95)'}
        shadowColor={'rgba(110, 240, 255, 0.95)'}
        shadowBlur={18}
        position={() => {
          const u = wrap01(t() * p.speed + p.offset);
          return spline.getPointAtPercentage(u).position;
        }}
        opacity={() => 0.65 + 0.35 * Math.sin(t() * Math.PI * 2 * 2 + p.offset * 10)}
      />,
    );
  }

  yield* t(1, DURATION, linear);
});

export default makeProject({
  scenes: [scene],
  settings: {
    shared: {
      // Render range: 0..6 seconds
      range: [0, DURATION],
      size: SIZE,
      background: '#070A12',
    },
    preview: {fps: 30, resolutionScale: 1},
    rendering: {fps: 30, resolutionScale: 1},
  },
});
