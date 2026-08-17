# Hero flyover clips

The hero background plays a reel of aerial clips. Drop the `.mp4` files in this folder,
then list them in play order at the top of [`js/main.js`](../js/main.js):

```js
const HERO_CLIPS = [
  'videos/waco-suspension-bridge.mp4',
  'videos/mclane-stadium.mp4'
];
```

Any number of clips works. Each one plays through once, crossfades into the next, and the
reel loops forever. A single clip in the list just loops on its own.

If a file is missing or won't play, the hero silently falls back to the still photo — so
it is safe to deploy before the footage is ready.

## Encoding

| Setting  | Value                                                        |
| -------- | ------------------------------------------------------------ |
| Format   | MP4, H.264 (`yuv420p`) — the only codec every browser plays   |
| Size     | 1920×1080, landscape                                          |
| Length   | 8–15 seconds per clip                                         |
| Audio    | None — strip it; the hero is muted and audio is dead weight   |
| File size| Under ~5 MB each; the whole reel under ~15 MB                 |

Compress a source clip with ffmpeg:

```bash
ffmpeg -i source.mov \
  -vf "scale=1920:-2" -r 30 \
  -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 26 -preset slow \
  -movflags +faststart -an \
  waco-suspension-bridge.mp4
```

`-movflags +faststart` matters: it moves the index to the front of the file so playback
begins before the whole clip has downloaded. Raise `-crf` (28, 30) for smaller files.

## Framing

The video is cropped to fill the hero with `object-fit: cover`, and the headline sits over
the **left** side. Slow, steady moves read best — a drifting orbit or a straight push-in.
Fast pans and hard cuts fight the text.

## Still photo

`images/waco-bridge-hero.jpg` is what shows before the first clip starts, on reduced-motion
and data-saver settings, and if the videos fail to load. It is a Creative Commons photo that
requires attribution. Replacing it with an exported frame from your own footage removes that
requirement — the path is set once in `css/styles.css` under `.hero-media`.

## Committing

Video files are large for a git repo. Keep the whole reel well under 100 MB (GitHub's
per-file hard limit is 100 MB, and it warns above 50 MB). If the footage grows past that,
host the clips on a CDN and put the full URLs in `HERO_CLIPS` instead.
