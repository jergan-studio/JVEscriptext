const express = require("express")
const { exec } = require("child_process")
const path = require("path")
const fs = require("fs")
const glob = require("glob")

const app = express()
app.use(express.json())
app.use(express.static("public"))

// Main page
app.get("/", (req,res)=>{
    res.sendFile(path.join(__dirname,"public","index.html"))
})

// Run all .bJVE scripts in a folder
function runAllScripts(deployPath){
    return new Promise((resolve, reject)=>{
        glob(`${deployPath}/**/*.bJVE`, (err, files)=>{
            if(err) return reject(err)
            if(files.length === 0) return reject("No .bJVE files found!")

            let outputs = []
            let tasks = files.map(file=>{
                return new Promise(res=>{
                    exec(`node interpreter.js "${file}"`, (err, stdout, stderr)=>{
                        if(err){
                            outputs.push(`Error running script ${file}:\n${stderr}`)
                        } else {
                            outputs.push(stdout)
                        }
                        res()
                    })
                })
            })

            Promise.all(tasks).then(()=>resolve(outputs.join("\n")))
        })
    })
}

// Deploy endpoint
app.post("/deploy", async (req,res)=>{
    const repo = req.body.repo
    if(!repo) return res.send("No repo URL provided")
    const repoName = repo.split("/").pop().replace(".git","")
    const deployPath = path.join(__dirname,"deployed_repos",repoName)

    // Remove old folder if exists
    if(fs.existsSync(deployPath)){
        fs.rmSync(deployPath,{recursive:true,force:true})
    }

    // Git clone with error logging
    exec(`git clone ${repo} "${deployPath}"`, async (err, stdout, stderr)=>{
        if(err){
            console.error("Git clone error:", stderr)
            return res.send("Git clone failed:\n"+stderr)
        }
        console.log("Git clone output:", stdout)

        try{
            const output = await runAllScripts(deployPath)
            let responseText = output + "\n"

            // check for index.html or df.html in the repo
            let clientPath = path.join(deployPath,"index.html")
            if(!fs.existsSync(clientPath)){
                clientPath = path.join(deployPath,"df.html")
            }

            if(fs.existsSync(clientPath)){
                responseText += `Play client here: /play/${repoName}`
            }

            res.send(responseText)
        }catch(e){
            res.send("Error running scripts: "+e)
        }
    })
})

// Serve client pages
app.get("/play/:repo", (req,res)=>{
    const deployPath = path.join(__dirname,"deployed_repos",req.params.repo)
    let clientPath = path.join(deployPath,"index.html")
    if(!fs.existsSync(clientPath)){
        clientPath = path.join(deployPath,"df.html")
    }

    if(fs.existsSync(clientPath)){
        res.sendFile(clientPath)
    } else {
        res.send("Client page not found")
    }
})

app.listen(3000, ()=>{
    console.log("JVEscriptext running on port 3000")
})
