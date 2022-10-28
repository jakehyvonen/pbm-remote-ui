import Button from 'phaser3-rex-plugins/plugins/input/button/Button.js';
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
    this.load.image('blue1', './assets/blue-1.png');
    this.load.image('blue1push', './assets/blue-1-pushed.png');
    this.load.image('blue2', './assets/blue-2.png');
    this.load.image('blue2push', './assets/blue-2-pushed.png');
    this.load.image('blue3', './assets/blue-3.png');
    this.load.image('blue3push', './assets/blue-3-pushed.png');
    this.load.image('silverdown', './assets/silver-!arrowdown.png');
    this.load.image('silverdownpush', './assets/silver-!arrowdown-pushed.png');
    this.load.image('redr', './assets/red-R.png');
    this.load.image('redrpush', './assets/red-R-pushed.png');
    this.load.image('yellowblank', './assets/yellow-!blank.png');
    this.load.image('yellowblankpush', './assets/yellow-!blank-pushed.png');
    this.load.plugin('rex-virtual-joystick-plugin"', VirtualJoystickPlugin, true);   
		// sprites, note: see free sprite atlas creation tool here https://www.leshylabs.com/apps/sstool/
  
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
      dir:'left&right',
    }    
    this.isDispensing = false;
    this.isRecording = false;
    this.isReplaying = false;
    this.broadcastInterval = setInterval(() => this.broadcastPositions(), 200);
  }
   
  createVirtualJoystick(config) {
    let newJoyStick = this.plugins.get('rex-virtual-joystick-plugin"').add(
        this,
        Object.assign({}, config, {
            enabled: true,
            radius: 100,
            base: this.add.image(0, 0, 'base').setDisplaySize(200, 200),
            thumb: this.add.image(0, 0, 'thumb').setDisplaySize(75, 75),
            normalizedX : 0,
            normalizedY : 0,
        })
    ).on('update', this.updateJoystickState, this);
    return newJoyStick;
  }

  doBack(){

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

    var dispenseSprite = this.add.sprite(this.gameWidth/6, this.gameHeight/2, 'silverdown');
    dispenseSprite.scale = 5;
   
    this.dispenseButton = new Button(dispenseSprite);
    this.dispenseButton.on('click', function()
    {
      console.log('clicky');
      if(this.isDispensing){
        dispenseSprite.setTexture('silverdown')
        this.isDispensing = false;
      }
      else{
        dispenseSprite.setTexture('silverdownpush')
        this.isDispensing = true;
        //socket emit dispensing
      }
    })

    var button1sprite = this.add.sprite(this.gameWidth/6, this.gameHeight/6, 'blue1');
    button1sprite.scale = 3;
    var button2sprite = this.add.sprite(this.gameWidth/4, this.gameHeight/6, 'blue2');
    button2sprite.scale = 3;
    var button3sprite = this.add.sprite(this.gameWidth/3, this.gameHeight/6, 'blue3');
    button3sprite.scale = 3;
    this.button1 = new Button(button1sprite);
    this.button1.on('click', function()
    {
      console.log('clicky1');      
        //socket emit button 1
      
    })
    this.button2 = new Button(button2sprite);
    this.button2.on('click', function()
    {
      console.log('clicky2');      
        //socket emit button 1
      
    })
    this.button3 = new Button(button3sprite);
    this.button3.on('click', function()
    {
      console.log('clicky3');      
        //socket emit button 1
      
    })
    var recordButtonSprite = this.add.sprite(this.gameWidth*5/6, this.gameHeight/6, 'yellowblank');
    recordButtonSprite.scale = 5;
    var replayButtonSprite = this.add.sprite(this.gameWidth*4/6, this.gameHeight/6, 'redr');
    replayButtonSprite.scale = 3;

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
      joyStick.normalizedX = (joyStick.normalizedX).toPrecision(3);
      joyStick.normalizedY = (joyStick.normalizedY).toPrecision(3);
      // console.log('normalizedX: ' + joyStick.normalizedX);
      // console.log('normalizedY: ' + joyStick.normalizedY);
    });
  }

  broadcastPositions() {
    var positions = [this.joyStick.normalizedX, this.joyStick.normalizedY,
      this.joyStickB.normalizedX, this.joyStickB.normalizedY, this.joyStickC.normalizedX]
    
    if(positions.some(el => el>0 || el<0)) {
      var msg = null;
      
      //construct a msg if anythin is nonzero
      msg = 'joystick_positions[';
      msg += this.joyStick.normalizedX + ',';
      msg += this.joyStick.normalizedY + ',';
      msg += this.joyStickB.normalizedX + ',';
      msg += this.joyStickB.normalizedY + ',';
      msg += this.joyStickC.normalizedX + ']';
      console.log('msg: ' + msg);

      //this.socket.emit('a thing');
    }
  }

  update() {
    this.updateJoystickState();   
  }
  
  updateJoystickState() {     
    // Set debug info about the cursor
    this.normalizedXAndYFromForce()
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
