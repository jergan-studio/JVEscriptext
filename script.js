function deployProject(){
  const key = document.getElementById("deployKey").value;
  const folder = document.getElementById("folderName").value;
  const status = document.getElementById("deployStatus");

  if(!key || !folder){
    status.textContent = "Please enter deployment key and folder name!";
    return;
  }

  // Simulate deployment (replace with actual API call)
  status.textContent = "Deploying " + folder + "...";

  setTimeout(()=>{
    status.textContent = "✅ Deployment complete! Visit c.html?folder=" + folder;
  },1500);
}

function loadClient(){
  const folder = document.getElementById("folderName").value;
  const iframe = document.getElementById("clientPreview");
  const consoleDiv = document.getElementById("clientConsole");

  if(!folder){
    consoleDiv.textContent = "Enter a deployed folder name!";
    return;
  }

  // Load the deployed index.html from folder
  iframe.src = folder + "/index.html";
  consoleDiv.textContent = "Loaded " + folder;
}
