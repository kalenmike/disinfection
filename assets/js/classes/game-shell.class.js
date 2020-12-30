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

    levelCallback(response){
        if (response.win == true){
            alert("You Win");
            this.levelNum++;
            this.play();
        }else{
            alert("You Lose")
        }
    }

    play(){
        this.loadLevelData() // Load the json in an object
        .then((levelData) => (this.levelData = levelData))
        .then(() => this.showGameMenu()); 
    }

    showGameMenu() {

        this.menu = document.createElement("div");
        // Level Data
        let levelName = document.createElement("div");
        levelName.innerText = this.levelData.name;
        this.menu.appendChild(levelName);
        let levelInstructions = document.createElement("div");
        levelInstructions.innerText = this.levelData.text;
        this.menu.appendChild(levelInstructions);
        let levelDifficulty = document.createElement("div");
        levelDifficulty.innerText = 'Difficulty : ' + this.levelData.difficulty;
        this.menu.appendChild(levelDifficulty);

        // Start Button
        let startBtn = document.createElement("button");
        startBtn.innerText = "Play Disinfection";
        startBtn.addEventListener('click', ()=>{
            this.removeGameMenu();
            this.level = new Level(this.levelData, this.levelCallback.bind(this));
        })
        this.menu.appendChild(startBtn);

        this.gameMount.appendChild(this.menu);

    }

    removeGameMenu(){
        this.menu.parentNode.removeChild(this.menu);
    }

    async loadLevelData() {
        const response = await fetch(
            "/assets/js/levels/level-" + this.levelNum + ".json"
        );
        const levelData = response.json();
        return levelData;
    }
}
