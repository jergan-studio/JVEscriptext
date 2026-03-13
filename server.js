const express = require("express")
const { exec } = require("child_process")
const path = require("path")
const fs = require("fs")
const glob = require("glob")

const app = express()
app.use(express.json())
app.use(express.static("public"))

app.get("/", (req,res)=>{
    res.sendFile(path.join(__dirname,"public","index.html"))
})

// Function to run all .bJVE scripts in a repo folder
function runAllScripts(deployPath){
    return new Promise((resolve, reject)=>{
        glob(`${deployPath}/**/*.bJVE`, (err, files)=>{
            if(err) return reject(err)
            if(files.length===0) return reject("No .bJVE scripts found!")

            let outputs = []
            let promises = files.map(file=>{
                return new Promise(res=>{
                    exec(`node interpreter.js "${file}"`, (err, stdout)=>{
                        outputs.push(stdout)
                        res()
                    })
                })
            })

            Promise.all(promises).then(()=>resolve(outputs.join("\n")))
        })
    })
}

// Deploy endpoint
app.post("/deploy", async (req,res)=>{
    const repo = req.body.repo
    if(!repo) return res.send("No repo provided")
    const repoName = repo.split("/").pop().replace(".git","")
    const deployPath = path.join(__dirname,"deployed_repos",repoName)

    exec(`rm -rf "${deployPath}" && git clone ${repo} "${deployPath}"`, async (err)=>{
        if(err) return res.send("Error cloning repo")

        try{
            const output = await runAllScripts(deployPath)
            const clientPath = path.join(deployPath,"index.html")
            let result = output + "\n"
            if(fs.existsSync(clientPath)){
                result += `Play client here: /play/${repoName}`
            }
            res.send(result)
        }catch(e){
            res.send(e.toString())
        }
    })
})

// Serve repo client pages
app.get("/play/:repo", (req,res)=>{
    const repoName = req.params.repo
    const clientPath = path.join(__dirname,"deployed_repos",repoName,"index.html")
    if(fs.existsSync(clientPath)){
        res.sendFile(clientPath)
    }else{
        res.send("Client page not found")
    }
})

app.listen(3000, ()=>{
    console.log("JVEscriptext running on port 3000")
})
