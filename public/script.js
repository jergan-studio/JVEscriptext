let scripts = []
let currentProject = ""

// Save project
function saveProject(){
    const name = prompt("Project name:")
    if(!name) return

    const project = {
        scripts: scripts,
        html: document.getElementById("htmlCode").value
    }

    localStorage.setItem("jve_project_"+name, JSON.stringify(project))
    loadProjects()
}

// Load project list
function loadProjects(){
    const list = document.getElementById("projectList")
    list.innerHTML = ""

    Object.keys(localStorage).forEach(key=>{
        if(key.startsWith("jve_project_")){
            const name = key.replace("jve_project_","")

            const li = document.createElement("li")

            const loadBtn = document.createElement("button")
            loadBtn.textContent = "Load " + name
            loadBtn.onclick = ()=>loadProject(name)

            const delBtn = document.createElement("button")
            delBtn.textContent = "Delete"
            delBtn.onclick = ()=>{
                localStorage.removeItem(key)
                loadProjects()
            }

            li.appendChild(loadBtn)
            li.appendChild(delBtn)

            list.appendChild(li)
        }
    })
}

// Load a project
function loadProject(name){
    const data = JSON.parse(localStorage.getItem("jve_project_"+name))

    scripts = data.scripts
    document.getElementById("htmlCode").value = data.html

    const list = document.getElementById("scriptList")
    list.innerHTML = ""

    scripts.forEach(s=>{
        const li = document.createElement("li")
        li.textContent = s.name
        list.appendChild(li)
    })
}

// Run on page load
window.onload = loadProjects
