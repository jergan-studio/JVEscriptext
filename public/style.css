let scripts = [];

// Add a script to the project
function addScript() {
    const code = document.getElementById("bJVECode").value.trim();
    if(!code) return alert("Write some code first!");
    const scriptName = `script${scripts.length + 1}.bJVE`;
    scripts.push({name: scriptName, content: code});

    const li = document.createElement("li");
    li.textContent = scriptName;
    document.getElementById("scriptList").appendChild(li);

    document.getElementById("bJVECode").value = "";
}

// Preview df.html client
function previewHTML() {
    const htmlContent = document.getElementById("htmlCode").value;
    const iframe = document.getElementById("htmlPreview");
    iframe.srcdoc = htmlContent;
}

// Run scripts in simulated console
function runScripts() {
    const consoleDiv = document.getElementById("consoleOutput");
    consoleDiv.textContent = "";

    scripts.forEach(script => {
        const lines = script.content.split("\n");
        lines.forEach(lineRaw => {
            const line = lineRaw.trim();

            if(line.startsWith("print")) {
                const msg = line.replace("print ","").replace(/"/g,"");
                consoleDiv.textContent += msg + "\n";
            }

            if(line.startsWith("lua.wait")) {
                const t = parseInt(line.split(" ")[1] || 1);
                consoleDiv.textContent += `[Wait ${t}s simulated]\n`;
            }

            if(line.startsWith("js.run")) {
                const js = line.split(" ").slice(1).join(" ").replace(/"/g,"");
                consoleDiv.textContent += `[JS: ${js}]\n`;
            }

            if(line.startsWith("server.get")) {
                const url = line.split(" ")[1].replace(/"/g,"");
                consoleDiv.textContent += `[Fetch simulated: ${url}]\n`;
            }
        });
    });
}

// Download project as ZIP
function downloadProject() {
    if(scripts.length === 0) return alert("Add at least one .bJVE script!");

    const zip = new JSZip();

    // Add scripts
    scripts.forEach(s => zip.file(s.name, s.content));

    // Add df.html
    zip.file("df.html", document.getElementById("htmlCode").value || "<h1>DF Client</h1>");

    // Generate ZIP
    zip.generateAsync({type:"blob"}).then(content => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(content);
        link.download = "jve-project.zip";
        link.click();
    });
}
