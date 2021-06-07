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
        const msg1 = 'This little game is an adaptation';
        const msg2 = 'of the official website tutorial'
        const msg3 = 'for KaiOS devices';
        // ui
        Utils.make_simple_title(this, 'instructions');
        Utils.make_scene_text(this, [msg1, msg2, msg3]);

        // keybind
        this.rightButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

        Utils.make_bottom_bar(this,
        {
            right_text: 'Menu',
            right_scene: 'start-scene',
            bottom_bar: true
        });
    }

    update()
    {
        if (this.rightButton.isDown)
        {
            this.scene.start('start-scene');
        }
    }
}