const express = require("express");
const app = express()
const LOCAL_PORT = 3000
const { ffmpeg, fetchFile, fsFFmpeg } = require("./ffmpeg");
const { upload } = require("./storage");
const path = require("path")

app.use(express.json())

app.post("/api/upload", upload.array('input', 3), (req, res) => {
    console.log('file', req.files);
    console.log('body', req.body);

    const result = req.files[0].filename.split(".")
    res.json({
        resourceId: result[0],
        type: result[1]
    })
})

app.post("/api/execute/:id", async (req, res) => {
    const { body } = req
    // console.log(body);
    // console.log(`${body.resourceId}.${body.type}`);
    // res.json({ msg: "okay" })
    const input = `${body.resourceId}.${body.type}`;
    const command = body.command
    const output = `output_${body.resourceId}.${body.type}`

    ffmpeg.FS("writeFile", input, await fetchFile(`./input/${input}`))
    await ffmpeg.run("-i", input, "-vf", command, output)
    await fsFFmpeg.promises.writeFile(`./output/${output}`, ffmpeg.FS("readFile", output))

    // const options = {
    //     root: path.join(__dirname, "output")
    // }

    res.json({ msg: "done" })
    // res.sendFile(output, options)
})

app.get("/api/download/:id", (req, res) => {
    const { params } = req
    console.log(params);
    res.sendFile(`/output/output_${params}`)
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