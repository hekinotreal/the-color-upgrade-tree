// Load files

for (file in modInfo.modFiles) {
    let script = document.createElement("script");
    script.setAttribute("src", "js/" + modInfo.modFiles[file] + "?v=" + VERSION.num);
    script.setAttribute("async", "false");
    document.head.insertBefore(script, document.getElementById("temp"));
}

