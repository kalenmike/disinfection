/**
 *   @Author      : Kalen Michael
 *   @Website     : https://www.kalenmichael.com
 *   @Version     : 1.0.0
 *   @Created     : 30 December 2020
 *   @Modified    : 30 December 2020
 */

 class Virus{

    virusElem; // Holds the img tag
    living;

     /**
     * @param {object} virusData An object containing all the virus data
     * @param {function} callback The callback to fire when the virus dies
     */
    constructor(virusData, callback){
        this.template = virusData;
        this.callback = callback;

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
        this.virusElem.parentNode.removeChild(this.virusElem);
        this.callback();
    }

    move(){
        let target = this.getNextPosition(50);
        this.animate(target[0], target[1]);
    }

    freeze(){
        this.living = false;
        this.virusElem.classList.add('stop-animation');
        this.virusElem.removeEventListener('click', this.die.bind(this));
    }

    attack(){

    }

    // Helper functions
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
        let id = setInterval(frame.bind(this), 10) // draw every 300ms
    }

    generateStartPosition(){
        // Randomly Generate Initial Position
        var side = Math.floor(Math.random() * (4 - 1 + 1) + 1);
        var position = Math.floor(Math.random() * (100 - 0 + 1) + 0);
        return [side, position];
    }

    getNextPosition(size) {

        // Set by css animation
        var pulseModifier = 1.2; //Animation scale
        var controlHeight = 80; // Control box
    
        // Fetch viewport
        var windowWidth = window.innerWidth - (size * pulseModifier);
        var windowHeight = window.innerHeight - (size * pulseModifier) - controlHeight;
    
        // Randomise the next position
        var left = Math.floor(Math.random() * windowWidth);
        var top = Math.floor(Math.random() * windowHeight);
    
        return [top, left];
    }

    addToDOM(launchPosition){

        this.virusSize = 50;

        var virus = document.createElement('img');
        //Set Attributes
        // virus.setAttribute("id", this.identifier);
        virus.setAttribute("src", this.template.imagePath);
        virus.setAttribute("draggable", 'false');
        //Set Classes
        virus.classList.add("virus");
        virus.classList.add(this.template.class);
        // Set Size
        virus.style.width = this.virusSize + "px";
        virus.style.height = this.virusSize + "px";
        virus.style.display = "inline";
    
        if (launchPosition[0] == 1){
            //From Top
            virus.style.top = (this.virusSize * -1) + "px";
            virus.style.left = launchPosition[1] + "%";
        }else if(launchPosition[0] == 2){
            //Right
            virus.style.left = "calc(100vw + " + this.virusSize + "px)";
            virus.style.top = launchPosition[1] + "%";
        }else if(launchPosition[0] == 3){
            //Bottom
            virus.style.top = "calc(100vh + " + this.virusSize + "px)";
            virus.style.left = launchPosition[1] + "%";
        }else if(launchPosition[0] == 4){
            //From Left
            virus.style.left = (this.virusSize * -1) + "px";
            virus.style.top = launchPosition[1] + "%";
        }

        document.getElementById('disinfection').appendChild(virus); // [DEV] Quick fix
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