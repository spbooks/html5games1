/*
  options can include:
    volume (0 - 1)
    loop (boolean)
*/
class Sound {
  constructor(src, options) {
    this.src = src;
    this.options = Object.assign({ volume: 1 }, options);

    // Configure audio element
    const audio = new Audio();
    audio.src = src;
    if (this.options.loop) {
      audio.loop = true;
    }
    audio.addEventListener(
      "error",
      () => {
        throw Error(`Error loading audio: ${src}`);
      },
      false
    );
    this.audio = audio;
  }

  play(overrides) {
    const { audio, options } = this;
    const opts = Object.assign({ time: 0 }, options, overrides);
    audio.volume = opts.volume;
    audio.currentTime = opts.time;
    audio.play();
  }
}

export default Sound;
