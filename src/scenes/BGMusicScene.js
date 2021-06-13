import { SND } from '../cfg/assets';
import Phaser from 'phaser'
import Utils from '../utils/utils';

export default class BGMusic extends Phaser.Scene
{
    constructor ()
    {
        super({ key: 'bgm-scene', active: false });
    }

    create ()
    {
        const our_game = this.scene.get('start-scene');
        let cfg = 
        {
            mute: false,
            volume: 0.8,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
        };

        our_game.events.off('snd.off');
        our_game.events.on('snd.off', () =>
        {
            this.audio_is_on = false;
            this.music.stop();
        }, this);

        our_game.events.off('snd.on');
        our_game.events.on('snd.on', () =>
        {
            this.audio_is_on = true;
            this.music.play(cfg);
        }, this);

        this.audio_is_on = Utils.audio_is_on();
        this.music = this.sound.add(SND.MUSIC);

        if(this.audio_is_on) this.music.play(cfg);
    }
};