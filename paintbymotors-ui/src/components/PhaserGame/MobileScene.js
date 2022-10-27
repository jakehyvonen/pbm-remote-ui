import Phaser from 'phaser'
import VirtualJoystickPlugin from 'phaser3-rex-plugins/plugins/virtualjoystick-plugin.js';
import openSocket from 'socket.io-client';

const socket = openSocket('http://192.168.1.195:8081');


export default class MobileScene extends Phaser.Scene {
  constructor() {
    super('mobile')
  } 

  init() {
    this.gameWidth = this.sys.game.config.width;
    this.gameHeight = this.sys.game.config.height;
    this.gameWidthMiddle = this.gameWidth  / 2;
    this.gameHeightMiddle = this.gameHeight / 2;      
    this.staticXJsPos = this.gameWidthMiddle;
    this.staticYJsPos = this.gameHeightMiddle;
    this.playerSpeed = 1;
    this.lastCursorDirection = "center";
    this.joystickConfig = {
      x: this.staticXJsPos,
      y: this.staticYJsPos,
      enabled: true
    };
    this.maxForce = 55.0;//should use radius
    //see https://github.com/rexrainbow/phaser3-rex-notes/blob/master/plugins/input/virtualjoystick/VirtualJoyStick.js
    //in the update function
    this.normalizedX = 0.0;
    this.normalizedY = 0.0;
    this.sillyCounter = 0;
    this.sillyThreshold = 300;
    this.broadcastInterval = setInterval(() => this.normalizedXAndYFromForce(), 2000);
  }

  preload() {
    //this.load.plugin('rexvirtualjoystickplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js', true);
    this.load.image('base', './assets/base.png');
    this.load.image('thumb', './assets/thumb.png');
    this.load.plugin('rex-virtual-joystick-plugin"', VirtualJoystickPlugin, true);
   
  }
   

  createVirtualJoystick() {
    this.joyStick = this.plugins.get('rex-virtual-joystick-plugin"').add(
        this,
        Object.assign({}, this.joystickConfig, {
            radius: 55,
            base: this.add.image(0, 0, 'base').setDisplaySize(110, 110),
            thumb: this.add.image(0, 0, 'thumb').setDisplaySize(48, 48)
        })
    ).on('update', this.updateJoystickState, this);
    this.cursorKeys = this.joyStick.createCursorKeys();

    // Listener event to reposition virtual joystick
    // whatever place you click in game area
    this.input.on('pointerdown', pointer => {
        this.joyStick.x = pointer.x;
        this.joyStick.y = pointer.y;
        this.joyStick.base.x = pointer.x;
        this.joyStick.base.y = pointer.y;
        this.joyStick.thumb.x = pointer.x;
        this.joyStick.thumb.y = pointer.y;
    });

    // Listener event to return virtual 
    // joystick to its original position
    this.input.on('pointerup', pointer => {
        this.joyStick.x = this.staticXJsPos;
        this.joyStick.y = this.staticYJsPos;
        this.joyStick.base.x = this.staticXJsPos;
        this.joyStick.base.y = this.staticYJsPos;
        this.joyStick.thumb.x = this.staticXJsPos;
        this.joyStick.thumb.y = this.staticYJsPos;
        this.lastCursorDirection = "center";
        this.setCursorDebugInfo();
    });

  }

  setCursorDebugInfo() {
    const force = Math.floor(this.joyStick.force * 100) / 100;
    const angle = Math.floor(this.joyStick.angle * 100) / 100;
    const x_pos = this.normalizedX;
    const y_pos = this.normalizedY;
    let text = `Direction: ${this.lastCursorDirection}\n`;
    text += `Force: ${force}\n`;
    text += `Angle: ${angle}\n`;
    text += `X: ${x_pos}\n`;
    text += `Y: ${y_pos}\n`;
    text += `FPS: ${this.sys.game.loop.actualFps}\n`;
    this.cursorDebugText.setText(text);
  }

  create() {
    //this.socket = io();
    this.cursorDebugText = this.add.text(100, 10);
   
    this.createVirtualJoystick();
    this.setCursorDebugInfo();
    this.updateJoystickState();
  }

  update() {
    this.updateJoystickState();
    // if(this.sillyCounter>this.sillyThreshold){
    //   this.normalizedXAndYFromForce();
    //   this.sillyCounter = 0;
    // }
  }
  

  normalizedXAndYFromForce(){
    var newX = this.joyStick.forceX;
    var newY = this.joyStick.forceY;
    if (newX > this.maxForce)
    {
      newX = this.maxForce;
    }
    if (newX < (this.maxForce * -1.0))
    {

      newX = this.maxForce * -1.0;
    }
    if (newY > this.maxForce)
    {
      newY = this.maxForce;
    }
    if (newY < (this.maxForce * -1.0))
    {
      newY = this.maxForce * -1.0;
    }
    console.log('normalizedX: ' + this.normalizedX);
    this.normalizedX = newX/this.maxForce;
    this.normalizedY = newY/this.maxForce;
    socket.emit('action_keydown', 'J');

  }

  broadcastPositions() {
    if (this.normalizedX !== 0 || this.normalizedY !== 0)
    {
      
    }
  }

  updateJoystickState() {     
      // Set debug info about the cursor
      this.setCursorDebugInfo();
  }
}
