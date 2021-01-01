 export default class Virus{

    virusElem; // Holds the img tag
    living;

     /**
     * @param {object} virusData An object containing all the virus data
     * @param {function} callback The callback to fire when the virus dies
     */
    constructor(virusData, callback){
        this.template = virusData;
        this.callback = callback;
        this.size = this.randomNumberBetween(this.template.size.min, this.template.size.max);

        this.squishAudio = new Audio('assets/sounds/squish.wav');
        this.squishAudio.volume = 0.1;

        this.live();
    }

    live(){
        this.living = true;
        let launchPosition = this.generateStartPosition();
        this.addToDOM(launchPosition);
        this.move();
    }

    die(){
        this.living = false;
        this.squishAudio.play();
        this.virusElem.parentNode.removeChild(this.virusElem);
        this.callback();
    }

    move(){
        let target = this.getNextPosition();
        this.animate(target[0], target[1]);
    }

    freeze(){
        this.living = false;
        this.virusElem.classList.add('stop-animation');
    }

    attack(){

    }

    // Helper functions

    randomNumberBetween(min, max){
        // Randomly Generate Number
        var size = Math.floor(Math.random() * (max - min + 1) + min);
        return size;
    }

    animate(newTop, newLeft) {
        const elem = this.virusElem;
        let top = elem.offsetTop;
        let left = elem.offsetLeft;

        let topChange = (top > newTop) ? -1 : 1;
        let leftChange = (left > newLeft) ? -1 : 1;
        function frame() {

            if (this.living == false){
                clearInterval(id); // End loop if virus has died
                return;
            }

            if (top != newTop){
                top += topChange;
                elem.style.top = top + 'px' // move top
            }

            if (left != newLeft){
                left += leftChange;
                elem.style.left = left + 'px' // move left
            }

            if (left == newLeft && top == newTop){
                clearInterval(id); // End loop if in new position
                this.move();
            }
        }
        let id = setInterval(frame.bind(this), this.randomNumberBetween(this.template.speed.min, this.template.speed.max));
    }

    generateStartPosition(){
        // Randomly Generate Initial Position
        var side = Math.floor(Math.random() * (4 - 1 + 1) + 1);
        var position = Math.floor(Math.random() * (100 - 0 + 1) + 0);
        return [side, position];
    }

    getNextPosition() {

        // Set by css animation
        var pulseModifier = 1.2; //Animation scale
        var controlHeight = 80; // Control box
    
        // Fetch viewport
        var windowWidth = window.innerWidth - (this.size * pulseModifier);
        var windowHeight = window.innerHeight - (this.size * pulseModifier) - controlHeight;
    
        // Randomise the next position
        var left = Math.floor(Math.random() * windowWidth);
        var top = Math.floor(Math.random() * windowHeight);
    
        return [top, left];
    }

    showEntryArrow(id){
        let elm = document.getElementById(id);
        let clone = elm.cloneNode(true);
        elm.parentNode.replaceChild(clone, elm);
        clone.classList.add('play');
    }

    addToDOM(launchPosition){

        var virus = document.createElement('img');
        //Set Attributes
        // virus.setAttribute("id", this.identifier);
        virus.setAttribute("src", this.template.imagePath);
        virus.setAttribute("draggable", 'false');
        //Set Classes
        virus.classList.add("virus");
        virus.classList.add(this.template.class);
        // Set Size
        virus.style.width = this.size + "px";
        virus.style.height = this.size + "px";
        virus.style.display = "inline";
    
        if (launchPosition[0] == 1){
            //From Top
            virus.style.top = (this.size * -1) + "px";
            virus.style.left = launchPosition[1] + "%";
            this.showEntryArrow('from-top');
        }else if(launchPosition[0] == 2){
            //Right
            virus.style.left = "calc(100vw + " + this.size + "px)";
            virus.style.top = launchPosition[1] + "%";
            this.showEntryArrow('from-right');
        }else if(launchPosition[0] == 3){
            //Bottom
            virus.style.top = "calc(100vh + " + this.size + "px)";
            virus.style.left = launchPosition[1] + "%";
            this.showEntryArrow('from-bottom');
        }else if(launchPosition[0] == 4){
            //From Left
            virus.style.left = (this.size * -1) + "px";
            virus.style.top = launchPosition[1] + "%";
            this.showEntryArrow('from-left');
        }

        document.getElementById('virus-box').appendChild(virus);
        virus.addEventListener('click', this.die.bind(this));

        // Hide Ghost image
        document.addEventListener("dragstart", function( event ) {
            var img = new Image();
            img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
            // img.src = "http://placehold.it/1/000000/ffffff";
            img.style.display = "none";
            img.style.visibility = "hidden";
            img.style.opacity = "0";
            event.dataTransfer.setDragImage(img, window.outerWidth, window.outerHeight);
        }, false);

        this.virusElem = virus;
    }

 }