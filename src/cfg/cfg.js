import Phaser from 'phaser'
import VirtualJoystickPlugin from 'phaser3-rex-plugins/plugins/virtualjoystick-plugin.js';

export const WIDTH = 240;
export const HEIGHT = 426;

// All configuration
export default
{
    type: Phaser.AUTO,
    width: WIDTH,
    height: HEIGHT,
    scale:
    {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics:
    {
        default: 'arcade',
        arcade:
        {
            gravity: { y: 320 },
            debug: false
        }
    },
    pixelArt: true,
    plugins:
    {
        global:
        [
            {
                key: 'rexVirtualJoystick',
                plugin: VirtualJoystickPlugin,
                start: true
            }
        ]
    }
};


export const CENTER_X = WIDTH / 2;
export const CENTER_Y = HEIGHT / 2;
export const PLAYER =
{
    SPEED:
    {
        x: 120,
        y: 260
    }
};
export const GAME = 
{
    LEVEL:
    {
        SCORE: 80
    }
};

export const INITIL_SCORES = [0,0,0,0,0,0,0,0,0,0];

export const APP_NAME = 'Ladies in a Box';
export const SLOT = 'com.michelangelog.kaios.ladies';
