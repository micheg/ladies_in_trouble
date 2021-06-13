import Phaser from 'phaser'
import { IMG } from '../cfg/assets';
import { WIDTH, HEIGHT, CENTER_X, CENTER_Y, PLAYER } from '../cfg/cfg';

export default class BeeSpawner
{
    constructor(scene, key = IMG.BEE_A)
    {
        this.scene = scene;
        this.key = key;
        this._group = this.scene.physics.add.group();

        this.scene.anims.create(
        {
            key: 'fly',
            frames: this.scene.anims.generateFrameNumbers(key, { start: 0, end: 1 }),
            frameRate: 10,
            repeat: -1
        });
    }

    get group()
    {
        return this._group;
    }

    spawn(playerX = 0)
    {
        const MIDDLE = WIDTH / 2;
        //const x = (playerX < MIDDLE) ? Phaser.Math.Between(MIDDLE, WIDTH) : Phaser.Math.Between(0, MIDDLE);

        const bee = this.group.create(120, -20, this.key);
        // this is a circular body and this is the radius
        bee.setCircle(12);
        bee.setBounce(1);
        bee.setCollideWorldBounds(true);
        const sign = Phaser.Math.Between(0,1) === 0 ? -1 : 1;
        bee.setVelocity(Phaser.Math.Between(15, 55)*sign, 30);
        if(sign===1)
        {
            bee.setFlipX(true);
        }
        bee.play('fly', true);
        
        return bee
    }
}