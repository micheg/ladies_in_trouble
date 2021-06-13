import { INITIL_SCORES } from '../cfg/cfg';
import { PID, APP_NAME, SLOT } from '../cfg/cfg';
import { WIDTH, HEIGHT, CENTER_X, CENTER_Y, PLAYER } from '../cfg/cfg';
import { IMG, LVL, spawn_point } from '../cfg/assets';

let module = {};
module.rand = (items) =>
{
    return items[~~(items.length * Math.random())];
};

module.is_string = (value)  =>
{
	return typeof value === 'string' || value instanceof String;
};

module.is_function = (functionToCheck) =>
{
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
};

module.scores_load = () =>
{
    let scores = localStorage.getItem('scores');
    if(scores === null)
    {
        scores = JSON.parse(JSON.stringify(INITIL_SCORES));
    }
    else
    {
        scores = JSON.parse(scores);
    }
    scores = scores.sort((a,b) =>  b-a);
    return scores;
};

module.scores_save = (data) =>
{
    localStorage.setItem('scores', JSON.stringify(data));
};

module.audio_is_on = () =>
{
    const audio = localStorage.getItem('audio');
    // first time
    if(audio === null)
    {
        localStorage.setItem('audio', 'on');
        return true;
    }
    return (audio === 'on');
};

module.make_bottom_hud = (scene, left=null, right=null) =>
{
    // bottom black rectangle 16*width
    let l=null, r=null;
    scene.add.rectangle(CENTER_X, HEIGHT - 12, WIDTH, 24, 0x000000, 1);
    if( left !== null && module.is_string(left) )
    {
        l = scene.add.bitmapText(8, HEIGHT - 18, IMG.FONT, left, 20);
    }
    if( right !== null && module.is_string(right) )
    {
        window.$R = right
        const len = right.length * 10;
        r = scene.add.bitmapText(WIDTH - len, HEIGHT - 18, IMG.FONT, right, 20);
    }
    return [l,r];
};

module.make_bottom_bar = (scene, obj_conf) =>
{
    const left = ('left_text' in obj_conf) ? obj_conf.left_text : null;
    const right = ('right_text' in obj_conf) ? obj_conf.right_text : null;
    const bar = ('bottom_bar' in obj_conf) ? obj_conf.bottom_bar : null;
    let l=null, r=null;
    if(obj_conf.invisible && obj_conf.invisible === true)
    {
        
    }
    else
    {
        [l,r] = module.make_bottom_hud(scene, left, right);
    }

    if(bar !== null && bar)
    {
        scene.add.rectangle(CENTER_X, HEIGHT - 23, WIDTH, 2, 0xffffff);
    }
    scene.input.keyboard.on( 'keydown', (e) =>
    {
        switch (e.key)
        {
            case 'SoftLeft':
                if( 'left_scene' in obj_conf )
                {
                    if( module.is_function(obj_conf.before_switch) )
                    {
                        obj_conf.before_switch();
                    }
                    scene.scene.pause();
                    scene.scene.start(obj_conf.left_scene);
                }
                break;
            case 'SoftRight':
                if( 'right_scene' in obj_conf )
                {
                    if( module.is_function(obj_conf.before_switch) )
                    {
                        obj_conf.before_switch();
                    }
                    scene.scene.pause();
                    scene.scene.start(obj_conf.right_scene);
                }
                break;
        }
    });
    return [l,r];
};

module.make_simple_title = (scene, str) =>
{
    scene.add.image(CENTER_X, CENTER_Y, IMG.SKY);
    scene.add.image(CENTER_X, 50, IMG.STAR);
    let tmp = scene.add.bitmapText(CENTER_X, 100, IMG.FONT, str.toUpperCase(), 40).setOrigin(0.5, 0.5);

    scene.add.tween(
    {
        targets: [tmp],
        ease: (k) => (k < 0.5 ? 0 : 1),
        duration: 250,
        yoyo: true,
        repeat: -1,
        alpha: 0
    });
};

module.make_scene_text = (scene, arr_of_str) =>
{
    arr_of_str.forEach((txt, idx) =>
    {
        scene.add.bitmapText(CENTER_X, CENTER_Y + 20*idx, IMG.FONT, txt, 20)
            .setOrigin(0.5, 0.5);
    });
};

module.get_random_lvl = () =>
{
    const _r = module.rand([LVL.A, LVL.B, LVL.D, LVL.E, LVL.F]);
    //return _r;
    return LVL.Z;
};

module.get_random_tile_set = () =>
{
    return module.rand([IMG.TILES_A, IMG.TILES_B, IMG.TILES_C]);
};

module.get_random_coin_position = (dir=null) =>
{
    if( dir === null )
    {
        return module.rand(spawn_point);
    }
    if( dir === 'L' )
    {
        return module.rand([spawn_point[0], spawn_point[2]]);
    }
    if( dir === 'R' )
    {
        return module.rand([spawn_point[1], spawn_point[3]]);
    }
};

module.get_random_bee = () =>
{
    return module.rand([IMG.BEE_A, IMG.BEE_B]);
};

module.get_random_player = () =>
{
    return module.rand([IMG.PLAYER_A, IMG.PLAYER_B]);
};

module.get_ads = (cb) =>
{
    getKaiAd(
    {
        publisher: PID,
        app: APP_NAME,
        slot: SLOT,
        test: window.build.test_mode,
        onerror: err => console.error('Custom catch:', err),
        onready: ad =>
        {
            ad.call('display');
            ad.on('close', cb)
        }
    });
};

export default module;