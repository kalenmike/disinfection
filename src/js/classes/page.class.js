export default class Page{

    constructor(name, level = null){
        this.container = document.createElement('div');
        this.container.classList.add('page-overlay');

        let innerContent = document.createElement('div');
        innerContent.classList.add('inner-content');

        // Close Button
        let close = document.createElement('div');
        close.classList.add('close-overlay');
        close.innerText = "✕";
        close.addEventListener('click', (e) =>{
            // e.target.parentNode.parentNode.removeChild(close.parentNode);
            this.container.parentNode.removeChild(this.container);
        });

        if (level){
            this.level = level;
            close.addEventListener('click', (e) =>{
                this.level.pauseGame();// Toggle Pause
            });
        }

        innerContent.appendChild(close);

        let pageData;
        if (name == "rules"){
            pageData = this.buildRules();
        }else if (name == "about"){
            pageData = this.buildAbout();
        }else if (name == "credits"){
            pageData = this.buildCredits();
        }else if (name == "settings"){
            pageData = this.buildSettings();
        }

        innerContent.appendChild(pageData);
        this.container.appendChild(innerContent);
        return this.container;
    }

    buildRules(){
        let frame = document.createElement('div');
        frame.innerHTML = 
        '<p>...I am still working on adding the rules...</p>' +
        '<h1>Game Rules</h1>' +
        '<ul>' +
        '<li>Clean all the viruses before your time runs out</li>' + 
        '<li>Ensure the room does not become too dirty</li>' +
        '</ul>';

        return frame;
    }

    buildAbout(){
        let frame = document.createElement('div');
        frame.innerHTML =
        '<h1>About</h1>' +
        '<div class="scroll-content"><p>2020 the year so special they had to name it twice!</p>' + 
        '<p>As we all sat locked in our houses, quaranteened and fearing for our futures we found ourselves with alot of extra time and very little to do.</p>' + 
        '<p>I had recently moved to a new town and was living alone far away from friends and family. This game became my project. It changed many times over starting as a horror game and eventually becoming something more child friendly after I realised my nephews might enjoy playing it on their tablet.</p>' + 
        'Unfortunately my original code was almost entirely lost as I only published my compliled code to my server. The realise of Ubunut 20.04 had me excited and I reformatted before realising I had not saved my local web projects. So what you see today is a reimagined version of what once was, and a tribute to all the time we spent indoors during the quarantine of 2020.' + 
        '<p>I hope you enjoy playing my game!</p></div>';

        return frame;
    }

    buildCredits(){
        let frame = document.createElement('div');
        frame.innerText = "Credits Page";

        frame.innerHTML = 
        '<p>...I am still working on adding the credits...</p>' +
        '<h1>Attributions</h1>' +
        '<h2>Illustrations</h2>' +
        '<a href="https://www.freepik.es/vectorpouch">Background Images Created by vectorpouch</a>' +
        'Sound Recorded by Mike Koenig Attibution 3'+
        'Music: “Foggy Forest”, from PlayOnLoop.com Attribution 4.0';

        return frame;
    }

    buildSettings(){
        let frame = document.createElement('div');
        frame.innerText = "Settings Page";

        frame.innerHTML = 
        '<div class="settings-page"><p>...I am still working on adding the settings...</p>' +
        '<h1>Settings</h1>' +
        '<h2>Audio</h2>' +
        '<label><input type="checkbox" checked onclick="toggleAudio()"/> Enable Audio</label>' +
        '<label><input type="checkbox" checked/> Play Background Music</label>' +
        '<label><input type="checkbox" checked/> Play Action Sounds</label>' +
        '<label><input type="range" value="50"/> Volume</label></div>'

        return frame;
    }
}