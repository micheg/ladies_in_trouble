import { WIDTH, HEIGHT } from '../cfg/cfg';
import { IMG, SND, LVL } from '../cfg/assets';
import Phaser from 'phaser'

export default class BootScene extends Phaser.Scene
{
    constructor()
    {
        super('boot-scene')
    }

    preload()
    {
        // progress bar
        let progressBar = this.add.graphics();
        let progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(20, 140, 200, 40);

        let loadingText = this.make.text(
        {
            x: WIDTH / 2,
            y: HEIGHT / 2 - 50,
            text: 'Loading...',
            style: {
                font: '20px monospace',
                fill: '#ffffff'
            }
        }).setOrigin(0.5, 0.5);

        let fileText = this.make.text(
        {
            x: WIDTH / 2,
            y: HEIGHT / 2 + 50,
            text: '',
            style: {
                font: '10px monospace',
                fill: '#ffffff'
            }
        }).setOrigin(0.5, 0.5);

        // load images and sprites
        this.load.image(IMG.SKY, 'img/sky.png');
        this.load.image(IMG.STAR, 'img/star.png');
        this.load.image(IMG.RED_STAR, 'img/red_star.png');
        this.load.image(IMG.BOMB, 'img/bomb.png');
        this.load.image(IMG.GROUND, 'img/platform.png');
        this.load.image(IMG.SCORE_BG, 'img/score_bg.png');
        this.load.image(IMG.LOGO, 'img/ladies_logo.png');
        this.load.image(IMG.TILES, 'img/tiles.png');
        this.load.image(IMG.TILES_A, 'img/tiles.png');
        this.load.image(IMG.TILES_B, 'img/tiles2.png');

        this.load.tilemapTiledJSON(LVL.A, 'lvl/level_a.json');
        this.load.tilemapTiledJSON(LVL.B, 'lvl/level_b.json');
        this.load.tilemapTiledJSON(LVL.D, 'lvl/level_d.json');
        this.load.tilemapTiledJSON(LVL.E, 'lvl/level_e.json');
        this.load.tilemapTiledJSON(LVL.F, 'lvl/level_f.json');

        this.load.spritesheet(IMG.MELISSA, 'img/melissa.png',
        {
            frameWidth: 24, frameHeight: 32
        });

        // load fonts
        this.load.bitmapFont('pixelFont', 'font/font.png', 'font/font.xml');

        // load music
        this.load.audio(SND.PICKUP, 'snd/pickup.ogg');
        this.load.audio(SND.OVER, 'snd/over.ogg');
        this.load.audio(SND.BEAM, 'snd/beam.ogg');
        this.load.audio(SND.MUSIC, 'snd/bg.ogg');

        this.load.on('progress', function (value)
        {
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(30, 150, 180 * value, 20);
        });
                    
        this.load.on('fileprogress', function (file)
        {
            fileText.text = file.src;
        });
         
        this.load.on('complete', function ()
        {
            loadingText.destroy();
            fileText.destroy();
            progressBox.destroy();
            progressBar.destroy();
        });
    }

    create()
    {
        this.scene.launch('bgm-scene');
        this.scene.start('start-scene');
    }

}