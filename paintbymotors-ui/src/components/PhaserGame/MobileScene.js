import Phaser from 'phaser'
import VirtualJoystickPlugin from 'phaser3-rex-plugins/plugins/virtualjoystick-plugin.js';
import openSocket from 'socket.io-client';
export default class MobileScene extends Phaser.Scene {
  constructor() {
    super('mobile')
  } 

  //Phaser.Scene method
  preload() {
    this.load.image('base', './assets/base.png');
    this.load.image('thumb', './assets/thumb.png');
    this.load.plugin('rex-virtual-joystick-plugin"', VirtualJoystickPlugin, true);   
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
    };
    this.normalizedX = 0.0;
    this.normalizedY = 0.0;
    this.broadcastInterval = setInterval(() => this.normalizedXAndYFromForce(), 2000);
  }
   
  createVirtualJoystick(config) {
    let newJoyStick = this.plugins.get('rex-virtual-joystick-plugin"').add(
        this,
        Object.assign({}, config, {
            enabled: true,
            radius: 55,
            base: this.add.image(0, 0, 'base').setDisplaySize(110, 110),
            thumb: this.add.image(0, 0, 'thumb').setDisplaySize(48, 48)
        })
    ).on('update', this.updateJoystickState, this);
    return newJoyStick;
  }


  create() {
    //this.socket = io();
    this.cursorDebugText = this.add.text(100, 10);

    this.joyStick = this.createVirtualJoystick(this.joystickConfig);
    this.setCursorDebugInfo();
    this.updateJoystickState();
  }


  normalizedXAndYFromForce(){
    var newX = this.joyStick.forceX;
    var newY = this.joyStick.forceY;
    
    if (this.joyStick.force > this.joyStick.radius) { // Exceed radius
      const angle = Math.floor(this.joyStick.angle * 100) / 100;
      const rad = angle * Math.PI / 180;   
      //force x and y to be values intersecting radius at joystick.angle
      newX = Math.cos(rad) * this.joyStick.radius;
      newY = Math.sin(rad) * this.joyStick.radius;
    }
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
