
var config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 0 }
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  } 
  
};

var game = new Phaser.Game(config);

function preload() {
  //this.load.image('ship', 'assets/spaceShips_001.png');
  //this.load.image('otherPlayer', 'assets/enemyBlack5.png');
  //this.load.image('star', 'assets/star_gold.png');
}

function create() {
  this.socket = io();
  this.action_key_down = null;
  //add keys to input
  this.k_UP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP)
  this.k_DOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN)
  this.k_LEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
  this.k_RIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
  this.syringe_jog_keys = [
    [this.k_UP, "UP"],
    [this.k_DOWN, "DOWN"],
    [this.k_LEFT, "LEFT"],
    [this.k_RIGHT, "RIGHT"],
  ]
  //these will control the substrate jog/rotation + tilting
  this.k_Q = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q)
  this.k_E = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E)
  this.substrate_jog_keys = [
    [this.k_Q, "Q"],
    [this.k_E, "E"],   
  ]
  //substrate tilting
  this.k_W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
  this.k_A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
  this.k_S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
  this.k_D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
  this.substrate_tilt_keys = [
    [this.k_W, "W"],
    [this.k_A, "A"],
    [this.k_S, "S"],
    [this.k_D, "D"],
  ]
  //modifier keys
  this.k_ALT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ALT)
  this.k_CTRL = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.CTRL)
  this.k_SHIFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT)
  this.modifier_keys = [
    [this.k_ALT, "ALT"],
    [this.k_CTRL, "CTRL"],
    [this.k_SHIFT, "SHIFT"],
  ]
  //these will be used for sending SIE_Action commands
  this.k_B = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.B)
  this.k_C = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C)
  this.k_N = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.N)
  this.k_H = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H)
  this.k_J = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J)
  this.k_K = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K)
  this.k_L = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L)
  this.k_R = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R)
  this.k_SPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
  this.k_V = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.V)
  this.k_X = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X)
  this.k_G = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.G)
  this.k_1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE)
  this.k_2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO)
  this.k_3 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE)
  this.k_4 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR)
  this.k_5 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FIVE)
  this.k_6 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SIX)
  this.SIE_action_keys = [
    [this.k_B, "B"],
    [this.k_C, "C"],
    [this.k_H, "H"],
    [this.k_N, "N"],
    [this.k_J, "J"],
    [this.k_K, "K"],
    [this.k_L, "L"],
    [this.k_R, "R"],
    [this.k_SPACE, "SPACE"],
    [this.k_V, "V"],
    [this.k_X, "X"],
    [this.k_G, "G"],
    [this.k_1, "1"],
    [this.k_2, "2"],
    [this.k_3, "3"],
    [this.k_4, "4"],
    [this.k_5, "5"],
    [this.k_6, "6"],
  ]
  //combine all movement keys arrays
  this.movement_keys = [
  ...this.syringe_jog_keys,
  ...this.substrate_jog_keys,
  ...this.substrate_tilt_keys,
  //...this.modifier_keys,
  ]
  
  this.socket.on('keyboard_input', function()
  {
    //update the GUI
  });
}

function update() {
  //do this to only send a command once when the key is pressed
  //for some reason we can't use the keyDown event in the Phaser docs
  if(this.action_key_down == null)
  {
    this.SIE_action_keys.forEach(key => {
      if(key[0].isDown)
      {
        this.socket.emit('action_keydown', key[1]);
        this.action_key_down = key;
      }
    });
  }
  else if(this.action_key_down[0].isDown == false)
  {
    this.action_key_down = null;
  }

  //store movement key chars in this array to emit
  this.movement_keys_down = []
  //check which moevment keys are down to
  //constantly update listeners
  this.movement_keys.forEach(element => {
    if(element[0].isDown)
    {
      //console.log(element + ' is DOWN')
      this.movement_keys_down = this.movement_keys_down.concat(element[1]);
    }
  });
  if (this.movement_keys_down.length > 0)
  {
    //notify listeners of which keys are down 
    this.socket.emit('keyboard_input', this.movement_keys_down)
    this.no_keydown_event_fired = false
  }
}
