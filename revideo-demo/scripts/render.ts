async function render() {
  console.log('Rendering video (headless)...');

  // IMPORTANT:
  // @revideo/ffmpeg uses fluent-ffmpeg which caches ffmpeg capabilities.
  // Set these env vars BEFORE importing @revideo/renderer so it picks up the
  // system ffmpeg/ffprobe (Homebrew), which supports `lavfi`.
  process.env.FFMPEG_PATH = '/opt/homebrew/bin/ffmpeg';
  process.env.FFPROBE_PATH = '/opt/homebrew/bin/ffprobe';

  const {renderVideo} = await import('@revideo/renderer');

  const file = await renderVideo({
    projectFile: './src/project.tsx',
    settings: {
      // Revideo expects the directory separately; keep outFile as a basename
      // (no slashes) to avoid invalid temp paths.
      outDir: '../outputs',
      outFile: 'revideo_neural.mp4',
      workers: 1,
      logProgress: true,
      // Match prompt intent (1280x720) via project settings override.
      projectSettings: {
        size: {x: 1280, y: 720},
      },
      ffmpeg: {
        // Use system ffmpeg/ffprobe (Homebrew) to ensure lavfi support.
        ffmpegPath: '/opt/homebrew/bin/ffmpeg',
        ffprobePath: '/opt/homebrew/bin/ffprobe',
      },
      puppeteer: {
        args: ['--no-sandbox'],
      },
    },
  });

  console.log(`Rendered video to ${file}`);
}

render().catch(err => {
  console.error(err);
  process.exitCode = 1;
});


