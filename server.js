const express = require("express")
const fileUpload = require("express-fileupload")
const fs = require("fs")
const path = require("path")
const glob = require("glob")
const { exec } = require("child_process")

const app = express()
app.use(express.static("public"))
app.use(fileUpload())

// Run .bJVE scripts
function runAllScripts(folder){
    return new Promise((resolve,reject)=>{
        glob(`${folder}/**/*.bJVE`, (err, files)=>{
            if(err) return reject(err)
            if(files.length===0) return reject("No .bJVE files found!")
            let outputs=[]
            let tasks = files.map(file=>{
                return new Promise(res=>{
                    exec(`node interpreter.js "${file}"`, (err, stdout, stderr)=>{
                        if(err) outputs.push(`Error in ${file}:\n${stderr}`)
                        else outputs.push(stdout)
                        res()
                    })
                })
            })
            Promise.all(tasks).then(()=>resolve(outputs.join("\n")))
        })
    })
}

// Upload endpoint
app.post("/upload", async (req,res)=>{
    if(!req.files || !req.files.folderZip) return res.send("No folder uploaded")
    const folderZip = req.files.folderZip
    const uploadPath = path.join(__dirname,"uploads",folderZip.name.replace(".zip",""))

    // Make folder
    fs.mkdirSync(uploadPath, {recursive:true})

    // Save uploaded zip temporarily
    const tempZipPath = path.join(__dirname,"uploads",folderZip.name)
    await folderZip.mv(tempZipPath)

    // Unzip
    const unzipper = require("unzipper")
    fs.createReadStream(tempZipPath).pipe(unzipper.Extract({path: uploadPath})).on("close", async ()=>{
        fs.unlinkSync(tempZipPath) // remove zip
        try{
            const output = await runAllScripts(uploadPath)
            let clientPath = path.join(uploadPath,"index.html")
            if(!fs.existsSync(clientPath)) clientPath = path.join(uploadPath,"df.html")
            let htmlOutput = output + "\n"
            if(fs.existsSync(clientPath)){
                htmlOutput += `<br><a href="/play/${folderZip.name.replace(".zip","")}" target="_blank">Open Client</a>`
            }
            res.send(htmlOutput)
        }catch(e){
            res.send("Error running scripts: "+e)
        }
    })
})

// Serve client pages
app.get("/play/:folder", (req,res)=>{
    const folderPath = path.join(__dirname,"uploads",req.params.folder)
    let clientPath = path.join(folderPath,"index.html")
    if(!fs.existsSync(clientPath)) clientPath = path.join(folderPath,"df.html")
    if(fs.existsSync(clientPath)) res.sendFile(clientPath)
    else res.send("Client page not found")
})

app.listen(3000, ()=>console.log("JVEscriptext running"))
