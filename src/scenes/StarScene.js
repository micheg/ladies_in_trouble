import { WIDTH, HEIGHT, CENTER_X, CENTER_Y } from '../cfg/cfg';
import { IMG } from '../cfg/assets';
import Utils from '../utils/utils';
import Phaser from 'phaser'

export default class StartScene extends Phaser.Scene
{
    constructor()
    {
        super('start-scene');
        this.down_flag = false;
        this.prev_obj = undefined;
        this.alpha_inc = 0;
    }

    create()
    {
        console.log("create");
        this.current_position = 0;
        // ui
        this.add.image(CENTER_X, CENTER_Y, IMG.SKY);
        this.star1 = this.add.image(CENTER_X - 100, CENTER_Y - 55, IMG.STAR);
        this.star2 = this.add.image(CENTER_X + 100, CENTER_Y - 55, IMG.STAR);
        this.logo = this.add.image(CENTER_X, 70, IMG.LOGO);

        let text_start = this.add.bitmapText(CENTER_X, CENTER_Y, IMG.FONT, 'START', 40, 1);
        let text_config = this.add.bitmapText(CENTER_X, CENTER_Y + 50, IMG.FONT, 'AUDIO ON', 40, 1);
        let text_exit = this.add.bitmapText(CENTER_X, CENTER_Y + 100, IMG.FONT, 'EXIT', 40, 1);
        text_start.setOrigin(0.5, 0.5);
        text_config.setOrigin(0.5, 0.5);
        text_exit.setOrigin(0.5, 0.5);
        this.text_config = text_config;

        this.positions =
        [
            {
                y: CENTER_Y -5,
                action: 'START',
                obj: text_start,
                anim: false
            },
            {
                y: CENTER_Y + 45,
                action: 'SOUND',
                obj: text_config,
                anim: false
            },
            {
                y: CENTER_Y + 95,
                action: 'EXIT',
                obj: text_exit,
                anim: false
            }
        ];

        // keybind
        this.startButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        //this.leftButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        //this.rightButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);


        //  Create our keyboard controls.
        this.cursors = this.input.keyboard.addKeys(
        {
            leftKey: Phaser.Input.Keyboard.KeyCodes.LEFT,
            rightKey: Phaser.Input.Keyboard.KeyCodes.RIGHT,
            upKey: Phaser.Input.Keyboard.KeyCodes.UP,
            downKey: Phaser.Input.Keyboard.KeyCodes.DOWN
        });

        Utils.make_bottom_bar(this,
        {
            left_text: 'About',
            left_scene: 'about-scene',
            right_text: 'Rules',
            right_scene: 'intro-scene',
            bottom_bar: true
        });

        // read save data
        const audio = localStorage.getItem('audio');
        if(audio === 'off') this.text_config.text = 'AUDIO OFF';
    }

    uodate_keybind()
    {
        if (this.startButton.isDown)
        {
            this.down_flag = true;
        }
        else
        {
            if(this.down_flag)
            {
                this.down_flag = false;
                this.parse_enter();
            }
        }
        /*if (this.leftButton.isDown)
        {
            this.scene.pause();
            this.scene.start('about-scene');
        }
        else if (this.rightButton.isDown)
        {
            this.scene.pause();
            this.scene.start('intro-scene');
        }*/
    }

    update_keypad()
    {
        const { upKey, downKey } = this.cursors;
        if (Phaser.Input.Keyboard.JustDown(upKey))
        {
            if(this.current_position == 0)
            {
                this.current_position = this.positions.length - 1;
                return;
            }
            else
            {
                this.current_position -= 1;
                return;
            }
        }
        else if (Phaser.Input.Keyboard.JustDown(downKey))
        {
            if(this.current_position == this.positions.length - 1)
            {
                this.current_position = 0;
                return;
            }
            else
            {
                this.current_position += 1;
                return;
            }
        }
    }
    update_ui_menu()
    {
        this.star1.y = this.positions[this.current_position].y;
        this.star2.y = this.positions[this.current_position].y;
    }

    cur_menu_tween()
    {
        let cur_obj = this.positions[this.current_position].obj;
        for(let i=0; i<this.positions.length; i++)
        {
            if(i !== this.current_position)
            {
                this.positions[i].obj.alpha = 1;
            }
        }
        if(cur_obj.alpha == 1)
        {
            this.alpha_inc = -0.05;
        }
        else if(cur_obj.alpha == 0)
        {
            this.alpha_inc = 0.05;
        }
        cur_obj.alpha += this.alpha_inc;
    }

    parse_enter()
    {
        const action = this.positions[this.current_position].action;
        switch (action)
        {
            case 'START':
                this.scene.pause();
                this.scene.start('game-scene');
                break;
            case 'SOUND':
                let text = this.text_config.text;
                setTimeout(() =>
                {
                    this.text_config.text = (text === 'AUDIO ON') ? 'AUDIO OFF': 'AUDIO ON';
                    const tmp = this.text_config.text;
                    localStorage.setItem('audio', (tmp === 'AUDIO ON') ? 'on' : 'off');
                    if(tmp === 'AUDIO ON')
                    {
                        this.events.emit('snd.on');
                    }
                    else
                    {
                        this.events.emit('snd.off');
                    }
                },10);
                break;
            case 'EXIT':
                window.close();
                break;
        }
    }

    update()
    {
        this.uodate_keybind();
        this.update_keypad();
        this.update_ui_menu();
        this.cur_menu_tween();
    }
}
