function runSite(){

const html=document.getElementById("htmlCode").value
const css=document.getElementById("cssCode").value
const js=document.getElementById("jsCode").value
const jve=document.getElementById("jveCode").value

const preview=document.getElementById("preview")
const consoleDiv=document.getElementById("console")

consoleDiv.textContent=""

const page=`

<style>${css}</style>

${html}

<script>

${js}

<\/script>

`

preview.srcdoc=page

runJVE(jve)

}

function runJVE(code){

const consoleDiv=document.getElementById("console")

const variables={}

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

if(line.startsWith("html.setText")){

const parts=line.split('"')

const id=parts[1]
const text=parts[3]

const iframe=document.getElementById("preview")

iframe.contentWindow.document.getElementById(id).innerText=text

}

if(line.startsWith("html.setStyle")){

const parts=line.split('"')

const id=parts[1]
const style=parts[3]

const iframe=document.getElementById("preview")

iframe.contentWindow.document.getElementById(id).style=style

}

if(line.startsWith("js.call")){

const parts=line.split('"')

const fn=parts[1]

const iframe=document.getElementById("preview")

iframe.contentWindow[fn]()

}

}

}
