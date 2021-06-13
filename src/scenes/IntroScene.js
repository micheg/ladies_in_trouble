import Phaser from 'phaser'
import Utils from '../utils/utils';

export default class AboutScene extends Phaser.Scene
{
    constructor()
    {
        super('intro-scene')
    }

    create()
    {
        // msg 
        const msg1 = 'Use the cursor keys or 4/2/6/8';
        const msg2 = 'to move the player, get the'
        const msg3 = 'coins and avoid the enemies';
        // ui
        Utils.make_simple_title(this, 'instructions');
        Utils.make_scene_text(this, [msg1, msg2, msg3]);

        Utils.make_bottom_bar(this,
        {
            left_text: 'Menu',
            left_scene: 'start-scene',
            bottom_bar: true
        });
    }
}