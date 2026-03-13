const DEPLOY_KEY = "test123"; // Deployment key

function deployRepo(folder){
  const key = document.getElementById("deployKey").value;
  const status = document.getElementById("deployStatus") || document.createElement("div");
  if(!document.getElementById("deployStatus")) {
    document.querySelector(".deploy-section").appendChild(status);
    status.id = "deployStatus";
  }

  if(key !== DEPLOY_KEY){
    status.textContent = "❌ Invalid deployment key!";
    return;
  }

  status.textContent = `🚀 Deploying ${folder}...`;

  setTimeout(()=>{
    status.textContent = `✅ Deployment complete! Visit c.html and load folder: ${folder}`;
  },1500);
}
