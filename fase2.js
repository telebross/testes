import {
    GameScene
} from "/GameScene.js";
export {
    fase2
};


var portas;
var player;
var player2;
var stars;
var bombs;
var platforms;
var cursors;
var scoreJogador1 = 0;
var scoreJogador2 = 0;
var gameOver = false;
var scoreText;
var scoreText2;
var music;
var moveCam = false;
//teclas de movimentação
var WKey;
var AKey;
var DKey;

var fase2 = new Phaser.Scene("fase2");

fase2.preload = function () {
    this.load.image('parede', 'assets/parede.png');
    this.load.image('ground', 'assets/plataforma.png');
    this.load.image('bloco', 'assets/bloco.png');
    this.load.image('blocolongo', 'assets/bloco2.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.image('boi', 'assets/boi.png');
    this.load.image('porta', 'assets/portaverde.png');
    this.load.image('saida', 'assets/saida.png');
    this.load.spritesheet('idle', 'assets/ifiano/idle.png', {
        frameWidth: 38,
        frameHeight: 62
    });
    this.load.spritesheet('run', 'assets/ifiano/run.png', {
        frameWidth: 43,
        frameHeight: 62
    });
    this.load.spritesheet('runleft', 'assets/ifiano/runleft.png', {
        frameWidth: 43,
        frameHeight: 62
    });
    this.load.spritesheet('dead', 'assets/ifiano/dead.png', {
        frameWidth: 77,
        frameHeight: 62
    });
    this.load.spritesheet('fullscreen', 'assets/fullscreen.png', {
        frameWidth: 64,
        frameHeight: 64
    });
    this.load.audio('music', 'assets/music.mp3')
};

fase2.create = function () {
    //parte de movimentação de cameras
    this.cameras.main.setBounds(0, 0, 3200, 600);
    this.physics.world.setBounds(0, 0, 3200, 600);


    //  A simple background for our game
    this.add.image(400, 300, 'parede');
    this.add.image(1200, 300, 'parede');
    this.add.image(2000, 300, 'parede');
    this.add.image(2800, 300, 'parede');
    this.add.image(3000, 510, 'porta');





    //texto GameOver
    this.GameOverText = this.add.text(400, 300, 'Game Over', {
        fontSize: '64px',
        fill: '#000'

    });
    this.GameOverText.visible = false

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = this.physics.add.staticGroup();




    //  Here we create the ground.
    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    platforms.create(400, 700, 'ground').setScale(2).refreshBody(); // chão
    platforms.create(1200, 700, 'ground').setScale(2).refreshBody(); //chão
    platforms.create(2000, 700, 'ground').setScale(2).refreshBody(); //chão
    platforms.create(2800, 700, 'ground').setScale(2).refreshBody(); //chão
    platforms.create(3600, 700, 'ground').setScale(2).refreshBody();
    platforms.create(3600, 500, 'ground').setScale(2).refreshBody();
    platforms.create(-400, 500, 'ground').setScale(2).refreshBody();
    platforms.create(600, 440, 'bloco').setScale(2).refreshBody(); //nivel 1
    platforms.create(350, 310, 'blocolongo').setScale(2).refreshBody(); //nivel 2




    // The player and its settings
    player = this.physics.add.sprite(100, 450, 'idle');
    player2 = this.physics.add.sprite(150, 450, 'idle');

    //parte do player com cameras
    this.cameras.main.startFollow(player, true, 0.05, 0.05);
    this.cameras.main.startFollow(player2, true, 0.05, 0.05);

    //  Player physics properties. Give the little guy a slight bounce.
    player.setCollideWorldBounds(true);
    player2.setCollideWorldBounds(true);

    //  Our player animations, turning, walking left and walking right.
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('runleft', {
            start: 0,
            end: 15
        }),
        frameRate: 15,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: this.anims.generateFrameNumbers('idle', {
            start: 0,
            end: 15
        }),
        frameRate: 20,
        repeat: -1

    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('run', {
            start: 0,
            end: 15
        }),
        frameRate: 20,
        repeat: -1
    });

    this.anims.create({
        key: 'dead',
        frames: this.anims.generateFrameNumbers('dead', {
            start: 0,
            end: 16
        }),
        frameRate: 10,
        repeat: 0
    });


    //criação da musica

    music = this.sound.add("music");
    music.play({
        loop: true,
        volume: 0.3
    });


    //  Input Events
    cursors = this.input.keyboard.createCursorKeys();
    WKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    AKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    DKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    //  Some stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
    stars = this.physics.add.group({
        key: 'star',
        repeat: 2,
        setXY: {
            x: 12,
            y: 0,
            stepX: 70
        }
    });

    stars.children.iterate(function (child) {

        //  Give each star a slightly different bounce
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

    });

    bombs = this.physics.add.group();
    portas = this.physics.add.group();

    //  The score1
    scoreText = this.add.text(16, 16, 'score1: 0', {
        fontSize: '32px',
        fill: '#000'
    });
    scoreText.setScrollFactor(0);

    //  The score2
    scoreText2 = this.add.text(16, 40, 'score2: 0', {
        fontSize: '32px',
        fill: '#000'
    });
    scoreText2.setScrollFactor(0);

    //fullscreen
    var button = this.add.image(800 - 16, 16, 'fullscreen', 0).setOrigin(1, 0).setInteractive();

    button.on('pointerup', function () {

        if (this.scale.isFullscreen) {
            button.setFrame(0);


            this.scale.stopFullscreen();
        } else {
            button.setFrame(1);


            this.scale.startFullscreen();
        }

    }, this);
    button.setScrollFactor(0);



    var FKey = this.input.keyboard.addKey('F');

    FKey.on('down', function () {

        if (this.scale.isFullscreen) {
            button.setFrame(1);
            this.scale.stopFullscreen();
        } else {
            button.setFrame(0);
            this.scale.startFullscreen();
        }

    }, this);




    //  Collide the player and the stars with the platforms
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(player2, platforms);
    this.physics.add.collider(stars, platforms);
    this.physics.add.collider(bombs, platforms)
    this.physics.add.collider(portas, platforms)
    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    this.physics.add.overlap(player, stars, collectStar, null, this);
    this.physics.add.overlap(player2, stars, coletarnota, null, this);

    this.physics.add.collider(player, bombs, hitBomb, null, this);
    this.physics.add.collider(player2, bombs, hitBomb, null, this);
    this.physics.add.collider(player, portas, mudarfase, null, this);


}


