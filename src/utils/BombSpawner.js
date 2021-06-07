import Phaser from 'phaser'
import { IMG } from '../cfg/assets';
import { WIDTH } from '../cfg/cfg';

export default class BombSpawner
{
    constructor(scene, bombKey = IMG.BOMB)
    {
        this.scene = scene
        this.key = bombKey
        this._group = this.scene.physics.add.group()
    }

    get group()
    {
        return this._group;
    }

    spawn(playerX = 0)
    {
        const MIDDLE = WIDTH / 2;
        const x = (playerX < MIDDLE) ? Phaser.Math.Between(MIDDLE, WIDTH) : Phaser.Math.Between(0, MIDDLE);

        const bomb = this.group.create(x, -10, this.key);
        // this is a circular body and this is the radius
        bomb.setCircle(5);
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-100, 100), 20);
    
        return bomb;
    }
}