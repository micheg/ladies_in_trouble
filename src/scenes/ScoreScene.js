import { WIDTH, HEIGHT, CENTER_X, CENTER_Y } from '../cfg/cfg';
import { IMG } from '../cfg/assets';
import Utils from '../utils/utils';
import Phaser from 'phaser'

export default class ScoreScene extends Phaser.Scene
{
    constructor()
    {
        super('score-scene');
    }

    create_background()
    {
        this.add.image(CENTER_X, CENTER_Y, IMG.SCORE_BG);
    }

    create()
    {
        this.create_background();
        // keybind
        this.leftButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);

        Utils.make_bottom_bar(this,
        {
            left_text: 'Menu',
            left_scene: 'start-scene',
            bottom_bar: true
        });
        this.create_scores_ui();
    }

    uodate_keybind()
    {
        if (this.leftButton.isDown)
        {
            this.scene.pause();
            this.scene.start('start-scene');
        }
    }

    update()
    {
        this.uodate_keybind();
    }

    create_scores_ui()
    {
        this.add.bitmapText(CENTER_X, 30, IMG.FONT, 'Top Ten Scores', 30, 1).setOrigin(0.5, 0.5);
        let scores = Utils.scores_load();
        scores = scores.reverse();
        const start_point = HEIGHT - 70;
        for(let i=0; i<scores.length; i++)
        {
            this.add.bitmapText(CENTER_X, start_point - 20 *(i), IMG.FONT, scores[i].toString(), 20, 1).setOrigin(0.5, 0.5);
        }
    }
}