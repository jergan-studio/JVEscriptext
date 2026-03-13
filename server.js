const express = require("express")
const { exec } = require("child_process")
const path = require("path")
const glob = require("glob")

const app = express()

app.use(express.json())
app.use(express.static("public"))

app.get("/", (req,res)=>{
res.sendFile(path.join(__dirname,"public","index.html"))
})

app.post("/deploy",(req,res)=>{

const repo=req.body.repo

exec(`rm -rf project && git clone ${repo} project`,()=>{

glob("project/**/*.bJVE",(err,files)=>{

if(files.length === 0){
return res.send("No .bJVE files found in repo")
}

let output=""

files.forEach(file=>{

exec(`node interpreter.js ${file}`,
(err,stdout)=>{

output+=stdout+"\n"

})

})

setTimeout(()=>{
res.send(output)
},1000)

})

})

})

app.listen(3000,()=>{
console.log("JVEscriptext running")
})