fase2.update = function () {

    //gameover
    if (gameOver === true) {
        this.scene.start(gameover);
    }

    //teste parte de movimentação de icones na tela

    var cam = this.cameras.main;

    if (moveCam) {
        if (cursors.left.isDown) {
            cam.scrollX -= 4;
        } else if (cursors.right.isDown) {
            cam.scrollX += 4;
        }
    };

    if (cursors.up.isDown) {
        cam.scrollY -= 4;
    } else if (cursors.down.isDown) {
        cam.scrollY += 4;

    }



    //          morte
    if (player.anims.getCurrentKey() === "dead" &&
        player.anims.getProgress("dead") < 1) {
        //player.setTint(0xff0000);
    } else if (
        player.anims.getCurrentKey() === "dead" &&
        player.anims.getProgress("dead") === 1) {

        //this.physics.pause();
        music.stop();
        gameOver = true;
    }
    //movimentação do personagem 1
    else if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.anims.play('left', true);

    } else if (cursors.right.isDown) {
        player.setVelocityX(160);

        player.anims.play('right', true);
    } else if (cursors.up.isUp && cursors.left.isUp && cursors.right.isUp) {
        player.setVelocityX(0);
        player.anims.play('turn');
    }
    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
    }
    //movimentação personagem 2

    if (AKey.isDown) {
        player2.setVelocityX(-160);

        player2.anims.play('left', true);
    } else if (DKey.isDown) {
        player2.setVelocityX(160);

        player2.anims.play('right', true);
    } else

    {
        player2.setVelocityX(0);

        player2.anims.play('turn');
    }
    if (WKey.isDown && player2.body.touching.down) {
        player2.setVelocityY(-330);
    }
}
/*
function collectStar(player, star) {
    star.disableBody(true, true);

    //  Add and update the score
    scoreJogador1 += 1;
    scoreText.setText('Score1: ' + scoreJogador1);


    if (stars.countActive(true) === 0) {
        //  A new batch of stars to collect
        stars.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true);

        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        bomb.allowGravity = false;

    }
    //gameover
    /* if (gameOver === true) {
       this.scene.start(gameover);
     }*/
//}

function collectStar(player, star) {
    star.disableBody(true, true);

    //  Add and update the score
    scoreJogador1 += 1;
    scoreText.setText('Score1: ' + scoreJogador1);


    if (stars.countActive(true) === 0) {
        //  A new batch of stars to collect
        stars.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true);

        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var porta = portas.create(x, 16, 'saida');
        porta.setBounce(1);
        porta.setCollideWorldBounds(true);
        // porta.setVelocity(Phaser.Math.Between(-200, 200), 20);
        //porta.allowGravity = false;

    }

}



function coletarnota(player2, star) {
    star.disableBody(true, true);

    //  Add and update the score  
    scoreJogador2 += 1; //fazer com que o score fique independente
    scoreText2.setText('Score2: ' + scoreJogador2);


    if (stars.countActive(true) === 0) {
        //  A new batch of stars to collect
        stars.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true);

        });

        var x = (player2.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        bomb.allowGravity = false;

    }
}

function hitBomb(player, bomb) {
    // this.physics.pause();

    //player.setTint(0xff0000);
    player.anims.play('dead', true);
    console.log(player.anims.getCurrentKey());
    //criar atraso na morte para que apareça a animação
}

function mudarfase(player, porta) {
    // this.physics.pause();

    //player.setTint(0xff0000);
    portas.anims.play('saida', true);

    //criar atraso na morte para que apareça a animação
}