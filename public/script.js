let scripts = []

function addScript(){

const code=document.getElementById("bJVECode").value.trim()

if(!code){

alert("Write code first")

return

}

const name="script"+(scripts.length+1)+".bJVE"

scripts.push({name:name,content:code})

const li=document.createElement("li")

li.textContent=name

document.getElementById("scriptList").appendChild(li)

document.getElementById("bJVECode").value=""

}

function previewHTML(){

const html=document.getElementById("htmlCode").value

document.getElementById("htmlPreview").srcdoc=html

}

function runScripts(){

const consoleDiv=document.getElementById("consoleOutput")

consoleDiv.textContent=""

scripts.forEach(script=>{

const lines=script.content.split("\n")

lines.forEach(lineRaw=>{

const line=lineRaw.trim()

if(line.startsWith("print")){

const msg=line.replace("print ","").replace(/"/g,"")

consoleDiv.textContent+=msg+"\n"

}

if(line.startsWith("lua.wait")){

const t=parseInt(line.split(" ")[1]||1)

consoleDiv.textContent+="[wait "+t+"s]\n"

}

if(line.startsWith("js.run")){

const js=line.split(" ").slice(1).join(" ")

consoleDiv.textContent+="[JS] "+js+"\n"

}

if(line.startsWith("server.get")){

const url=line.split(" ")[1]

consoleDiv.textContent+="[GET] "+url+"\n"

}

})

})

}

function downloadProject(){

if(scripts.length===0){

alert("Add scripts first")

return

}

const zip=new JSZip()

scripts.forEach(s=>{

zip.file(s.name,s.content)

})

zip.file("df.html",document.getElementById("htmlCode").value)

zip.generateAsync({type:"blob"}).then(content=>{

const link=document.createElement("a")

link.href=URL.createObjectURL(content)

link.download="jve-project.zip"

link.click()

})

}

function saveProject(){

const name=prompt("Project name")

if(!name)return

const project={

scripts:scripts,

html:document.getElementById("htmlCode").value

}

localStorage.setItem("jve_"+name,JSON.stringify(project))

loadProjects()

}

function loadProjects(){

const list=document.getElementById("projectList")

list.innerHTML=""

Object.keys(localStorage).forEach(key=>{

if(key.startsWith("jve_")){

const name=key.replace("jve_","")

const li=document.createElement("li")

const loadBtn=document.createElement("button")

loadBtn.textContent="Load "+name

loadBtn.onclick=()=>loadProject(name)

const delBtn=document.createElement("button")

delBtn.textContent="Delete"

delBtn.onclick=()=>{

localStorage.removeItem(key)

loadProjects()

}

li.appendChild(loadBtn)

li.appendChild(delBtn)

list.appendChild(li)

}

})

}

function loadProject(name){

const data=JSON.parse(localStorage.getItem("jve_"+name))

scripts=data.scripts

document.getElementById("htmlCode").value=data.html

document.getElementById("scriptList").innerHTML=""

scripts.forEach(s=>{

const li=document.createElement("li")

li.textContent=s.name

document.getElementById("scriptList").appendChild(li)

})

}

window.onload=loadProjects
