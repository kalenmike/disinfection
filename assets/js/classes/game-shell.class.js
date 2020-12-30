/**
 *   @Author      : Kalen Michael
 *   @Website     : https://www.kalenmichael.com
 *   @Version     : 1.0.0
 *   @Created     : 30 December 2020
 *   @Modified    : 30 December 2020
 */

class GameShell {
    levelData; // Holds the level data as js object
    level; // Holds the level object created via the Level class
    menu;

    constructor(elemID) {
        this.gameMount = document.getElementById(elemID);
        this.levelNum = 1; // Initiate at level 1

        this.play();
    }

    levelCallback(response) {
        if (response.win == true) {
            this.levelNum++;
            this.play();
        } else {
            this.showGameOverMenu();
        }
    }

    play() {
        this.loadLevelData() // Load the json in an object
            .then((levelData) => {
                if (levelData){
                    this.levelData = levelData;
                }else{
                    throw Error("Not Found");
                }
            })
            .then(() => this.showGameMenu())
            .catch(error => {
                if(error.message == "Not Found"){
                    this.showGameCompleteMenu();
                }else{
                    console.log(error);
                }
            });
    }

    showGameMenu() {
        // Set parent
        this.menu = document.createElement("div");
        this.menu.setAttribute("id", "menu");

        // Logo
        let logo = document.createElement("div");
        logo.classList.add("logo");
        this.menu.appendChild(logo);

        let levelName = document.createElement("div");
        levelName.setAttribute("id", "header");
        levelName.innerText = this.levelData.name;
        this.menu.appendChild(levelName);

        let levelInstructions = document.createElement("div");
        levelInstructions.setAttribute("id", "description");
        levelInstructions.innerText = this.levelData.text;
        this.menu.appendChild(levelInstructions);

        // Level Data
        let levelDifficulty = document.createElement("div");
        levelDifficulty.innerText = "Difficulty : " + this.levelData.difficulty;
        this.menu.appendChild(levelDifficulty);

        // Start Button
        let startBtn = document.createElement("button");
        startBtn.classList.add("button");
        startBtn.innerText = "Play Disinfection";
        startBtn.addEventListener("click", () => {
            this.removeGameMenu();
            this.level = new Level(
                this.levelData,
                this.levelCallback.bind(this)
            );
        });
        this.menu.appendChild(startBtn);

        this.gameMount.appendChild(this.menu);
    }

    showGameCompleteMenu() {
        // Clear all elements
        this.gameMount.innerHTML = "";

        // Set parent
        this.menu = document.createElement("div");
        this.menu.setAttribute("id", "menu");

        // Logo
        let logo = document.createElement("div");
        logo.classList.add("logo");
        this.menu.appendChild(logo);

        let levelName = document.createElement("div");
        levelName.setAttribute("id", "header");
        levelName.innerText = "GAME COMPLETE";
        this.menu.appendChild(levelName);

        let levelInstructions = document.createElement("div");
        levelInstructions.setAttribute("id", "description");
        levelInstructions.innerText = "Wow! You are an expert, you finished the game in no time!";
        this.menu.appendChild(levelInstructions);

        // Start Button
        let startBtn = document.createElement("button");
        startBtn.classList.add("button");
        startBtn.innerText = "Play Again";
        startBtn.addEventListener("click", () => {
            this.removeGameMenu();
            this.levelNum = 1; // Reset Game
            this.play();
        });
        this.menu.appendChild(startBtn);

        this.gameMount.appendChild(this.menu);
    }

    showGameOverMenu() {
        // Clear all elements
        this.gameMount.innerHTML = "";

        // Set parent
        this.menu = document.createElement("div");
        this.menu.setAttribute("id", "menu");

        // Logo
        let logo = document.createElement("div");
        logo.classList.add("logo");
        this.menu.appendChild(logo);

        let levelName = document.createElement("div");
        levelName.setAttribute("id", "header");
        levelName.innerText = "GAME OVER";
        this.menu.appendChild(levelName);

        let levelInstructions = document.createElement("div");
        levelInstructions.setAttribute("id", "description");
        levelInstructions.innerText = "Try harder next time";
        this.menu.appendChild(levelInstructions);

        // Start Button
        let startBtn = document.createElement("button");
        startBtn.classList.add("button");
        startBtn.innerText = "Start Over";
        startBtn.addEventListener("click", () => {
            this.removeGameMenu();
            this.levelNum = 1; // Reset Game
            this.play();
        });
        this.menu.appendChild(startBtn);

        this.gameMount.appendChild(this.menu);
    }

    removeGameMenu() {
        this.menu.parentNode.removeChild(this.menu);
    }

    async loadLevelData() {
        const response = await fetch(
            "/assets/js/levels/level-" + this.levelNum + ".json"
        );
        if (response.status != 404){
            const levelData = response.json();
            return levelData;
        }else{
            return false;
        }
    }
}
