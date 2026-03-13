const fs = require("fs")
const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args))

async function runJVE(file){
    const code = fs.readFileSync(file,"utf8")
    const lines = code.split("\n")

    for(const lineRaw of lines){
        const line = lineRaw.trim()
        if(line.startsWith("print")){
            const msg = line.replace("print ","").replace(/"/g,"")
            console.log(msg)
        }

        if(line.startsWith("lua.wait")){
            const t = parseInt(line.split(" ")[1] || 1)
            await new Promise(r=>setTimeout(r, t*1000))
        }

        if(line.startsWith("server.get")){
            const url = line.split(" ")[1].replace(/"/g,"")
            try{
                const res = await fetch(url)
                const text = await res.text()
                console.log(text)
            }catch(e){
                console.log("Error fetching", url)
            }
        }

        if(line.startsWith("js.run")){
            const js = line.split(" ").slice(1).join(" ").replace(/"/g,"")
            console.log("JS to run:", js)
        }
    }
}

// Run the file from command line
runJVE(process.argv[2])
