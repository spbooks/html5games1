import math from "../utils/math.js";

class SoundGroup {
  constructor(sounds) {
    this.sounds = sounds;
  }

  // play one of the audio group (random)
  play(opts) {
    const { sounds } = this;
    math.randOneFrom(sounds).play(opts);
  }

  // stop ALL audio instance of the group
  stop() {
    this.sounds.forEach(sound => sound.stop());
  }
}

export default SoundGroup;
