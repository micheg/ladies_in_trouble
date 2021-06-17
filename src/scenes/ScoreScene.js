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
        this.add.image(CENTER_X, CENTER_Y, IMG.SKY);
        this.add.rectangle(CENTER_X, 18, WIDTH, 36, 0x000000, 1);
    }

    create()
    {
        this.create_background();
        Utils.exit_to_home_btn(this);
        this.create_scores_ui();
    }

    create_scores_ui()
    {
        this.add.bitmapText(CENTER_X, 20, IMG.FONT, 'Top Ten Scores', 30, 1).setOrigin(0.5, 0.5);
        let scores = Utils.scores_load();
        scores = scores.reverse();
        const start_point = HEIGHT - 130;
        for(let i=0; i<scores.length; i++)
        {
            this.add.bitmapText(CENTER_X, start_point - 25 *(i), IMG.FONT, scores[i].toString(), 25, 1).setOrigin(0.5, 0.5);
        }
    }
}