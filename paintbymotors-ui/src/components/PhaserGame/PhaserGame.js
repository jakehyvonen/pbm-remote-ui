import React, { Component } from 'react'
import Phaser from 'phaser'
import VirtualJoystickPlugin from 'phaser3-rex-plugins/plugins/virtualjoystick-plugin.js';
import MobileScene from './MobileScene';

class PhaserGame extends Component {

    constructor() {
    super();

    this.config = {
        type: Phaser.AUTO,   
        transparent:true,

        scale: {
            parent: "game",
            width: 800,
            height: 600,
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
        },
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 200 },
            },
        },
        scene: [MobileScene],
        plugins: {
            global: [{
                key: 'rexVirtualJoystick',
                plugin: VirtualJoystickPlugin,
                start: true
            }]
        }
    };
    //this.game = new Phaser.Game(this.config);    
    }

    componentDidMount() {
    this.game = new Phaser.Game(this.config);
    }
    
    render() {
    return (<div id="game"></div>)
    }
}

export default PhaserGame;