import Phaser from 'phaser'
import Utils from '../utils/utils';

export default class AboutScene extends Phaser.Scene
{
    constructor()
    {
        super('about-scene')
    }

    create()
    {
        // msg 
        const msg1 = 'This is super casual game';
        const msg2 = 'GFX from: Master484'
        const msg3 = 'SND from: Pascal Belisle';
        // ui
        Utils.make_simple_title(this, 'About');
        Utils.make_scene_text(this, [msg1, msg2, msg3]);

        Utils.make_bottom_bar(this,
        {
            right_text: 'Menu',
            right_scene: 'start-scene',
            bottom_bar: true
        });
    }
}