/**
*   @Author      : Kalen Michael
*   @Website     : https://www.kalenmichael.com
*   @Version     : 1.0.0
*   @Created     : 30 December 2020
*   @Modified    : 30 December 2020
 */

//Game Shell - Start, Game Over, Game Won, Rules

import GameShell from './classes/game-shell.class.js';

window.gameSettings = {
    'audio':{
        'enabled':true,
        'background':true,
        'sounds':true,
        'volume':0.5
    }
}

if (window.gameSettings.audio.enabled && window.gameSettings.audio.background){
    window.menuMusic = new Audio('./assets/sounds/POL-doggo-brothers-short.wav');
    window.menuMusic.volume = window.gameSettings.audio.volume;
    window.menuMusic.loop = true;
};

window.addEventListener('DOMContentLoaded', () =>{
    setTimeout(()=>{
        window.menuMusic.play();
    }, 1000);
})

let game = new GameShell('disinfection');
