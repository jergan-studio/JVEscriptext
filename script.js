const files = {
"index.html":"<h1 id='title'>Hello</h1>\n<button onclick='hello()'>Click</button>",
"style.css":"body{font-family:Arial;text-align:center;}",
"script.js":"function hello(){alert('Hello from JS')}",
"main.jve":"var player = \"Joseph\"\nprint \"Hello \" + player\nhtml.text \"title\" \"Hello Joseph\""
}

let currentFile="index.html"

function refreshFiles(){

const list=document.getElementById("fileList")
list.innerHTML=""

Object.keys(files).forEach(name=>{

const li=document.createElement("li")
li.textContent=name

li.onclick=()=>openFile(name)

list.appendChild(li)

})

}

function openFile(name){

currentFile=name

document.getElementById("code").value=files[name]

}

document.getElementById("code").addEventListener("input",()=>{

files[currentFile]=document.getElementById("code").value

})

function addFile(){

const name=prompt("File name")

if(!name)return

files[name]=""

refreshFiles()

}

function runProject(){

const html=files["index.html"]||""
const css=files["style.css"]||""
const js=files["script.js"]||""
const jve=files["main.jve"]||""

const page=`

<style>${css}</style>

${html}

<script>
${js}
<\/script>

`

document.getElementById("preview").srcdoc=page

runJVE(jve)

}

function runJVE(code){

const consoleDiv=document.getElementById("console")

consoleDiv.textContent=""

const vars={}

const lines=code.split("\n")

for(let line of lines){

line=line.trim()

if(line.startsWith("var")){

const parts=line.replace("var","").split("=")

const name=parts[0].trim()
const value=parts[1].replace(/"/g,"").trim()

vars[name]=value

}

if(line.startsWith("print")){

let msg=line.replace("print","").trim()

Object.keys(vars).forEach(v=>{
msg=msg.replace(v,vars[v])
})

msg=msg.replace(/"/g,"")

consoleDiv.textContent+=msg+"\n"

}

if(line.startsWith("html.text")){

const parts=line.split('"')

const id=parts[1]
const text=parts[3]

document.getElementById("preview")
.contentWindow.document
.getElementById(id).innerText=text

}

}

}

refreshFiles()
openFile("index.html")
