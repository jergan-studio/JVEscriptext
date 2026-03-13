const express = require("express")
const { exec } = require("child_process")
const path = require("path")

const app = express()

app.use(express.json())

// serve website
app.use(express.static(path.join(__dirname,"public")))

// homepage
app.get("/", (req,res)=>{
res.sendFile(path.join(__dirname,"public","index.html"))
})

app.post("/deploy",(req,res)=>{

const repo=req.body.repo

exec(`git clone ${repo} project`,()=>{

exec(`node interpreter.js project/main.bJVE`,
(err,stdout)=>{

if(err){
return res.send("Error running JVE script")
}

res.send(stdout)

})

})

})

app.listen(3000,()=>{
console.log("JVEscriptext running")
})
