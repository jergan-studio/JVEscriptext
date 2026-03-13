const fs = require("fs")

function runJVE(file){

const code = fs.readFileSync(file,"utf8")
const lines = code.split("\n")

lines.forEach(line=>{

line=line.trim()

if(line.startsWith("print")){
let msg=line.replace("print ","")
console.log(msg.replace(/"/g,""))
}

if(line.startsWith("server.get")){
let url=line.split(" ")[1].replace(/"/g,"")

fetch(url)
.then(res=>res.text())
.then(data=>console.log(data))
}

if(line.startsWith("lua.wait")){
let t=parseInt(line.split(" ")[1])

setTimeout(()=>{
console.log("Waited "+t+" seconds")
},t*1000)
}

})

}

runJVE(process.argv[2])
