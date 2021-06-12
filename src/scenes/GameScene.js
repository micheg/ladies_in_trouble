import { WIDTH, HEIGHT, CENTER_X, CENTER_Y, PLAYER } from '../cfg/cfg';
import { IMG, LVL, SND } from '../cfg/assets';
import Utils from '../utils/utils';
import Phaser from 'phaser'

export default class GameScene extends Phaser.Scene
{
    constructor()
    {
        super('game-scene');
        this.player = undefined;
        this.cursors = undefined;
    }

    create()
    {
        this.game_over = false;
        // ui
        this.create_background();
        this.create_audio();
        this.audio_is_on = Utils.audio_is_on();

        // create map
        let platforms, fire;
        [platforms, fire]  = this.create_map();

        // game actors
        this.player = this.create_player();

        // collision with platform
        this.physics.add.collider(this.player, platforms);

        this.physics.add.collider(this.player, fire, this.hit_fire, null, this);
        // input
        this.cursors = this.input.keyboard.createCursorKeys();
        // hud
        this.scene.launch('hud-scene');
        this.create_kaios_menu();
        this.create_kaios_keys();

    }

    create_map()
    {
        //const map = this.make.tilemap({ key: Utils.get_random_lvl() });
        const map = this.make.tilemap({ key: LVL.Z });
        const tileset = map.addTilesetImage('tiles', Utils.get_random_tile_set());
        const platforms = map.createLayer('level', tileset, 0, 8);
        const bg = map.createLayer('bg', tileset, 0, 8);
        const fire = map.createLayer('danger', tileset, 0, 8);
        platforms.setCollisionByExclusion(-1, true);
        fire.setCollisionByExclusion(-1, true);
        return [platforms, fire];
    }

    create_audio()
    {
        this.sounds =
        {
            pickup: this.sound.add(SND.PICKUP),
            over: this.sound.add(SND.OVER),
            beam: this.sound.add(SND.BEAM)
        };
    }

    create_background()
    {
        this.add.image(CENTER_X, CENTER_Y, IMG.SKY);
    }

    create_kaios_menu()
    {
        // top header
        this.add.rectangle(120, 4, 240, 8, 0x000000, 1);
        // bottom hud
        Utils.make_bottom_bar(this,
        {
            left_text: 'Menu',
            left_scene: 'start-scene',
            bottom_bar: false,
            before_switch: () =>
            {
                this.scene.stop('hud-scene');
            },
            invisible: true
        });
        
        this.leftButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
    }

    create_kaios_keys()
    {
        this.kaios_keyboard = {};
        this.kaios_keyboard.up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
        this.kaios_keyboard.left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR);
        this.kaios_keyboard.right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SIX);
    }

    create_player()
    {
        const player = this.physics.add.sprite(30, HEIGHT-60, IMG.PLAYER_A);
        player.body.setSize(18,28,true);
        player.setBounce(0.2)
        player.setCollideWorldBounds(true)

        this.anims.create(
        {
            key: 'walk',
            frames: this.anims.generateFrameNumbers(IMG.PLAYER_A, { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        
        this.anims.create(
        {
            key: 'turn',
            frames: [ { key: IMG.PLAYER_A, frame: 4 } ],
            frameRate: 20
        });
        
        return player;
    }

    uodate_keybind()
    {
        if (this.leftButton.isDown)
        {
            this.scene.stop('hud-scene');
            this.scene.stop();
            this.scene.start('start-scene');
        }
    }

    update_keycontrols()
    {
        if (this.cursors.left.isDown || this.kaios_keyboard.left.isDown)
        {
            this.player.setVelocityX(-PLAYER.SPEED.x);
            this.player.setFlipX(false);
            this.player.anims.play('walk', true);
        }
        else if (this.cursors.right.isDown || this.kaios_keyboard.right.isDown)
        {
            this.player.setVelocityX(PLAYER.SPEED.x);
            this.player.setFlipX(true);
            this.player.anims.play('walk', true);
        }
        else
        {
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
        }
        if(
            (this.cursors.up.isDown && this.player.body.onFloor()) ||
            (this.kaios_keyboard.up.isDown && this.player.body.onFloor())
          )
        {
            this.player.setVelocityY(-PLAYER.SPEED.y);
        }
    }

    hit_fire()
    {
        console.log("fire!");
        this.game_over_fn(true);
    }

    update()
    {
        if(!this.game_over)
        {
            this.uodate_keybind();
            this.update_keycontrols();
        }
    }

    get_cur_level()
    {
        return this.scene.get('hud-scene').get_level();
    }

    game_over_fn(fired=true)
    {
        if(this.audio_is_on) this.sounds.over.play();
        this.physics.pause();
        if(fired)
        {
            this.player.setTint(0xff0000);
            this.player.anims.play('turn');
            this.player.setFlip(true, true);
        }
        this.game_over = true;
        this.add.bitmapText(CENTER_X, CENTER_Y, IMG.FONT, 'GAME OVER!', 40, 1).setOrigin(0.5, 0.5);
        var timer = this.time.delayedCall(2000, this.game_over_action, null, this);
    }

    game_over_action()
    {
        const cur_scores = this.scene.get('hud-scene').get_score();
        this.scene.stop('hud-scene');
        let scores = Utils.scores_load();
        scores.push(cur_scores);
        scores = scores.sort((a,b) =>  b-a);
        scores = scores.slice(0, 10);
        Utils.scores_save(scores);
        this.scene.pause();
        this.scene.start('score-scene');
    }
}