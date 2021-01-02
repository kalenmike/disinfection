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
        '<div class="scroll-content"><h1>Game Rules</h1>' +
        '<p>Each level will spawn a set amount of viruses and you will be allocated a time limit to clean them. If you allow too many viruses to be alive at the same time the infection will become to dangerous and you will lose a life. The test tube will indicate the level of infection in the current room, the more green the more dangerous.</p>' + 
        '<h2>Summary</h2>'+
        '<p><ul>' +
        '<li>Clean all the viruses by clicked or tapping them before the time limit expires</li>' + 
        '<li>Ensure that your test tube does not become fully green by keeping the total number of viruses on your screen low</li>' +
        '</ul></p>'+
        '<p>As you progress through the levels the viruses will become stronger and produce faster.</p>'+
        '</div>';

        return frame;
    }

    buildAbout(){
        let frame = document.createElement('div');
        frame.innerHTML =
        '<div class="scroll-content"><h1>About</h1>' +
        '<p style="font-weight:bold">2020 the year so special they had to name it twice!</p>' + 
        '<p>As we all sat locked in our houses, quarantined and fearing for our futures we found ourselves with alot of extra time and very little to do.</p>' + 
        '<p>I had recently moved to a new town and was living alone far away from friends and family. This game became my project. It changed many times over starting as a horror game and eventually becoming something more child friendly after I realised my nephews might enjoy playing it on their tablet.</p>' + 
        '<p>Unfortunately my original code was almost entirely lost as I only published the compliled code. The release of <a href="http://www.releases.ubuntu.com/20.04/">Ubunutu 20.04</a> had me excited and I reformatted before realising I had not saved my local web projects. So what you see today is a reimagined version of what once was, and a tribute to all the time we spent indoors during the quarantine of 2020.</p>' + 
        '<p>I hope you enjoy playing my game!</p></div>';

        return frame;
    }

    buildCredits(){
        let frame = document.createElement('div');
        frame.innerText = "Credits Page";

        frame.innerHTML = 
        '<h1>Attributions</h1>' +
        '<h2>Illustrations</h2>' +
        '<p><a href="https://www.freepik.es/vectorpouch">Level Background Images - vectorpouch</a></p>' +
        '<h2>Audio</h2>' + 
        '<p>Virus Sounds: - Mike Koenig (Attibution 3.0)</p>'+
        '<p>Level Music: “Foggy Forest” - PlayOnLoop.com (Attribution 4.0)</p>' +
        '<h2>Design</h2>' + 
        '<p>Kalen Michael</p>'+
        '<p>Alan Dimmer</p>';

        return frame;
    }

    buildSettings(){
        let frame = document.createElement('div');
        frame.innerText = "Settings Page";

        frame.innerHTML = 
        '<div class="settings-page"><p>...I am still working on adding the settings they do nothing...</p>' +
        '<h1>Settings</h1>' +
        '<h2>Audio</h2>' +
        '<label><input type="checkbox" checked onclick="toggleAudio()"/> Enable Audio</label>' +
        '<label><input type="checkbox" checked/> Play Background Music</label>' +
        '<label><input type="checkbox" checked/> Play Action Sounds</label>' +
        '<label><input type="range" value="50"/> Volume</label></div>'

        return frame;
    }
}