const { spawn } = require("child_process");
const ffmpegPath = require("ffmpeg-static");

function convertToWav(inputBuffer) {
    return new Promise((resolve, reject) => {
        if (!inputBuffer || inputBuffer.length === 0) {
            return reject(new Error("Audio recording is empty."));
        }

        const ffmpeg = spawn(ffmpegPath, [
            "-hide_banner",
            "-loglevel", "error",
            "-i", "pipe:0",
            "-vn",
            "-ac", "1",
            "-ar", "16000",
            "-c:a", "pcm_s16le",
            "-f", "wav",
            "pipe:1"
        ]);

        const output = [];
        let errorOutput = "";

        ffmpeg.stdout.on("data", chunk => output.push(chunk));
        ffmpeg.stderr.on("data", chunk => {
            errorOutput += chunk.toString();
        });

        ffmpeg.on("error", error => reject(error));

        ffmpeg.on("close", code => {
            if (code !== 0) {
                return reject(
                    new Error(`Audio conversion failed: ${errorOutput}`)
                );
            }

            const wavBuffer = Buffer.concat(output);

            if (wavBuffer.length < 44) {
                return reject(new Error("Converted WAV audio is invalid."));
            }

            resolve(wavBuffer);
        });

        ffmpeg.stdin.on("error", error => {
            if (error.code !== "EPIPE") reject(error);
        });

        ffmpeg.stdin.end(inputBuffer);
    });
}

module.exports = { convertToWav };