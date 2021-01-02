import Page from "./page.class.js";
import Level from "./level.class.js";

export default class GameShell {
    levelData; // Holds the level data as js object
    level; // Holds the level object created via the Level class
    menu;
    virusBox;

    constructor(elemID) {
        this.gameMount = document.getElementById(elemID);
        this.initGameData();
        this.showMainMenu();
    }

    /**
     * Initialise the game data
     * Runs on construction and game over
     */
    initGameData() {
        this.levelNum = 6; // Initiate at level 1
        this.cleanCount = 0;
        this.playerLives = 3; // Init Player Lives
    }

    levelCallback(response) {
        if (response.win == true) {
            this.levelNum++;
            this.cleanCount = response.cleanCount;
            this.play();
        } else {
            this.playerLives--;
            if (this.playerLives > 0) {
                this.play();
            } else {
                this.showGameOverMenu();
            }
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
        this.menu.classList.add("main-menu");
        this.menu.classList.add("no-animation");

        // Logo
        let logo = document.createElement("div");
        logo.classList.add("logo");
        this.menu.appendChild(logo);

        // let levelName = document.createElement("div");
        // levelName.setAttribute("id", "header");
        // levelName.innerText = "Time to fight back";
        // this.menu.appendChild(levelName);

        let content = document.createElement("div");
        content.setAttribute("id", "description");

        let mainmenu = [
            {
                text: "Settings",
                name: "settings",
            },
            {
                text: "Rules",
                name: "rules",
            },
            {
                text: "About",
                name: "about",
            },
            {
                text: "Credits",
                name: "credits",
            },
        ];

        let p = document.createElement("p");
        p.classList.add("version");
        p.innerText = "Version 1.0.0";

        let ul = document.createElement("ul");

        mainmenu.forEach((menuItem) => {
            let li = document.createElement("li");
            li.innerText = menuItem.text;
            li.classList.add("button");
            li.addEventListener("click", () => {
                this.openPage(menuItem.name);
            });
            ul.appendChild(li);
        });

        content.appendChild(p);
        content.appendChild(ul);

        this.menu.appendChild(content);

        let li = document.createElement("li");
        li.innerText = "Play";
        li.classList.add("button");
        li.classList.add("inverse");
        li.addEventListener("click", () => {
            this.play();
            this.removeGameMenu();
        });
        ul.appendChild(li);

        this.gameMount.appendChild(this.menu);
    }

    openPage(name, level = null) {
        let page = new Page(name, level);
        this.gameMount.appendChild(page);
    }

    updatePlayerLivesGUI() {
        if (this.playerLives == 1) {
            document.getElementById("life-one").classList.remove('lost');
            document.getElementById("life-two").classList.add('lost');
            document.getElementById("life-three").classList.add('lost');
        } else if (this.playerLives == 2) {
            document.getElementById("life-one").classList.remove('lost');
            document.getElementById("life-two").classList.remove('lost');
            document.getElementById("life-three").classList.add('lost');
        } else if (this.playerLives == 3) {
            document.getElementById("life-one").classList.remove('lost');
            document.getElementById("life-two").classList.remove('lost');
            document.getElementById("life-three").classList.remove('lost');
        }
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
                this.cleanCount,
                this.levelCallback.bind(this)
            );
            // [DEV] This solves the unpause problem but needs work
            document
                .getElementById("pause-button")
                .addEventListener("click", () => {
                    this.openPage("settings", this.level);
                });
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
            this.initGameData();
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
        startBtn.innerText = "Main Menu";
        startBtn.addEventListener("click", () => {
            this.removeGameMenu();
            this.initGameData();
            this.showMainMenu();
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
        alert.addEventListener("click", (event) => {
            event.currentTarget.classList.add("hide");
            event.currentTarget.classList.remove("show");
        });
        let preview = this.createElementWithId("img", "preview");
        let writeUp = this.createElementWithId("div", "write-up");

        // Entry Arrows
        let fromTop = this.createElementWithId("div", "from-top");
        let fromRight = this.createElementWithId("div", "from-right");
        let fromBottom = this.createElementWithId("div", "from-bottom");
        let fromLeft = this.createElementWithId("div", "from-left");

        fromTop.classList.add("arrow");
        fromTop.classList.add("top");

        fromRight.classList.add("arrow");
        fromRight.classList.add("right");

        fromBottom.classList.add("arrow");
        fromBottom.classList.add("bottom");

        fromLeft.classList.add("arrow");
        fromLeft.classList.add("left");

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
        let healthCounterInner =
            "<svg " +
            'xmlns:dc="http://purl.org/dc/elements/1.1/" ' +
            'xmlns:cc="http://creativecommons.org/ns#" ' +
            'xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" ' +
            'xmlns:svg="http://www.w3.org/2000/svg" ' +
            'xmlns="http://www.w3.org/2000/svg" ' +
            'id="test-tube" ' +
            'version="1.1" ' +
            'viewBox="0 0 276.95312 1000" ' +
            'height="1000" ' +
            'width="276.95312"> ' +
            "<g " +
            '    transform="translate(3016.5912,-258.85646)" ' +
            '    id="layer1"> ' +
            "    <path " +
            '    style="fill:#049104;fill-opacity:1;stroke:none;stroke-width:1.03391409px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" ' +
            '    d="m -2972.1116,345.95468 2.0889,837.61772 c 0,0 64.7535,142.0398 177.5497,12.5328 l 8.3554,-850.15052 z" ' +
            '    id="tube-eight" /> ' +
            "    <path " +
            '    id="tube-seven" ' +
            '    d="m -2972.1119,345.95468 0.6361,255.04771 h 184.8525 l 2.506,-255.04771 z m 57.9173,77.27702 a 38.64055,38.64055 0 0 1 38.6406,38.64058 38.64055,38.64055 0 0 1 -38.6406,38.64047 38.64055,38.64055 0 0 1 -38.6424,-38.64047 38.64055,38.64055 0 0 1 38.6424,-38.64058 z m 87.4102,2.9543 a 28.182396,28.182396 0 0 1 28.1822,28.18234 28.182396,28.182396 0 0 1 -28.1822,28.18223 28.182396,28.182396 0 0 1 -28.1842,-28.18223 28.182396,28.182396 0 0 1 28.1842,-28.18234 z m -46.7341,91.5742 a 31.668446,31.668446 0 0 1 31.6697,31.66961 31.668446,31.668446 0 0 1 -31.6697,31.66766 31.668446,31.668446 0 0 1 -31.6676,-31.66766 31.668446,31.668446 0 0 1 31.6676,-31.66961 z" ' +
            '    style="fill:#ebf4fa;fill-opacity:1;stroke:none;stroke-width:1.03391409px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" /> ' +
            "    <path " +
            '    id="tube-six" ' +
            '    d="m -2972.112,345.95468 1.143,458.08457 h 23.0429 a 35.154496,35.154496 0 0 1 31.9867,-20.65203 35.154496,35.154496 0 0 1 31.9767,20.65203 h 95.3422 l 4.5033,-458.08457 z m 65.3103,50.39525 a 46.035582,46.035582 0 0 1 46.0354,46.03545 46.035582,46.035582 0 0 1 -46.0354,46.03533 46.035582,46.035582 0 0 1 -46.0354,-46.03533 46.035582,46.035582 0 0 1 46.0354,-46.03545 z m 75.8817,46.37871 a 28.182396,28.182396 0 0 1 28.1822,28.18222 28.182396,28.182396 0 0 1 -28.1822,28.18223 28.182396,28.182396 0 0 1 -28.1843,-28.18223 28.182396,28.182396 0 0 1 28.1843,-28.18222 z m -36.4355,75.03353 a 37.830975,37.830975 0 0 1 37.8308,37.8307 37.830975,37.830975 0 0 1 -37.8308,37.83071 37.830975,37.830975 0 0 1 -37.8307,-37.83071 37.830975,37.830975 0 0 1 37.8307,-37.8307 z m 36.0194,88.61967 a 28.182396,28.182396 0 0 1 28.1822,28.18233 28.182396,28.182396 0 0 1 -28.1822,28.18222 28.182396,28.182396 0 0 1 -28.1822,-28.18222 28.182396,28.182396 0 0 1 28.1822,-28.18233 z m -82.8604,17.72398 a 42.126603,42.126603 0 0 1 42.1279,42.12797 42.126603,42.126603 0 0 1 -42.1279,42.126 42.126603,42.126603 0 0 1 -42.1261,-42.126 42.126603,42.126603 0 0 1 42.1261,-42.12797 z m 61.2653,91.57615 a 33.411475,33.411475 0 0 1 33.4125,33.41239 33.411475,33.411475 0 0 1 -33.4125,33.41032 33.411475,33.411475 0 0 1 -33.4103,-33.41032 33.411475,33.411475 0 0 1 33.4103,-33.41239 z" ' +
            '    style="fill:#ebf4fa;fill-opacity:1;stroke:none;stroke-width:1.03391409px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" /> ' +
            "    <path " +
            '    id="tube-five" ' +
            '    d="m -2972.1109,345.95468 1.1449,458.93072 h 22.6351 a 35.154496,35.154496 0 0 1 32.3925,-21.49818 35.154496,35.154496 0 0 1 32.3543,21.49818 h 94.9565 l 4.5093,-458.93072 z m 50.5203,77.27702 a 31.245519,31.245519 0 0 1 31.2457,31.24562 31.245519,31.245519 0 0 1 -31.2457,31.2456 31.245519,31.245519 0 0 1 -31.2455,-31.2456 31.245519,31.245519 0 0 1 31.2455,-31.24562 z m 94.8052,2.9543 a 28.182396,28.182396 0 0 1 28.1822,28.18224 28.182396,28.182396 0 0 1 -28.1822,28.18233 28.182396,28.182396 0 0 1 -28.1823,-28.18233 28.182396,28.182396 0 0 1 28.1823,-28.18224 z m -46.7321,91.57617 a 31.668446,31.668446 0 0 1 31.6677,31.66764 31.668446,31.668446 0 0 1 -31.6677,31.66766 31.668446,31.668446 0 0 1 -31.6697,-31.66766 31.668446,31.668446 0 0 1 31.6697,-31.66764 z m 42.1825,88.61977 a 28.182396,28.182396 0 0 1 28.1821,28.18223 28.182396,28.182396 0 0 1 -28.1821,28.18222 28.182396,28.182396 0 0 1 -28.1823,-28.18222 28.182396,28.182396 0 0 1 28.1823,-28.18223 z m -92.7212,17.72398 a 32.266558,32.266558 0 0 1 32.2675,32.26743 32.266558,32.266558 0 0 1 -32.2675,32.26536 32.266558,32.266558 0 0 1 -32.2653,-32.26536 32.266558,32.266558 0 0 1 32.2653,-32.26743 z m 71.126,91.57605 a 33.411475,33.411475 0 0 1 33.4104,33.41042 33.411475,33.411475 0 0 1 -33.4104,33.41239 33.411475,33.411475 0 0 1 -33.4123,-33.41239 33.411475,33.411475 0 0 1 33.4123,-33.41042 z" ' +
            '    style="fill:#ebf4fa;fill-opacity:1;stroke:none;stroke-width:1.03391409px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" /> ' +
            "    <path " +
            '    id="tube-four" ' +
            '    d="m -2972.1119,345.95468 1.7851,715.70272 h 179.174 l 7.0355,-715.70272 z m 57.9153,77.27898 a 26.43937,26.43937 0 0 1 26.4396,26.43957 26.43937,26.43937 0 0 1 -26.4396,26.43946 26.43937,26.43937 0 0 1 -26.4396,-26.43946 26.43937,26.43937 0 0 1 26.4396,-26.43957 z m 87.4103,2.95431 a 28.182396,28.182396 0 0 1 28.1821,28.18223 28.182396,28.182396 0 0 1 -28.1821,28.18233 28.182396,28.182396 0 0 1 -28.1823,-28.18233 28.182396,28.182396 0 0 1 28.1823,-28.18223 z m -46.7322,91.57409 a 31.668446,31.668446 0 0 1 31.6697,31.66972 31.668446,31.668446 0 0 1 -31.6697,31.66766 31.668446,31.668446 0 0 1 -31.6677,-31.66766 31.668446,31.668446 0 0 1 31.6677,-31.66972 z m 42.1825,88.62184 a 17.72424,17.72424 0 0 1 17.724,17.72399 17.72424,17.72424 0 0 1 -17.724,17.72386 17.72424,17.72424 0 0 1 -17.724,-17.72386 17.72424,17.72424 0 0 1 17.724,-17.72399 z m -82.8606,17.72399 a 26.43937,26.43937 0 0 1 26.4396,26.43946 26.43937,26.43937 0 0 1 -26.4396,26.43955 26.43937,26.43937 0 0 1 -26.4396,-26.43955 26.43937,26.43937 0 0 1 26.4396,-26.43946 z m 61.2655,91.57605 a 33.411475,33.411475 0 0 1 33.4124,33.41042 33.411475,33.411475 0 0 1 -33.4124,33.41238 33.411475,33.411475 0 0 1 -33.4123,-33.41238 33.411475,33.411475 0 0 1 33.4123,-33.41042 z m -63.0082,88.61978 a 24.696343,24.696343 0 0 1 24.6969,24.69679 24.696343,24.696343 0 0 1 -24.6969,24.69691 24.696343,24.696343 0 0 1 -24.6969,-24.69691 24.696343,24.696343 0 0 1 24.6969,-24.69679 z m 45.4317,96.71337 a 42.126603,42.126603 0 0 1 42.1259,42.12797 42.126603,42.126603 0 0 1 -42.1259,42.126 42.126603,42.126603 0 0 1 -42.128,-42.126 42.126603,42.126603 0 0 1 42.128,-42.12797 z m -61.1181,74.91638 a 26.43937,26.43937 0 0 1 26.4395,26.43953 26.43937,26.43937 0 0 1 -26.4395,26.4375 26.43937,26.43937 0 0 1 -26.4395,-26.4375 26.43937,26.43937 0 0 1 26.4395,-26.43953 z" ' +
            '    style="fill:#ebf4fa;fill-opacity:1;stroke:none;stroke-width:1.03391409px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" /> ' +
            "    <path " +
            '    id="tube-three" ' +
            '    d="m -2972.1119,345.95468 1.7588,705.59382 h 179.3013 l 6.9345,-705.59382 z m 57.9153,77.27702 a 26.43937,26.43937 0 0 1 26.4395,26.43957 26.43937,26.43937 0 0 1 -26.4395,26.43946 26.43937,26.43937 0 0 1 -26.4396,-26.43946 26.43937,26.43937 0 0 1 26.4396,-26.43957 z m 76.9519,2.9543 a 17.72424,17.72424 0 0 1 17.724,17.72398 17.72424,17.72424 0 0 1 -17.724,17.72399 17.72424,17.72424 0 0 1 -17.724,-17.72399 17.72424,17.72424 0 0 1 17.724,-17.72398 z m -50.2175,91.57617 a 17.72424,17.72424 0 0 1 17.7239,17.72397 17.72424,17.72424 0 0 1 -17.7239,17.72388 17.72424,17.72424 0 0 1 -17.724,-17.72388 17.72424,17.72424 0 0 1 17.724,-17.72397 z m 56.1262,88.62173 a 17.72424,17.72424 0 0 1 17.7239,17.72399 17.72424,17.72424 0 0 1 -17.7239,17.72397 17.72424,17.72424 0 0 1 -17.724,-17.72397 17.72424,17.72424 0 0 1 17.724,-17.72399 z m -82.8606,17.72399 a 26.43937,26.43937 0 0 1 26.4395,26.43956 26.43937,26.43937 0 0 1 -26.4395,26.43749 26.43937,26.43937 0 0 1 -26.4396,-26.43749 26.43937,26.43937 0 0 1 26.4396,-26.43956 z m 76.9519,91.57408 a 17.72424,17.72424 0 0 1 17.724,17.72398 17.72424,17.72424 0 0 1 -17.724,17.72398 17.72424,17.72424 0 0 1 -17.724,-17.72398 17.72424,17.72424 0 0 1 17.724,-17.72398 z m -78.6947,88.62185 a 24.696343,24.696343 0 0 1 24.697,24.6968 24.696343,24.696343 0 0 1 -24.697,24.69473 24.696343,24.696343 0 0 1 -24.6968,-24.69473 24.696343,24.696343 0 0 1 24.6968,-24.6968 z m 69.8337,121.11529 a 17.72424,17.72424 0 0 1 17.724,17.72398 17.72424,17.72424 0 0 1 -17.724,17.72397 17.72424,17.72424 0 0 1 -17.724,-17.72397 17.72424,17.72424 0 0 1 17.724,-17.72398 z m -85.52,50.51239 a 26.43937,26.43937 0 0 1 26.4395,26.4395 26.43937,26.43937 0 0 1 -26.4395,26.4395 26.43937,26.43937 0 0 1 -26.4395,-26.4395 26.43937,26.43937 0 0 1 26.4395,-26.4395 z m 45.056,274.591 c 1.1033,0.044 2.2163,0.065 3.3401,0.057 -1.121,0 -2.2339,-0.025 -3.3401,-0.057 z" ' +
            '    style="fill:#ebf4fa;fill-opacity:1;stroke:none;stroke-width:1.03391409px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" /> ' +
            "    <path " +
            '    id="tube-two" ' +
            '    d="m -2972.1119,345.95468 2.09,837.61792 c 0,0 64.7521,142.0391 177.5484,12.5321 l 8.3562,-850.15002 z m 49.2017,77.27898 a 17.72424,17.72424 0 0 1 17.724,17.72399 17.72424,17.72424 0 0 1 -17.724,17.72397 17.72424,17.72424 0 0 1 -17.7239,-17.72397 17.72424,17.72424 0 0 1 17.7239,-17.72399 z m 85.6676,2.95234 a 17.72424,17.72424 0 0 1 17.7238,17.72595 17.72424,17.72424 0 0 1 -17.7238,17.72398 17.72424,17.72424 0 0 1 -17.7241,-17.72398 17.72424,17.72424 0 0 1 17.7241,-17.72595 z m -50.2196,91.57617 a 17.72424,17.72424 0 0 1 17.7239,17.72386 17.72424,17.72424 0 0 1 -17.7239,17.72399 17.72424,17.72424 0 0 1 -17.724,-17.72399 17.72424,17.72424 0 0 1 17.724,-17.72386 z m 56.1262,88.62173 a 17.72424,17.72424 0 0 1 17.7239,17.72399 17.72424,17.72424 0 0 1 -17.7239,17.72397 17.72424,17.72424 0 0 1 -17.724,-17.72397 17.72424,17.72424 0 0 1 17.724,-17.72399 z m -91.5742,17.72399 a 17.72424,17.72424 0 0 1 17.724,17.72397 17.72424,17.72424 0 0 1 -17.724,17.72388 17.72424,17.72424 0 0 1 -17.7239,-17.72388 17.72424,17.72424 0 0 1 17.7239,-17.72397 z m 85.6676,91.57408 a 17.72424,17.72424 0 0 1 17.7238,17.72595 17.72424,17.72424 0 0 1 -17.7238,17.72397 17.72424,17.72424 0 0 1 -17.7241,-17.72397 17.72424,17.72424 0 0 1 17.7241,-17.72595 z m -85.6676,88.62175 a 17.72424,17.72424 0 0 1 17.724,17.72397 17.72424,17.72424 0 0 1 -17.724,17.72398 17.72424,17.72424 0 0 1 -17.7239,-17.72398 17.72424,17.72424 0 0 1 17.7239,-17.72397 z m 76.8045,121.11539 a 17.72424,17.72424 0 0 1 17.724,17.72398 17.72424,17.72424 0 0 1 -17.724,17.72594 17.72424,17.72424 0 0 1 -17.724,-17.72594 17.72424,17.72424 0 0 1 17.724,-17.72398 z m -76.8045,67.94352 a 17.72424,17.72424 0 0 1 17.724,17.72387 17.72424,17.72424 0 0 1 -17.724,17.724 17.72424,17.72424 0 0 1 -17.7239,-17.724 17.72424,17.72424 0 0 1 17.7239,-17.72387 z m 79.7588,79.75867 a 17.72424,17.72424 0 0 1 17.724,17.7241 17.72424,17.72424 0 0 1 -17.724,17.7239 17.72424,17.72424 0 0 1 -17.724,-17.7239 17.72424,17.72424 0 0 1 17.724,-17.7241 z m -85.6674,62.0349 a 17.72424,17.72424 0 0 1 17.724,17.7239 17.72424,17.72424 0 0 1 -17.724,17.7241 17.72424,17.72424 0 0 1 -17.724,-17.7241 17.72424,17.72424 0 0 1 17.724,-17.7239 z" ' +
            '    style="fill:#ebf4fa;fill-opacity:1;stroke:none;stroke-width:1.03391409px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" /> ' +
            "    <path " +
            '    id="tube-one" ' +
            '    d="m -2972.1116,345.95468 2.0889,837.61762 c 0,0 64.7534,142.0399 177.5497,12.5329 l 8.3553,-850.15052 z" ' +
            '    style="fill:#ebf4fa;fill-opacity:1;stroke:none;stroke-width:1.03391409px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" /> ' +
            "    <path " +
            '    style="fill:#000000;stroke-width:4.45749807" ' +
            '    d="m -2913.0162,1252.3294 c -13.9059,-4.2723 -28.4011,-13.4863 -40.9366,-26.022 -34.91,-34.9099 -33.3706,-13.0753 -33.3706,-473.32083 0,-401.62756 -0.115,-406.95667 -8.8688,-411.64175 -24.1842,-12.94296 -27.5942,-51.74595 -6.305,-71.74609 l 11.4345,-10.74227 h 112.9481 112.948 l 11.4346,10.74227 c 21.2891,20.00014 17.8791,58.80313 -6.3051,71.74609 -8.754,4.68508 -8.8688,10.01419 -8.8688,411.64175 0,460.15493 1.5299,438.42043 -33.314,473.26433 -13.3605,13.3606 -26.6287,21.5123 -42.8601,26.3325 -28.3773,8.4272 -39.8196,8.3844 -67.9362,-0.254 z m 84.3318,-39.5695 c 30.1788,-23.0184 28.576,2.333 28.576,-451.99415 0,-402.49058 -0.1685,-410.53061 -8.5966,-410.53061 -13.5026,0 -23.4772,-12.33025 -18.1011,-22.37567 3.4384,-6.42474 10.168,-8.69635 30.0792,-9.71982 23.3068,-1.2164 25.7297,-2.30852 27.13,-12.22965 2.9087,-20.60716 -6.4581,-22.53726 -109.3697,-22.53726 -89.3995,0 -95.5144,0.53019 -104.0015,9.01717 -7.1619,7.16193 -8.0467,10.83026 -4.3006,17.82996 4.3047,8.04333 9.4899,8.81288 59.3869,8.81288 36.5782,0 56.4406,1.77016 60.0193,5.34895 7.0495,7.04933 6.7514,10.14181 -1.6556,18.84888 -5.3217,5.32176 -16.566,7.00456 -46.8037,7.00456 h -39.7991 v 71.07581 71.0757 l 21.1731,1.35856 c 19.2507,1.23532 21.1731,2.37047 21.1731,12.50241 0,10.13194 -1.9224,11.26708 -21.1731,12.5023 l -21.1731,1.35866 v 17.40553 17.40543 l 36.7744,1.29466 c 35.9091,1.26417 36.7744,1.55687 36.7744,12.43841 0,10.88152 -0.8653,11.17413 -36.7744,12.4384 l -36.7744,1.29456 v 17.64974 c 0,17.41143 0.2256,17.65068 16.7156,17.71798 20.6732,0.0848 29.22,5.14352 27.1436,16.06713 -1.2455,6.55285 -6.2027,8.67724 -22.726,9.73948 l -21.1331,1.35866 v 17.58574 c 0,17.45248 0.131,17.58575 17.2843,17.58575 35.0609,0 36.1641,27.75305 1.2061,30.34444 -17.8359,1.32207 -18.4904,1.91379 -18.4904,16.71561 v 15.34494 h 32.8855 c 36.1388,0 49.0871,6.98595 39.9363,21.54677 -3.5577,5.66089 -12.7707,7.73647 -38.7446,8.72882 l -34.0773,1.3019 v 15.4137 c 0,14.92993 0.5426,15.4138 17.2843,15.4138 35.061,0 36.1642,27.75294 1.2061,30.34434 -18.2763,1.35484 -18.4904,1.57124 -18.4904,18.70021 v 17.32943 l 21.1331,1.35857 c 16.5233,1.06234 21.4805,3.18672 22.726,9.73946 2.0765,10.92362 -6.4703,15.98276 -27.1435,16.06713 -16.4899,0.0672 -16.7156,0.30676 -16.7156,17.71799 v 17.64973 l 36.7744,1.29468 c 35.9091,1.26416 36.7744,1.55686 36.7744,12.43839 0,10.88154 -0.8653,11.17414 -36.7744,12.4383 l -36.7744,1.29467 v 17.40553 17.40553 l 21.1731,1.35856 c 19.2507,1.23521 21.1731,2.37045 21.1731,12.50225 0,10.1321 -1.9224,11.2673 -21.1731,12.5025 l -21.1731,1.3586 v 73.7452 c 0,59.1286 1.4497,76.8 7.3136,89.1573 20.2882,42.7544 80.9702,55.9147 120.1229,26.0515 z" ' +
            '    id="tube-glass" /> ' +
            "</g> " +
            "</svg ";

        let healthCounter = this.createElementWithId("div", "health");
        healthCounter.innerHTML = healthCounterInner;

        this.virusBox.appendChild(healthCounter);

        let cleanCountInner =
            '<div id="clean-stats"><div id="clean-count">' +
            this.cleanCount +
            '</div><div class="text">Cleaned</div></div>';
        let cleanCount = this.createElementWithId("div", "");
        cleanCount.innerHTML = cleanCountInner;
        this.virusBox.appendChild(cleanCount);

        let settingsBtn = this.createElementWithId("img", "pause-button");
        settingsBtn.src = "./assets/img/icons/settings.svg";
        this.virusBox.appendChild(settingsBtn);

        let lives = this.createElementWithId("div", "player-lives");
        let lifeOne = this.createElementWithId("img", "life-one");
        lifeOne.src = "./assets/img/icons/heart.svg";
        let lifeTwo = this.createElementWithId("img", "life-two");
        lifeTwo.src = "./assets/img/icons/heart.svg";
        let lifeThree = this.createElementWithId("img", "life-three");
        lifeThree.src = "./assets/img/icons/heart.svg";
        lives.appendChild(lifeOne);
        lives.appendChild(lifeTwo);
        lives.appendChild(lifeThree);
        this.virusBox.appendChild(lives);
        this.updatePlayerLivesGUI();
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
            "./assets/json/levels/level-" + this.levelNum + ".json"
        );
        if (response.status != 404) {
            const levelData = response.json();
            return levelData;
        } else {
            return false;
        }
    }

    toggleAudio(e) {
        // Not wokring [DEV]
        console.log("toggling audio");
        if (e.target.checked) {
            window.gameSettings.audio.enabled = true;
        } else {
            window.gameSettings.audio.enabled = false;
        }
    }
}
