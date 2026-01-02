async function main() {
  // Ensure @revideo/ffmpeg/fluent-ffmpeg uses system ffmpeg/ffprobe.
  process.env.FFMPEG_PATH = '/opt/homebrew/bin/ffmpeg';
  process.env.FFPROBE_PATH = '/opt/homebrew/bin/ffprobe';

  const {renderVideo} = await import('@revideo/renderer');

  const jobs: Array<{name: string; projectFile: string; outFile: string}> = [
    {
      name: 'portrait_01_kinetic',
      projectFile: './src/examples/portrait_01_kinetic.tsx',
      outFile: 'portrait_01_kinetic.mp4',
    },
    {
      name: 'portrait_02_radar',
      projectFile: './src/examples/portrait_02_radar.tsx',
      outFile: 'portrait_02_radar.mp4',
    },
    {
      name: 'portrait_03_blob',
      projectFile: './src/examples/portrait_03_blob.tsx',
      outFile: 'portrait_03_blob.mp4',
    },
    {
      name: 'portrait_04_cards',
      projectFile: './src/examples/portrait_04_cards.tsx',
      outFile: 'portrait_04_cards.mp4',
    },
    {
      name: 'portrait_05_synthgrid',
      projectFile: './src/examples/portrait_05_synthgrid.tsx',
      outFile: 'portrait_05_synthgrid.mp4',
    },
  ];

  for (const job of jobs) {
    console.log(`\n=== Rendering: ${job.name} ===`);
    const file = await renderVideo({
      projectFile: job.projectFile,
      settings: {
        outDir: '../outputs',
        outFile: job.outFile,
        workers: 1,
        logProgress: true,
        puppeteer: {args: ['--no-sandbox']},
        ffmpeg: {
          ffmpegPath: '/opt/homebrew/bin/ffmpeg',
          ffprobePath: '/opt/homebrew/bin/ffprobe',
        },
        projectSettings: {
          size: {x: 720, y: 1280},
        },
      },
    });
    console.log(`Rendered: ${file}`);
  }
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});


