const express = require("express")
const app = express()
const LOCAL_PORT = 3000

app.get("/", (req, res) => {
    res.send("HELLO")
})

const server = app.listen(LOCAL_PORT, () => {
    console.log(`LISTENING ON PORT ${LOCAL_PORT}`);
})