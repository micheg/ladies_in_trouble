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
        const msg1 = 'Use virtual PAD';
        const msg2 = 'to move the player, get the'
        const msg3 = 'coins and avoid the enemies';
        // ui
        Utils.make_simple_title(this, 'instructions');
        Utils.make_scene_text(this, [msg1, msg2, msg3]);

        Utils.exit_to_home_btn(this);
    }
}