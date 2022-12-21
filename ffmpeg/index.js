const { createFFmpeg, fetchFile } = require("@ffmpeg/ffmpeg");

module.exports.fsFFmpeg = require('fs');
module.exports.fetchFile = fetchFile
module.exports.ffmpeg = createFFmpeg({ log: true });

(async () => {
    if(!this.ffmpeg.isLoaded()) {
        await this.ffmpeg.load();
    }
})();