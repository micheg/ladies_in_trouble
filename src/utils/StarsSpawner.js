import Phaser from 'phaser'
import { IMG } from '../cfg/assets';

export default class StarsSpawner
{
    constructor(scene, star_key = IMG.RED_STAR)
    {
        this.scene = scene;
        this.key = star_key;
        this._group = null;
    }

    get group()
    {
        return this._group !== null ? this._group : {};
    }

    get are_zero()
    {
        return this._group.countActive(true) === 0;
    }

    spawn()
    {
        if(this._group === null)
        {
            const stars = this.scene.physics.add.group(
            {
                key: IMG.RED_STAR,
                repeat: 7,
                setXY: { x: 12, y: 0, stepX: 30 }
            });
                
            stars.children.iterate((child) =>
            {
                child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
            });

            this._group = stars;
        }
        if(this.are_zero)
        {
            console.log("respawn");
            this._group.children.iterate((child) =>
            {
                child.enableBody(true, child.x, 0, true, true)
            });
        }
    }
};