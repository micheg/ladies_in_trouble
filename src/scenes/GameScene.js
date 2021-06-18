import { WIDTH, HEIGHT, CENTER_X, CENTER_Y, PLAYER } from '../cfg/cfg';
import { IMG, LVL, SND, spawn_point } from '../cfg/assets';
import Utils from '../utils/utils';
import Phaser from 'phaser'
import BeeSpawner from '../utils/BeeSpawner';
import VirtualJoystick from 'phaser3-rex-plugins/plugins/virtualjoystick.js';


export default class GameScene extends Phaser.Scene
{
    constructor()
    {
        super('game-scene');
        this.player = undefined;
        this.cursors = undefined;
        this.devil = undefined;
    }

    create()
    {
        // state
        this.game_over = false;
        this.audio_is_on = Utils.audio_is_on();
        // ui
        this.create_background();
        this.create_audio();

        // create map
        let platforms, fire;
        [platforms, fire]  = this.create_map();

        // game actors
        this.player = this.create_player();
        
        // items
        this.coin = this.create_coin();
        this.coin.play('idle', true);

        // enemies
        this.bee_spawner = new BeeSpawner(this, Utils.get_random_bee());
        const bee_group = this.bee_spawner.group

        // collision with platform
        this.physics.add.collider(this.player, platforms);

        this.platforms = platforms;
        this.physics.add.collider(bee_group, platforms, (bee, platform) =>
        {
            if(bee.body.velocity.x >= 0)
            {
                bee.setFlipX(true);
            }
            else
            {
                bee.setFlipX(false);
            }
        }, null, this);

        this.physics.add.collider(bee_group, fire, (bee, _f) =>
        {
            bee.x = 120;
            bee.y = -10;
            bee.body.velocity.y = 20;
        }, null, this);

        this.physics.add.collider(this.player, bee_group, () =>
        {
            this.game_over_fn(true);
        }, null, this);
        this.physics.add.collider(this.player, fire, () =>
        {
            this.game_over_fn(true);
        }, null, this);
        this.physics.add.overlap(this.player, this.coin, this.hit_coin, null, this);

        this.devil = this.create_enemy();
        this.physics.add.collider(this.devil, platforms);

        this.physics.add.collider(this.devil, this.player, (devil, player) =>
        {
            this.game_over_fn(true);
        }, null, this);

        this.physics.add.collider(this.devil, bee_group, (devil, bee) =>
        {
            if(this.audio_is_on) this.sounds.beam.play();
            devil.setVelocityX((devil.velocity > 0) ? -40 : 40);
            bee.destroy();
        }, null, this);

        let pos = Utils.get_pad_position();

        const joy_base = this.add.image(-100, -100, IMG.JOY_B);
        const joy_stick = this.add.image(-100, -100, IMG.JOY_U);
        joy_base.alpha=0.4;
        joy_stick.alpha=0.4;

        let y_cfg =
        {
            y: HEIGHT - 50,
            x: (pos === 'L') ? 50 : WIDTH - 50,
            radius: 40,
            dir: '8dir',
            forceMin: 16,
            enable: true,
            base: joy_base,
            thumb: joy_stick
        };

        let joystick = new VirtualJoystick(this, y_cfg);
        this.cursors = joystick.createCursorKeys();
        
        this.scene.launch('hud-scene');

        this.counter = 10;
        this.timer = this.time.addEvent(
        {
            delay: 15000,
            callback: () =>
            {
                this.re_enable_devil();
            },
            callbackScope: this,
            loop: true,
            paused: false
        });
    }

    create_map()
    {
        // random level and tiles
        this.level = Utils.get_random_lvl();
        this.map = Utils.get_random_tile_set();
        const map = this.make.tilemap({ key: this.level });
        const tileset = map.addTilesetImage('tiles', this.map);
        const platforms = map.createLayer('level', tileset, 0, 18);
        const bg = map.createLayer('bg', tileset, 0, 18);
        const fire = map.createLayer('danger', tileset, 0, 18);
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
        this.add.rectangle(CENTER_X, 9, WIDTH, 20, 0x000000);
    }

