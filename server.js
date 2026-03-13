const express = require("express")
const { exec } = require("child_process")
const path = require("path")
const fs = require("fs")
const glob = require("glob")

const app = express()
app.use(express.json())
app.use(express.static("public"))

// log everything
function safeExec(cmd){
  console.log("Running:", cmd)
  return new Promise((resolve,reject)=>{
    exec(cmd, (err,stdout,stderr)=>{
      if(err){
        console.error("ERROR:",stderr)
        reject(stderr)
      } else {
        console.log("OK:",stdout)
        resolve(stdout)
      }
    })
  })
}

app.get("/", (req,res)=>{
  res.sendFile(path.join(__dirname,"public","index.html"))
})

function runAllScripts(deployPath){
  return new Promise((resolve, reject)=>{
    glob(`${deployPath}/**/*.bJVE`, (err, files)=>{
      if(err) return reject(err)
      if(files.length===0) return reject("No .bJVE scripts found!")

      let outputs=[]
      let tasks=files.map(file=>{
        return safeExec(`node interpreter.js "${file}"`).then(o=>{
          outputs.push(o)
        }).catch(e=>{
          outputs.push("Error in script: "+e)
        })
      })

      Promise.all(tasks).then(()=>{
        resolve(outputs.join("\n"))
      })
    })
  })
}

app.post("/deploy", async (req,res)=>{
  const repo=req.body.repo
  if(!repo) return res.send("No repo provided")
  const repoName = repo.split("/").pop().replace(".git","")
  const deployPath = path.join(__dirname,"deployed_repos",repoName)

  // safer cleanup
  if(fs.existsSync(deployPath)){
    fs.rmSync(deployPath,{recursive:true,force:true})
  }

  try{
    await safeExec(`git clone ${repo} "${deployPath}"`)
    const output = await runAllScripts(deployPath)
    let responseText = output + "\n"
    const clientPath = path.join(deployPath,"index.html")
    if(fs.existsSync(clientPath)){
      responseText += `Play client here: /play/${repoName}`
    }
    res.send(responseText)
  }catch(e){
    res.send("Deploy error: "+e)
  }
})

app.get("/play/:repo", (req,res)=>{
  const clientPath = path.join(__dirname,"deployed_repos",req.params.repo,"index.html")
  if(fs.existsSync(clientPath)){
    res.sendFile(clientPath)
  } else {
    res.send("Client page not found")
  }
})

app.listen(3000,()=>{
  console.log("JVEscriptext running")
})
