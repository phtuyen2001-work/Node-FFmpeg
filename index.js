const express = require("express");
const app = express()
const LOCAL_PORT = 3000
const { ffmpeg, fetchFile, fsFFmpeg } = require("./ffmpeg");

app.post("/execute", async (req, res) => {
    ffmpeg.FS("writeFile", "test.mp4", await fetchFile("./input/test.mp4"))
    await ffmpeg.run("-i", "test.mp4", "-ss", "10", "-t", "3", "output.gif")
    await fsFFmpeg.promises.writeFile("./output/output.gif", ffmpeg.FS("readFile", "output.gif"))

    res.send("EXECUTED!")
})

console.log("to test again")

app.get("/", (req, res) => {
    res.send("HELLO")
})

const server = app.listen(LOCAL_PORT, () => {
    console.log(`LISTENING ON PORT ${LOCAL_PORT}`);
})