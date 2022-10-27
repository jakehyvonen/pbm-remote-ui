import Phaser from 'phaser'
import VirtualJoystickPlugin from 'phaser3-rex-plugins/plugins/virtualjoystick-plugin.js';
import openSocket from 'socket.io-client';
export default class MobileScene extends Phaser.Scene {
  constructor() {
    super('mobile')
  } 

  init() {
    //this.socket = openSocket('http://192.168.1.195:8081');

    this.gameWidth = this.sys.game.config.width;
    this.gameHeight = this.sys.game.config.height;
    this.gameWidthMiddle = this.gameWidth  / 2;
    this.gameHeightMiddle = this.gameHeight / 2;      
    this.staticXJsPos = this.gameWidthMiddle / 2;
    this.staticYJsPos = this.gameHeightMiddle / 2;
    this.joystickConfig = {
      x: this.staticXJsPos,
      y: this.staticYJsPos,
      enabled: true
    };
    //see https://github.com/rexrainbow/phaser3-rex-notes/blob/master/plugins/input/virtualjoystick/VirtualJoyStick.js
    //in the update function
    this.normalizedX = 0.0;
    this.normalizedY = 0.0;
    this.broadcastInterval = setInterval(() => this.normalizedXAndYFromForce(), 2000);
  }

  preload() {
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
        this.setCursorDebugInfo();
    });
  }


  create() {
    //this.socket = io();
    this.cursorDebugText = this.add.text(100, 10);
  
    this.createVirtualJoystick();
    this.setCursorDebugInfo();
    this.updateJoystickState();
  }


  normalizedXAndYFromForce(){
    var newX = this.joyStick.forceX;
    var newY = this.joyStick.forceY;
    
    if (this.joyStick.force > this.joyStick.radius) { // Exceed radius
      const angle = Math.floor(this.joyStick.angle * 100) / 100;
      const rad = angle * Math.PI / 180; 
      var cosrad = Math.cos(rad);
      var sinrad = Math.sin(rad);
      console.log('rad: ' + rad);
      console.log('cosrad: ' + cosrad);
      console.log('sinrad: ' + sinrad);
      newX = Math.cos(rad) * this.joyStick.radius;
      newY = Math.sin(rad) * this.joyStick.radius;
    }

    console.log('normalizedX: ' + this.normalizedX);
    this.normalizedX = newX/this.joyStick.radius;//radius = max force
    this.normalizedY = newY/this.joyStick.radius;
  }

  broadcastPositions() {
    if (this.normalizedX !== 0 || this.normalizedY !== 0)
    {
      //this.socket.emit('a thing');
    }
  }

  update() {
    this.updateJoystickState();   
  }
  
  updateJoystickState() {     
    // Set debug info about the cursor
    this.setCursorDebugInfo();
  }

  setCursorDebugInfo() {
    const force = Math.floor(this.joyStick.force * 100) / 100;
    const angle = Math.floor(this.joyStick.angle * 100) / 100;
    const x_pos = this.normalizedX;
    const y_pos = this.normalizedY;
    let text = `Force: ${force}\n`;
    text += `Angle: ${angle}\n`;
    text += `X: ${x_pos}\n`;
    text += `Y: ${y_pos}\n`;
    text += `FPS: ${this.sys.game.loop.actualFps}\n`;
    this.cursorDebugText.setText(text);
  }
}
