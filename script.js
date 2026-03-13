<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>JVEscriptext Client</title>
<link rel="icon" href="icon.ico" type="image/x-icon">
<link rel="stylesheet" href="style.css">
</head>
<body>

<header>
  <img src="icon.ico" alt="JVE Logo" class="logo">
  <h1>JVEscriptext Interactive Client</h1>
</header>

<main class="container">
  <div class="client-section">
    <h2>Preview Deployed Site</h2>
    <label>Deployed Folder Name:</label>
    <input type="text" id="folderName" placeholder="Example: jve-test-repo">
    <button onclick="loadClient()">Load</button>
    <br><br>
    <iframe id="clientPreview" src="" width="800" height="500"></iframe>
    <h3>JVE Console:</h3>
    <div id="clientConsole" class="console"></div>
  </div>
</main>

<script src="script.js"></script>
</body>
</html>
