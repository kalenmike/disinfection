import Virus from './virus.class.js';

export default class Level {
    timeLimit; // Holds the timeout
    

    /**
     * @param {object} levelData An object containing all the level data
     * @param {function} callback The callback to fire when the level finishes
     */
    constructor(levelData, cleanCount, callback) {

        // Stop Menu Music
        window.menuMusic.pause();

        this.template = levelData;
        this.callback = callback;

        // Initialise default vars
        this.virusTypes = []; // An array holding all the levels virus types templates
        this.viruses = []; // An array holding all the viruses objects from the class Virus
        this.spawned = 0; // Count of viruses spawned
        this.notifyByType = [] // Array of indexes to alert for
        this.living = 0; // Count of viruses still alive
        this.active = true; // Whether the level is active or finished
        this.currentTime = this.template.timeLimit;
        this.cleanCount = cleanCount;

        this.pause = false;
        document.getElementById('pause-button').addEventListener('click', this.pauseGame.bind(this));

        this.maxAlive = 10;

        if (window.gameSettings.audio.enabled && window.gameSettings.audio.background){
            this.backgroundAudio = new Audio('./assets/sounds/POL-foggy-forest-short.wav');
            this.backgroundAudio.volume = window.gameSettings.audio.volume;
            this.backgroundAudio.loop = true;
            this.backgroundAudio.play();
        };

        this.decrementPercent = (1000 / this.template.timeLimit) / 10; // For updating the progress bar, 1 second / timeLimit

        this.loadAllVirusData().then(() => this.start());
    }

    /**
     * Start the level
     */
    start() {
        this.spawnViruses();

        this.startLevelTimer();

        // this.timeLimit = setTimeout(() => {
        //     this.submitOutcome(false);
        // }, this.template.timeLimit);
    }

    pauseGame(){
        if (this.pause){
            this.pause = false;
            // this.backgroundAudio.play();
            this.spawnViruses();
            this.viruses.forEach((virus) => {
                virus.unfreeze();
            });
        }else{
            this.pause = true;
            // this.backgroundAudio.pause();
            this.viruses.forEach((virus) => {
                virus.freeze();
            });
        }
    }

    startLevelTimer(){
        const progressBar = document.getElementById('progress-bar');
        this.timeLimit = setInterval(() =>{
            if (this.pause) return; // Skip timer if game is paused
            if (this.currentTime <= 0){
                progressBar.style.width = "0";
                this.submitOutcome(false);
                return;
            }
            this.currentTime -= 1000;
            progressBar.style.width = (this.currentTime * this.decrementPercent) + "%";
        },1000);// Run every second
    }

    /**
     * Spawn virus at interval until the level limit has been reached
     */
    spawnViruses(){
        if (this.pause) return
        if (this.spawned < this.template.virusCount && this.active){
            let random = Math.floor(
                Math.random() * this.virusTypes.length
            ); // Random number between 0 & length

            let index;
            
            if (this.notifyByType.indexOf(random) > -1){
                this.updateAlert(this.virusTypes[random]);
                this.notifyByType.splice(this.notifyByType.indexOf(random), 1);
            }

            let virus = new Virus(
                this.virusTypes[random],
                this.virusDeath.bind(this)
            );
            // document.getElementById('virus-box').appendChild(virus);
            this.spawned++;
            this.living++;
            this.adjustVirusPPM(this.living / this.maxAlive * 100);
            this.viruses.push(virus);
            setTimeout(this.spawnViruses.bind(this), this.randomNumberBetween(this.template.spawnTime.min, this.template.spawnTime.max));
        }
    }

    updateAlert(virusTemplate){
        // Notify of virus
        let alert = document.getElementById('alert');
        let preview = document.getElementById('preview');
        let writeUp = document.getElementById('write-up');

        let innerHTML = 
        '<table>' +
        '   <tr class="text-center"><td colspan="3"><h3 class="name">'+ virusTemplate.name +' Identified!</h3></td></tr>' +
        '   <tr><td>Size</td><td> : </td><td class="size">'+ virusTemplate.size.min + 'nm - ' + virusTemplate.size.max +'nm</td></tr>' +
        '   <tr><td>Speed</td><td> : </td><td class="speed">'+virusTemplate.speed.min + 'ns - ' + virusTemplate.speed.max +'ns</td></tr>' +
        '   <tr><td colspan="3" style="text-align:center;max-width:300px; padding-top:0.4em;">'+ virusTemplate.details +'</td></tr>' +
        '</table'

        preview.src = virusTemplate.imagePath;
        writeUp.innerHTML = innerHTML;

        alert.classList.remove('hide');
        alert.classList.add('show');

    }

