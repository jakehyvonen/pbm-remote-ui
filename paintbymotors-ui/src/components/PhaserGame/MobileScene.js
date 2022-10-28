import Phaser from 'phaser'
import VirtualJoystickPlugin from 'phaser3-rex-plugins/plugins/virtualjoystick-plugin.js';
import openSocket from 'socket.io-client';

// TODO: 'left&right' joystick for rotation??
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

    this.joystickAConfig = {
      x: this.gameWidth/6,
      y: this.gameHeight*5/6,
    }
    this.joystickBConfig = {
      x: this.gameWidth*5/6,
      y: this.gameHeight*5/6,
    }    
    this.joystickCConfig = {
      x: this.gameWidth*5/6,
      y: this.gameHeight*3/6,
      dir:'2dir',
    }    
    this.broadcastInterval = setInterval(() => this.normalizedXAndYFromForce(), 2000);
  }
   
  createVirtualJoystick(config) {
    let newJoyStick = this.plugins.get('rex-virtual-joystick-plugin"').add(
        this,
        Object.assign({}, config, {
            enabled: true,
            radius: 100,
            base: this.add.image(0, 0, 'base').setDisplaySize(200, 200),
            thumb: this.add.image(0, 0, 'thumb').setDisplaySize(75, 75),
            normalizedX : 0.0,
            normalizedY : 0.0,
        })
    ).on('update', this.updateJoystickState, this);
    return newJoyStick;
  }


  create() {
    //this.socket = io();
    this.cursorDebugTextA = this.add.text(100, 200);
    this.cursorDebugTextB = this.add.text(100, 200);
    this.input.addPointer(1);

    this.joyStick = this.createVirtualJoystick(this.joystickAConfig);
    this.joyStickB = this.createVirtualJoystick(this.joystickBConfig);
    this.joyStickC = this.createVirtualJoystick(this.joystickCConfig);
    this.joysticks = [this.joyStick,this.joyStickB,this.joyStickC];
    this.setCursorDebugInfo();
    this.updateJoystickState();
  }


  normalizedXAndYFromForce(){
    this.joysticks.forEach(function(joyStick){
      var newX = joyStick.forceX;
      var newY = joyStick.forceY;
      
      if (joyStick.force > joyStick.radius) { // Exceed radius
        const angle = Math.floor(joyStick.angle * 100) / 100;
        const rad = angle * Math.PI / 180;   
        //force x and y to be values intersecting radius at joystick.angle
        newX = Math.cos(rad) * joyStick.radius;
        newY = Math.sin(rad) * joyStick.radius;
      }
      joyStick.normalizedX = newX/joyStick.radius;//radius = max force
      joyStick.normalizedY = newY/joyStick.radius;
      console.log('normalizedX: ' + joyStick.normalizedX);
      console.log('normalizedY: ' + joyStick.normalizedY);
    });

    // var newX = this.joyStick.forceX;
    // var newY = this.joyStick.forceY;
    
    // if (this.joyStick.force > this.joyStick.radius) { // Exceed radius
    //   const angle = Math.floor(this.joyStick.angle * 100) / 100;
    //   const rad = angle * Math.PI / 180;   
    //   //force x and y to be values intersecting radius at joystick.angle
    //   newX = Math.cos(rad) * this.joyStick.radius;
    //   newY = Math.sin(rad) * this.joyStick.radius;
    // }
    // this.joyStick.normalizedX = newX/this.joyStick.radius;//radius = max force
    // this.joyStick.normalizedY = newY/this.joyStick.radius;
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

  setCursorDebugInfo = function() {
    const force = Math.floor(this.joyStick.force * 100) / 100;
    const angle = Math.floor(this.joyStick.angle * 100) / 100;
    const x_pos = this.joyStick.normalizedX;
    const y_pos = this.joyStick.normalizedY;
    let text = `Force: ${force}\n`;
    text += `Angle: ${angle}\n`;
    text += `X: ${x_pos}\n`;
    text += `Y: ${y_pos}\n`;
    text += `FPS: ${this.sys.game.loop.actualFps}\n`;
    this.cursorDebugTextA.setText(text);
    //this.joyStick.cursorDebugText.setText(text);
  }
}
