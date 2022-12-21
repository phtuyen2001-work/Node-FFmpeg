const express = require("express");
const app = express()
const LOCAL_PORT = 3000
const { ffmpeg, fetchFile, fsFFmpeg } = require("./ffmpeg");
const { upload } = require("./storage");

app.use(express.json())

app.post("/api/upload", upload.array('input', 3), (req, res) => {
    console.log('file', req.files);
    console.log('body', req.body);

    res.json({ msg: "uploaded" })
})

app.post("/api/execute/:name", (req, res) => {
    const { params } = req

})

app.post("/testExecute", async (req, res) => {
    ffmpeg.FS("writeFile", "test.mp4", await fetchFile("./input/test.mp4"))
    await ffmpeg.run("-i", "test.mp4", "-vf", "eq=brightness=0.3:gamma_r=1.5", "output.mp4")
    await fsFFmpeg.promises.writeFile("./output/output.mp4", ffmpeg.FS("readFile", "output.mp4"))

    res.send("TEST EXECUTED!")
})

app.get("/", (req, res) => {
    res.send("HELLO")
})

const server = app.listen(LOCAL_PORT, () => {
    console.log(`LISTENING ON PORT ${LOCAL_PORT}`);
})