const DEPLOY_KEY = "test123"; // Change for testing

function deployProject(){
  const key = document.getElementById("deployKey").value;
  const folder = document.getElementById("folderName").value;
  const status = document.getElementById("deployStatus");

  if(key !== DEPLOY_KEY){
    status.textContent = "❌ Invalid deployment key!";
    return;
  }

  if(!folder){
    status.textContent = "❌ Enter a folder name!";
    return;
  }

  status.textContent = "🚀 Deploying " + folder + "...";

  setTimeout(()=>{
    status.textContent = "✅ Deployment complete! Visit c.html and load folder: " + folder;
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

  iframe.src = folder + "/index.html";
  consoleDiv.textContent = "Loaded " + folder;
}
