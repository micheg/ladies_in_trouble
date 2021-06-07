import { WIDTH, HEIGHT, CENTER_X, CENTER_Y, PLAYER } from '../cfg/cfg';
import { IMG, SND } from '../cfg/assets';
import BombSpawner from '../utils/BombSpawner';
import StarsSpawner from '../utils/StarsSpawner';
import Utils from '../utils/utils';
import Phaser from 'phaser'

export default class GameScene extends Phaser.Scene
{
    constructor()
    {
        super('game-scene');
        this.player = undefined;
        this.cursors = undefined;
        this.label_score = undefined;
        this.label_level = undefined;
        this.bomb_spawner = undefined;
        this.stars = undefined;
    }

    create()
    {
        this.game_over = false;
        // ui
        this.create_background();
        this.create_kaios_menu();
        this.create_kaios_keys();
        this.create_audio();
        this.audio_is_on = Utils.audio_is_on();

        // game actors
        const platforms = this.create_platforms();
        this.player = this.create_player();
        this.stars = this.create_stars();
        const stars_group = this.stars.group;
        // da bomb!
        this.bomb_spawner = new BombSpawner(this);
        const bombs_group = this.bomb_spawner.group

        // collision with platform
        this.physics.add.collider(stars_group, platforms);
        this.physics.add.collider(this.player, platforms);
        this.physics.add.collider(bombs_group, platforms);

        this.physics.add.collider(this.player, bombs_group, this.hit_bomb, null, this);

        // collision with collectable
        this.physics.add.overlap(this.player, stars_group, this.collect_star, null, this);

        // input
        this.cursors = this.input.keyboard.createCursorKeys();

        // hud
        this.scene.launch('hud-scene');
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

    create_platforms()
    {
        const platforms = this.physics.add.staticGroup();
        // bottom platform
        platforms.create(CENTER_X, HEIGHT - 30, IMG.GROUND);
        // left platforms
        platforms.create(-60, 80, IMG.GROUND);
        platforms.create(0, 210, IMG.GROUND);
        // right platform
        platforms.create(280, 140, IMG.GROUND);
        return platforms;
    }

    create_kaios_menu()
    {
        // top header
        this.add.rectangle(120, 8, 240, 16, 0x000000, 1);
        // bottom hud
        Utils.make_bottom_bar(this,
        {
            left_text: 'Menu',
            left_scene: 'start-scene',
            bottom_bar: false
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
        const player = this.physics.add.sprite(100, 100, IMG.MELISSA);
        player.body.setSize(18,28,true);
        player.setBounce(0.2)
        player.setCollideWorldBounds(true)

        this.anims.create(
        {
            key: 'left',
            frames: this.anims.generateFrameNumbers(IMG.MELISSA, { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        
        this.anims.create(
        {
            key: 'turn',
            frames: [ { key: IMG.MELISSA, frame: 4 } ],
            frameRate: 20
        });
        
        this.anims.create(
        {
            key: 'right',
            frames: this.anims.generateFrameNumbers(IMG.MELISSA, { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
        return player;
    }

    create_stars()
    {
        const tmp = new StarsSpawner(this);
        tmp.spawn();
        return tmp;
    }

    collect_star(player, star)
    {
        star.disableBody(true, true);
        if(this.audio_is_on) this.sounds.pickup.play();
        this.events.emit('add.score');
        if(this.stars.are_zero)
        {
            this.stars.spawn();
            for(let i=0; i < this.get_cur_level(); i++)
            {
                this.bomb_spawner.spawn(player.x);
                if(this.audio_is_on) this.sounds.beam.play();
            }
            this.events.emit('add.level');
        }
    }

    uodate_keybind()
    {
        if (this.leftButton.isDown)
        {
            this.scene.pause();
            this.scene.start('start-scene');
        }
    }

    update_keycontrols()
    {
        if (this.cursors.left.isDown || this.kaios_keyboard.left.isDown)
        {
            this.player.setVelocityX(-PLAYER.SPEED.x);
            this.player.anims.play('left', true);
        }
        else if (this.cursors.right.isDown || this.kaios_keyboard.right.isDown)
        {
            this.player.setVelocityX(PLAYER.SPEED.x);
            this.player.anims.play('right', true);
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

    hit_bomb(player, bomb)
    {
        if(this.audio_is_on) this.sounds.over.play();
        this.physics.pause();
        player.setTint(0xff0000);
        player.anims.play('turn');
        player.setFlip(true, true);
        this.game_over = true;
        this.add.bitmapText(CENTER_X, CENTER_Y, IMG.FONT, 'GAME OVER!', 40, 1).setOrigin(0.5, 0.5);
        var timer = this.time.delayedCall(2000, this.game_over_action, null, this);
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