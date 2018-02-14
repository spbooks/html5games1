const cache = {};
const readyListeners = [];
const progressListeners = [];

let completed = false;
let remaining = 0;
let total = 0;

function done() {
  completed = true;
  readyListeners.forEach(cb => cb());
}

// Called when a queued asset is ready to use
function onAssetLoad() {
  if (completed) {
    return;
  }

  remaining--;
  progressListeners.forEach(cb => cb(total - remaining, total));
  if (remaining === 0) {
    // We're done loading
    done();
  }
}

// Helper function for queuing assets
function load(url, maker) {
  let cacheKey = url;
  while (cacheKey.startsWith("../")) {
    cacheKey = url.slice(3);
  }
  if (cache[cacheKey]) {
    return cache[cacheKey];
  }
  const asset = maker(url, onAssetLoad);
  remaining++;
  total++;

  cache[cacheKey] = asset;
  return asset;
}

const Assets = {
  get completed() {
    return completed;
  },

  onReady(cb) {
    if (completed) {
      return cb();
    }

    readyListeners.push(cb);
    // No assets to load
    if (remaining === 0) {
      done();
    }
  },

  onProgress(cb) {
    progressListeners.push(cb);
  },

  image(url) {
    return load(url, (url, onAssetLoad) => {
      const img = new Image();
      img.src = url;
      img.addEventListener("load", onAssetLoad, false);
      return img;
    });
  },

  sound(url) {
    return load(url, (url, onAssetLoad) => {
      const audio = new Audio();
      audio.src = url;
      const onLoad = e => {
        audio.removeEventListener("canplay", onLoad);
        onAssetLoad(e);
      };
      audio.addEventListener("canplay", onLoad, false);
      return audio;
    }).cloneNode();
  },

  soundBuffer(url, ctx) {
    return load(url, (url, onAssetLoad) =>
      fetch(url)
        .then(r => r.arrayBuffer())
        .then(
          ab =>
            new Promise(success => {
              ctx.decodeAudioData(ab, buffer => {
                onAssetLoad(url);
                success(buffer);
              });
            })
        )
    );
  },

  json(url) {
    return load(url, (url, onAssetLoad) =>
      fetch(url)
        .then(res => res.json())
        .then(json => {
          onAssetLoad(url);
          return json;
        })
    );
  }
};

export default Assets;
