import { WIDTH, HEIGHT, CENTER_X, CENTER_Y } from '../cfg/cfg';
import { IMG } from '../cfg/assets';
import Utils from '../utils/utils';
import Phaser from 'phaser'

export default class StartScene extends Phaser.Scene
{
    constructor()
    {
        super('start-scene');
        this.prev_obj = null;
    }

    create()
    {
        this.current_position = 0;
        // ui
        this.add.image(CENTER_X, CENTER_Y, IMG.SKY);
        this.logo = this.add.image(CENTER_X, 70, IMG.LOGO);

        const starting_point = CENTER_Y -40;
        const increment = 44;
        const labels = ['START', 'AUDIO ON', 'PAD LEFT', 'ABOUT', 'RULES', 'EXIT'];
        const IDS = ['START', 'SOUND', 'PAD', 'ABOUT', 'RULES', 'EXIT'];

        this.btn = {};
        for( let i = 0 ; i < labels.length; i++)
        {
            let Y = starting_point + increment * i;
            let label = (IDS[i] === 'START') ? '> START <' : labels[i];
            this.btn[IDS[i]] = this.add.bitmapText(CENTER_X, Y,  IMG.FONT, label, 40, 1);
            this.btn[IDS[i]].setOrigin(0.5, 0.5);
            this.btn[IDS[i]].setInteractive();
            this.btn[IDS[i]].on('pointerdown', () =>
            {
                this.parse_action(IDS[i], this.btn[IDS[i]]);
            });
        }
        this.prev_obj = this.btn.START;
        // read save data
        const audio = localStorage.getItem('audio');
        if(audio === 'off') this.btn.SOUND.text = 'AUDIO OFF';
        const pad_dir = localStorage.getItem('pad');
        if(pad_dir === 'R') this.btn.PAD.text = 'PAD RIGHT';
    }

    parse_action(action, btn)
    {
        let call_back = () =>
        {
            let text = btn.text.replace('>', '').replace('<', '').trim();
            switch (action)
            {
                case 'START':
                    this.scene.pause();
                    this.scene.start('game-scene');
                    break;
                case 'ABOUT':
                    this.scene.pause();
                    this.scene.start('about-scene');
                    break;
                case 'RULES':
                    this.scene.pause();
                    this.scene.start('intro-scene');
                    break;
                case 'PAD':
                    if(text === 'PAD LEFT')
                    {
                        localStorage.setItem('pad', 'R');
                        btn.text = '> PAD RIGHT <';
                    }
                    else
                    {
                        localStorage.setItem('pad', 'L');
                        btn.text = '> PAD LEFT <';
                    }
                    break;
                case 'SOUND':
                    //let text = this.btn.SOUND.text.replace('>', '').replace('<', '').trim();
                    if(text === 'AUDIO ON')
                    {
                        btn.text = '> AUDIO OFF <';
                        localStorage.setItem('audio', 'off');
                        this.events.emit('snd.off');
                    }
                    else
                    {
                        btn.text = '> AUDIO ON <';
                        localStorage.setItem('audio', 'on');
                        this.events.emit('snd.on');
                    }                    
                    break;
                case 'EXIT':
                    window.close();
                    try
                    {
                        exitApp();
                    }
                    catch (error)
                    {
                        console.error(error);
                    }
                    break;
            }
        }
        if(this.prev_obj !== null && this.prev_obj.text)
        {
            this.prev_obj.text = this.prev_obj.text.replace('>', '').replace('<', '').trim();
        }
        btn.text = '> ' + btn.text +  ' <';
        this.prev_obj = btn;
        this.add.tween(
        {
            targets: [btn],
            alpha: { from: 0, to: 1 },
            duration: 1000,
            delay: 0,
            onComplete: () =>
            {
                call_back();
            }
        });
    }
}
