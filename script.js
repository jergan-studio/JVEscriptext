function runJVE(){

const code=document.getElementById("code").value
const consoleDiv=document.getElementById("console")

consoleDiv.textContent=""

const variables={}
const functions={}
let currentEvent=null

const lines=code.split("\n")

for(let line of lines){

line=line.trim()

if(line.startsWith("var")){

const parts=line.replace("var","").split("=")

const name=parts[0].trim()

const value=parts[1].replace(/"/g,"").trim()

variables[name]=value

}

if(line.startsWith("print")){

let msg=line.replace("print","").trim()

Object.keys(variables).forEach(v=>{
msg=msg.replace(v,variables[v])
})

msg=msg.replace(/"/g,"")

consoleDiv.textContent+=msg+"\n"

}

if(line.startsWith("event")){

currentEvent=line.split(" ")[1]

consoleDiv.textContent+="[event registered: "+currentEvent+"]\n"

}

}

}
