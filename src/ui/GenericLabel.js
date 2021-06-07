import { IMG } from '../cfg/assets';
import Phaser from 'phaser'

export default class GenericLabel extends Phaser.GameObjects.BitmapText
{
    constructor(scene, x, y, value, format_function)
    {
        super(scene, x, y, IMG.FONT, format_function(value), 12, 1);
        this.format_function = format_function;
        this.value = value;
    }

    get()
    {
        return this.value;
    }

    set(value)
    {
        this.value  = value;
        this.update();
    }

    add(num)
    {
        this.set(this.value + num);
    }

    update()
    {
        this.setText(this.format_function(this.value));
    }
};