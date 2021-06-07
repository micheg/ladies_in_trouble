import Phaser from 'phaser'
import GenericLabel from '../ui/GenericLabel';

export default class HUDScene extends Phaser.Scene
{
    constructor ()
    {
        super({ key: 'hud-scene', active: false });
        this.label_score = undefined;
        this.label_level = undefined;
    }

    create ()
    {
        [this.label_score, this.label_level] = this.create_labels(0, 1);
        const our_game = this.scene.get('game-scene');

        our_game.events.off('add.score');
        our_game.events.on('add.score', () =>
        {
            this.label_score.add(10);
        }, this);

        our_game.events.off('add.level');
        our_game.events.on('add.level', () =>
        {
            this.label_level.add(1);
        }, this);
    }

    get_level()
    {
        return this.label_level.get();
    }

    get_score()
    {
        return this.label_score.get();
    }

    create_labels (initial_value, initial_level)
    {
        const formatScore = (score) => `S C O R E :  ${score.toString().split('').join(' ')}`;
        const score_label = new GenericLabel(this, 5, 0, initial_value, formatScore);
        this.add.existing(score_label);

        const format_level = (level) => `L E V E L :  ${level.toString().split('').join(' ')}`;
        const level_label = new GenericLabel(this, 180, 0, initial_level, format_level);
        this.add.existing(level_label);

        return [score_label, level_label];
    }
};