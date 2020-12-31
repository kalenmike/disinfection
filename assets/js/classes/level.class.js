/**
 *   @Author      : Kalen Michael
 *   @Website     : https://www.kalenmichael.com
 *   @Version     : 1.0.0
 *   @Created     : 30 December 2020
 *   @Modified    : 30 December 2020
 */

class Level {
    timeLimit; // Holds the timeout

    /**
     * @param {object} levelData An object containing all the level data
     * @param {function} callback The callback to fire when the level finishes
     */
    constructor(levelData, callback) {
        this.template = levelData;
        this.callback = callback;

        // Initialise default vars
        this.virusTypes = []; // An array holding all the levels virus types templates
        this.viruses = []; // An array holding all the viruses objects from the class Virus
        this.spawned = 0; // Count of viruses spawned
        this.living = 0; // Count of viruses still alive
        this.active = true; // Whether the level is active or finished
        this.currentTime = this.template.timeLimit;

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

    startLevelTimer(){
        const progressBar = document.getElementById('progress-bar');
        this.timeLimit = setInterval(() =>{
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
        if (this.spawned < this.template.virusCount){
            let random = Math.floor(
                Math.random() * this.virusTypes.length
            ); // Random number between 0 & length
            let virus = new Virus(
                this.virusTypes[random],
                this.virusDeath.bind(this)
            );
            this.spawned++;
            this.living++;
            this.viruses.push(virus);
            setTimeout(this.spawnViruses.bind(this), this.randomNumberBetween(this.template.spawnTime.min, this.template.spawnTime.max));
        }
    }

    virusDeath() {
        this.living--;
        if (this.spawned == this.template.virusCount && this.living == 0) {
            clearTimeout(this.timeLimit);
            this.submitOutcome(true);
        }
    }

    /**
     * Submit the results to the game shell
     */
    submitOutcome(status) {
        if (this.active) {
            this.active = false;
            clearInterval(this.timeLimit);
            // Kill all living viruses
            this.viruses.forEach((virus) => {
                virus.freeze();
            });
            let response = {
                win: status,
                time: "20",
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
        }
    }

    /**
     * Load json and return object
     * @param {string} id The id of the file to fetch
     */
    async loadVirusData(id) {
        const response = await fetch(
            "/assets/js/viruses/virus-" + id + ".json"
        );
        const virusData = response.json();
        return virusData;
    }

    // [DEV] This code is duplicated in level.class and virus.class
    randomNumberBetween(min, max){
        // Randomly Generate Number
        var size = Math.floor(Math.random() * (max - min + 1) + min);
        return size;
    }
}
