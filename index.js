const express = require("express");
const fs = require("fs")
const path = require("path")
const app = express()
const LOCAL_PORT = 3000
////////////////////////////////////////////////////////////
const { ffmpeg, fetchFile, fsFFmpeg } = require("./ffmpeg");
const { upload } = require("./storage");
////////////////////////////////////////////////////////////

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
    
    const input = `${body.resourceId}.${body.type}`;
    const command = body.command
    const output = `output_${body.resourceId}.${body.type}`

    ffmpeg.FS("writeFile", input, await fetchFile(`./input/${input}`))
    await ffmpeg.run("-i", input, "-vf", command, output)
    await fsFFmpeg.promises.writeFile(`./output/${output}`, ffmpeg.FS("readFile", output))

    res.json({ msg: "done" })
})

app.get("/api/download/:id", (req, res) => {
    const { params } = req
    console.log(params);
    const options = {
        root: path.join(__dirname, "output")
    }
    res.sendFile(`output_${params.id}`, options)
})

app.post("/deleteAllRes", (req, res) => {
    const outputDir = "output"
    const inputDir = "input"

    //clear output
    fs.readdir(outputDir, (err, files) => {
        if (err) console.log(err);

        for (let file of files) {
            fs.unlink(path.join(outputDir, file), (e) => {
                console.log(e);
            })
        }
    })
    //clear input
    fs.readdir(inputDir, (err, files) => {
        if (err) console.log(err);

        for (let file of files) {
            fs.unlink(path.join(inputDir, file), (e) => {
                console.log(e);
            })
        }
    })

    res.json({ msg: "DONE!" })
})

app.get("/", (req, res) => {
    res.send("HELLO")
})

const server = app.listen(LOCAL_PORT, () => {
    console.log(`LISTENING ON PORT ${LOCAL_PORT}`);
})