    add_coin()
    {
        const pos = Utils.get_random_coin_position((this.player.x >= 120) ? 'L': 'R');
        const dt =  Phaser.Math.Between(500, 2500);
        let timer = this.time.delayedCall(dt, () =>
        {
            this.coin.enableBody(true, pos.x, pos.y, true, true);
        }, null, this);
    }
    create_coin()
    {
        const pos = Utils.get_random_coin_position();
        //const coin = this.physics.add.sprite(pos.x, pos.y, IMG.COIN);
        const coin = this.physics.add.staticSprite(pos.x, pos.y, IMG.COIN);
        coin.setCircle(8);
        this.anims.create(
        {
            key: 'idle',
            frames: this.anims.generateFrameNumbers(IMG.COIN, { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        });
        return coin;
    }
    create_player()
    {
        const key = Utils.get_random_player();
        const player = this.physics.add.sprite(30, HEIGHT-60, key);
        player.body.setSize(18,28,true);
        player.setBounce(0.2)
        player.setCollideWorldBounds(true)

        this.anims.create(
        {
            key: 'walk',
            frames: this.anims.generateFrameNumbers(key, { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        
        this.anims.create(
        {
            key: 'turn',
            frames: [ { key: key, frame: 4 } ],
            frameRate: 20
        });
        
        return player;
    }

    update_keycontrols()
    {
        if(!this.cursors) return;
        if( this.cursors.left.isDown )
        {
            this.player.setVelocityX(-PLAYER.SPEED.x);
            this.player.setFlipX(false);
            this.player.anims.play('walk', true);
        }
        else if( this.cursors.right.isDown )
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
        if( this.cursors.up.isDown && this.player.body.onFloor() )
        {
            this.player.setVelocityY(-PLAYER.SPEED.y);
        }
    }

    update(dt)
    {
        if(!this.game_over)
        {
            this.update_keycontrols();
            // devil ia, if there is a hole he should jump
            const x = (this.devil.body.velocity > 0) ? this.devil.x + 10 : this.devil.x - 10;
            const tile = this.platforms.getTileAtWorldXY(x, this.devil.y + 15);
            const should_jump = Phaser.Math.Between(0, 10);
            // remove it from fire
            if(tile === null && this.devil.body.onFloor() && should_jump > 3)
            {
                this.devil.setVelocityY(-200 + Phaser.Math.Between(0, 60));
            }

            if(this.devil !== null && this.devil.y > HEIGHT-15)
            {
                this.devil.disableBody(true, true);
            }
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
        //this.cursors.destroy();
        this.add.bitmapText(CENTER_X, CENTER_Y, IMG.FONT, 'GAME OVER!', 40, 1).setOrigin(0.5, 0.5);
        this.game_over_action();
    }

    hit_coin(player, coin)
    {
        coin.disableBody(true, true);
        if(this.audio_is_on) this.sounds.pickup.play();
        this.events.emit('add.score');
        const cur_scores = this.scene.get('hud-scene').get_score();
        if(parseInt(cur_scores,10) % 70 === 0)
        {
            this.events.emit('add.level');
            for(let i=0; i < this.get_cur_level() - 1; i++)
            {
                this.bee_spawner.spawn(player.x);
                if(this.audio_is_on) this.sounds.beam.play();
            }
        }
        this.add_coin();
    }

    re_enable_devil()
    {
        let sign = (this.player.x > 120) ? 1 : -1;
        //if(this.player.x > 120) sign = -1
        if(!this.devil.active)
        {
            this.devil.enableBody(true, 120, -10, true, true);
            //let sign = Phaser.Math.Between(0,1) === 0 ? -1 : 1;
            this.devil.setVelocityX(40 * sign);
        }
    }
    
    create_enemy()
    {
        const key = IMG.DEVIL_A;
        let devil = this.physics.add.sprite(120, -10, key);
        devil.body.setCircle(12,10,2)
        //devil.setBounce(0.2)
        devil.setBounceX(1);
        devil.setCollideWorldBounds(true);
        devil.setVelocityX(-40);
        this.anims.create(
        {
            key: 'dwalk',
            frames: this.anims.generateFrameNumbers(key, { start: 0, end: 4 }),
            frameRate: 10,
            repeat: -1
        });
        devil.anims.play('dwalk');
        return devil;
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
        Utils.get_ads(()=>
        {
            this.scene.stop();
            this.scene.start('score-scene');
        });
    }
}