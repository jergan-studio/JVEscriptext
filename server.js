const express = require("express")
const { exec } = require("child_process")
const path = require("path")
const glob = require("glob")
const fs = require("fs")

const app = express()

app.use(express.json())
app.use(express.static("public"))

// Main site
app.get("/", (req,res)=>{
    res.sendFile(path.join(__dirname,"public","index.html"))
})

// Deploy endpoint
app.post("/deploy", (req,res)=>{
    const repo = req.body.repo
    const repoName = repo.split("/").pop().replace(".git","")
    const deployPath = path.join(__dirname,"deployed_repos",repoName)

    // Remove old folder if exists
    exec(`rm -rf ${deployPath} && git clone ${repo} ${deployPath}`, ()=>{

        // Find all .bJVE scripts
        glob(`${deployPath}/**/*.bJVE`, (err, files)=>{
            if(files.length === 0) return res.send("No .bJVE scripts found!")

            let output = ""

            files.forEach(file=>{
                exec(`node interpreter.js ${file}`, (err, stdout)=>{
                    output += stdout + "\n"
                })
            })

            // Wait a moment for all scripts to run
            setTimeout(()=>{
                // Check if the repo has index.html
                const clientPath = path.join(deployPath,"index.html")
                if(fs.existsSync(clientPath)){
                    output += `\nPlay client here: /play/${repoName}`
                }
                res.send(output)
            },1000)
        })

    })
})

// Serve repo client pages
app.use("/play/:repo", (req,res)=>{
    const repoName = req.params.repo
    const clientPath = path.join(__dirname,"deployed_repos",repoName,"index.html")
    if(fs.existsSync(clientPath)){
        res.sendFile(clientPath)
    } else {
        res.send("Client page not found")
    }
})

app.listen(3000, ()=>{
    console.log("JVEscriptext running")
})