    virusDeath() {
        // Prevent score from increasing if cheating
        if(this.pause){
            this.spawned--; // Decrease the spawned count to make up for the cheat
            console.log('[Cheat] Player bypassed the pause menu');
            return;
        }  
        this.living--;
        this.adjustVirusPPM(this.living / this.maxAlive * 100);
        this.updateCleanCount();
        if (this.spawned == this.template.virusCount && this.living == 0) {
            this.submitOutcome(true);
        }
    }

    updateCleanCount(){
        this.cleanCount++;
        document.getElementById('clean-count').innerText = this.cleanCount;
    }

    /**
     * Quit the level and return to main menu
     */
    quit(){
        this.submitOutcome('quit');
    }

    /**
     * Submit the results to the game shell
     */
    submitOutcome(status) {
        if (this.active) {
            this.active = false;
            this.backgroundAudio.pause();
            clearInterval(this.timeLimit);
            // Kill all living viruses
            this.viruses.forEach((virus) => {
                virus.freeze();
            });
            let response = {
                win: status,
                cleanCount: this.cleanCount
            };
            this.callback(response);
        }
    }

    /**
     * Loop level data and load all viruses
     */
    async loadAllVirusData() {
        const virusTypes = this.template.viruses;

        for (let i = 0; i < virusTypes.length; i++) {
            const virus = await this.loadVirusData(virusTypes[i]); // Fetch the next virus type
            this.virusTypes.push(virus);
            if (virusTypes[i].alert == true){
                this.notifyByType.push(i); // Push array index to notify on first appearence
            }
        }
    }

    /**
     * Load json and return object
     * @param {string} id The id of the file to fetch
     */
    async loadVirusData(virus) {
        const response = await fetch(
            "./assets/json/viruses/virus-" + virus.id + ".json"
        );
        const virusData = response.json();
        return virusData;
    }

    /**
     * Update the gui to reflect the users health
     * @param {integer} percentage 
     */
    adjustVirusPPM(percentage){
        if(percentage < 12.5){
            document.getElementById("tube-eight").style.opacity = "1";
            document.getElementById("tube-one").style.opacity = "1";
            document.getElementById('virus-box').classList.remove('dangerous');
        }else if (percentage < 25){
            document.getElementById("tube-one").style.opacity = "";
            document.getElementById("tube-two").style.opacity = "1";
            document.getElementById('virus-box').classList.remove('dangerous');
        }else if (percentage < 37.5){
            document.getElementById("tube-two").style.opacity = "";
            document.getElementById("tube-three").style.opacity = "1";
            document.getElementById('virus-box').classList.remove('dangerous');
        }else if (percentage < 50){
            document.getElementById("tube-three").style.opacity = "";
            document.getElementById("tube-four").style.opacity = "1";
            document.getElementById('virus-box').classList.remove('dangerous');
        }else if (percentage < 62.5){
            document.getElementById("tube-four").style.opacity = "";
            document.getElementById("tube-five").style.opacity = "1";
            document.getElementById('virus-box').classList.remove('dangerous');
        }else if (percentage < 75){
            document.getElementById("tube-five").style.opacity = "";
            document.getElementById("tube-six").style.opacity = "1";
            document.getElementById('virus-box').classList.remove('dangerous');
        }else if (percentage < 87.5){
            document.getElementById("tube-six").style.opacity = "";
            document.getElementById("tube-seven").style.opacity = "1";
            document.getElementById('virus-box').classList.add('dangerous');
        }else if (percentage > 87.5 && percentage < 100){
            document.getElementById("tube-seven").style.opacity = "";
            document.getElementById('virus-box').classList.add('dangerous');
        }else if (percentage >= 100){
            this.submitOutcome(false);
        }
    }

    // [DEV] This code is duplicated in level.class and virus.class
    randomNumberBetween(min, max){
        // Randomly Generate Number
        var size = Math.floor(Math.random() * (max - min + 1) + min);
        return size;
    }
}
