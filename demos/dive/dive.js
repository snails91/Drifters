window.addEventListener("load", function () {
    let water = document.querySelector("#hublot");
    let patternStrip = document.querySelector("#patternStrip");
    let blobTile = document.querySelector(".patternTile.pattern-blobs");
    let squaresTile = document.querySelector(".patternTile.pattern-squares");
    let paperText = document.querySelector("#paperText");
    let drifter = document.querySelector(".drifter");

    document.body.addEventListener("mousemove", function (event) {
        drifter.style.left = event.clientX + "px";
        drifter.style.top = event.clientY + "px";
    });

    setInterval(function () {
        let radius = 42 + Math.random() * 6;
        drifter.style.borderRadius = radius + "%";
    }, 300);

    //papertext

    if (paperText) {
        let words = paperText.textContent.trim().split(/\s+/);
        paperText.innerHTML = "";
      
        words.forEach(function (word, index) {
            let wordSpan = document.createElement("span");
            wordSpan.className = "word";

            for (let i = 0; i < word.length; i++) {
                let ch = word[i];
                let chSpan = document.createElement("span");
                let lower = ch.toLowerCase();

                chSpan.classList.add("char");

                if (/[a-z]/.test(lower)) {
                    chSpan.classList.add("char-letter-" + lower);
                } else if (/[0-9]/.test(ch)) {
                    chSpan.classList.add("char-number-" + ch);
                } else {
                    chSpan.classList.add("char-symbol");
                }

                chSpan.textContent = ch;
                wordSpan.appendChild(chSpan);
            }

            paperText.appendChild(wordSpan);
            if (index < words.length - 1) {
                paperText.appendChild(document.createTextNode(" "));
            }
        });
    }

    //pattern 1
    // function buildBlobPattern() {
    //     let colors = [
    //         "rgba(255, 60, 220, 0.95)",
    //         "rgba(0, 255, 255, 0.95)",
    //         "rgba(255, 255, 0, 0.95)",
    //         "rgba(120, 255, 60, 0.95)"
    //     ];
    //     let blobs = [];

    //     for (let i = 0; i < 9; i++) {
    //         let x = Math.floor(Math.random() * 100);
    //         let y = Math.floor(Math.random() * 100);
    //         let size = 10 + Math.floor(Math.random() * 20);
    //         let color = colors[i % colors.length];
    //         blobs.push(
    //             "radial-gradient(circle at " + x + "% " + y + "%, transparent " + size + "px, " + color + " " + size + "px, " + color + " " + (size + 1) + "px, transparent " + (size + 1) + "px)"
    //         );
    //     }

    //     blobTile.style.setProperty("--blob-pattern", blobs.join(","));
    // }

    // //pattern2
    // function buildSquaresPattern() {
    //     squaresTile.innerHTML = "";

    //     for (let i = 0; i < 24; i++) {
    //         let dot = document.createElement("div");
    //         dot.className = "square-dot";

    //         let size = 8 + Math.floor(Math.random() * 24);
    //         let x = Math.floor(Math.random() * 92);
    //         let y = Math.floor(Math.random() * 92);
    //         let red = 45 + Math.floor(Math.random() * 35);
    //         let green = 6 + Math.floor(Math.random() * 16);
    //         let blue = 12 + Math.floor(Math.random() * 18);
    //         let darkTone = "rgba(0,0,0,1)";
    //         let lightTone = "rgba(" + (red + 18) + "," + (green + 8) + "," + (blue + 8) + ",0.75)";

    //         dot.style.width = size + "px";
    //         dot.style.height = size + "px";
    //         dot.style.left = x + "%";
    //         dot.style.top = y + "%";
    //         dot.style.setProperty("--square-dark", darkTone);
    //         dot.style.setProperty("--square-light", lightTone);
    //         dot.style.animationDelay = Math.random() * 2 + "s";

    //         squaresTile.appendChild(dot);
    //     }
    // }

    setTimeout(function () {
        water.style.backgroundColor = "rgb(14, 1, 3)";
    }, 200);

    setTimeout(function () {
        water.style.width = "100vw";
        water.style.height = "100vh";
        drifter.style.width = "20px";
        drifter.style.height = "20px";
        patternStrip.classList.add("active");
        buildBlobPattern();
        buildSquaresPattern();
        setInterval(buildBlobPattern, 1800);
    }, 12200);
});