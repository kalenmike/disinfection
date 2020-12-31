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
    virusBox;

    constructor(elemID) {
        this.gameMount = document.getElementById(elemID);
        this.levelNum = 1; // Initiate at level 1

        this.showMainMenu();
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
        // Reset all viruses
        if (this.virusBox) {
            this.gameMount.removeChild(this.virusBox);
            this.virusBox = null;
        }
        this.loadLevelData() // Load the json in an object
            .then((levelData) => {
                if (levelData) {
                    this.levelData = levelData;
                } else {
                    throw Error("Not Found");
                }
            })
            .then(() => this.showGameMenu())
            .catch((error) => {
                if (error.message == "Not Found") {
                    this.showGameCompleteMenu();
                } else {
                    console.log(error);
                }
            });
    }

    showMainMenu() {
        // Set parent
        this.menu = document.createElement("div");
        this.menu.setAttribute("id", "menu");
        this.menu.classList.add("no-animation");

        // Logo
        let logo = document.createElement("div");
        logo.classList.add("logo");
        this.menu.appendChild(logo);

        let levelName = document.createElement("div");
        levelName.setAttribute("id", "header");
        levelName.innerText = "Time to fight back";
        this.menu.appendChild(levelName);

        let content = document.createElement("div");
        content.setAttribute("id", "description");

        let mainmenu = [
            {
                "text":"Rules",
                "link":"#"
            },
            {
                "text":"About",
                "link":"#"
            },
            {
                "text":"Credits",
                "link":"#"
            }
        ];

        let innerHTML = '<p class="version">Version 1.0.0</p><ul class="main-menu">';

        mainmenu.forEach(menuItem =>{
            innerHTML += 
            '<li><a href="'+menuItem.link + '">' + menuItem.text + '</a></li>';
        });

        innerHTML += '</ul>';

        content.innerHTML = innerHTML;

        this.menu.appendChild(content);

        // Start Button
        let startBtn = document.createElement("button");
        startBtn.classList.add("button");
        startBtn.innerText = "Play Disinfection";
        startBtn.addEventListener("click", () => {
            this.play();
            this.removeGameMenu();
        });
        this.menu.appendChild(startBtn);

        this.gameMount.appendChild(this.menu);
    }

    showGameMenu() {
        // Add virus box
        this.virusBox = document.createElement("div");
        this.virusBox.setAttribute("id", "virus-box");
        this.gameMount.appendChild(this.virusBox);

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
        levelDifficulty.setAttribute("id", "difficulty");
        this.menu.appendChild(levelDifficulty);

        // Start Button
        let startBtn = document.createElement("button");
        startBtn.classList.add("button");
        startBtn.innerText = "Start Level";
        startBtn.addEventListener("click", () => {
            this.buildLevelGUI();
            this.removeGameMenu();
            this.level = new Level(
                this.levelData,
                this.levelCallback.bind(this)
            );
        });
        this.menu.appendChild(startBtn);

        this.gameMount.appendChild(this.menu);

        // Load the next levels image
        setTimeout(() => {
            // [DEV] We can do better than this solution
            let backgroundImage = 'url("' + this.levelData.imagePath + '")';
            this.gameMount.style.backgroundImage = backgroundImage;
        }, 1000);
    }

    showGameCompleteMenu() {
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
        levelInstructions.innerText =
            "Wow! You are an expert, you finished the game in no time!";
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
        levelInstructions.innerText =
            "So close, but so far. Think you can handle it next time round?";
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

    //Build GUI
    buildLevelGUI() {

        // let version = this.createElementWithId("div", "version");

        let level = this.createElementWithId("div", "level");
        let levelName = this.createElementWithId("div", "level-name");
        levelName.innerText = this.levelData.name;
        let progressBox = this.createElementWithId("div", "progress-box");
        let progressBar = this.createElementWithId("div", "progress-bar");
        progressBox.appendChild(progressBar);

        // Alert
        let alert = this.createElementWithId("div", "alert");
        alert.addEventListener('click', (event)=>{
            event.currentTarget.classList.add('hide');
            event.currentTarget.classList.remove('show');
        })
        let preview = this.createElementWithId("img", "preview");
        let writeUp = this.createElementWithId("div", "write-up");

        // Entry Arrows
        let fromTop = this.createElementWithId("div", "from-top");
        let fromRight = this.createElementWithId("div", "from-right");
        let fromBottom = this.createElementWithId("div", "from-bottom");
        let fromLeft = this.createElementWithId("div", "from-left");

        fromTop.classList.add('arrow');
        fromTop.classList.add('top');

        fromRight.classList.add('arrow');
        fromRight.classList.add('right');

        fromBottom.classList.add('arrow');
        fromBottom.classList.add('bottom');

        fromLeft.classList.add('arrow');
        fromLeft.classList.add('left');

        alert.appendChild(preview);
        alert.appendChild(writeUp);

        level.appendChild(levelName);
        level.appendChild(progressBox);

        this.virusBox.appendChild(alert);

        this.virusBox.appendChild(fromTop);
        this.virusBox.appendChild(fromRight);
        this.virusBox.appendChild(fromBottom);
        this.virusBox.appendChild(fromLeft);

        this.virusBox.appendChild(level);
        // this.gameMount.appendChild(version);
    }

    createElementWithId(elementType, id) {
        var element = document.createElement(elementType);
        element.setAttribute("id", id);
        return element;
    }

    removeGameMenu() {
        this.menu.parentNode.removeChild(this.menu);
    }

    async loadLevelData() {
        const response = await fetch(
            "/assets/js/levels/level-" + this.levelNum + ".json"
        );
        if (response.status != 404) {
            const levelData = response.json();
            return levelData;
        } else {
            return false;
        }
    }
}
