const express = require("express")
const {exec} = require("child_process")

const app = express()

app.use(express.json())
app.use(express.static("public"))

app.post("/deploy",(req,res)=>{

const repo=req.body.repo

exec(`git clone ${repo} project`,()=>{

exec(`node interpreter.js project/main.bJVE`,
(err,stdout)=>{

res.send(stdout)

})

})

})

app.listen(3000,()=>{
console.log("JVEscriptext running")
})
