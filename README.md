# mopidy-twitter

[![npm](https://img.shields.io/npm/v/mopidy-twitter.svg)](https://www.npmjs.com/package/mopidy-twitter) [![Dependencies](https://img.shields.io/david/zentrick/mopidy-twitter.svg)](https://david-dm.org/zentrick/mopidy-twitter) [![JavaScript Standard Style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](https://github.com/feross/standard)

Tweets the song that's currently playing in [Mopidy](https://www.mopidy.com/).
What we use at [Zentrick](https://www.zentrick.com/) HQ to populate
[@zentrickjukebox](https://twitter.com/zentrickjukebox).

## Installation

```bash
npm i -g mopidy-twitter
```

## Configuration

`~/.config/mopidy-twitter/mopidy.json`:

```json
{
  "hostname": "127.0.0.1",
  "port": 6680
}
```

`~/.config/mopidy-twitter/twitter.json`:

```json
{
  "consumer_key": "...",
  "consumer_secret": "...",
  "access_token_key": "...",
  "access_token_secret": "..."
}
```

## Usage

```bash
mopidy-twitter &
```

## Maintainer

[Tim De Pauw](https://github.com/timdp)

## License

MIT
