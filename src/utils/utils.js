import { INITIL_SCORES } from '../cfg/cfg';
import { PID, APP_NAME, SLOT } from '../cfg/cfg';
import { WIDTH, HEIGHT, CENTER_X, CENTER_Y, PLAYER } from '../cfg/cfg';
import { IMG, LVL, spawn_point } from '../cfg/assets';

window.is_exiting = false;

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

module.get_pad_position = () =>
{
    const tmp = localStorage.getItem('pad');
    // first time
    if(tmp === null)
    {
        localStorage.setItem('pad', 'L');
        return 'L'
    }
    return tmp;
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
            case 'q':
            case 'SoftLeft':
                if(window.is_exiting)
                {
                    window.is_exiting = false;
                    module.remove_exit_message();
                    return;
                    //scene.resume();
                }
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
            case 'e':
            case 'SoftRight':
                if(window.is_exiting)
                {
                    window.is_exiting = false;
                    module.remove_exit_message();
                    return;
                }
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
            case "w":
            case 'Backspace':
                e.preventDefault();
                console.log("is exi " + window.is_exiting);
                if(!window.is_exiting)
                {
                    //scene.scene.pause();
                    window.is_exiting = true;
                    module.put_exit_message(scene);
                }
                else
                {
                    window.close();
                }
        }
    });
    return [l,r];
};

module.make_simple_title = (scene, str) =>
{
    scene.add.image(CENTER_X, CENTER_Y, IMG.SKY);
    scene.add.image(CENTER_X, 50, IMG.STAR);
    let tmp = scene.add.bitmapText(CENTER_X, 100, IMG.FONT, str.toUpperCase(), 40).setOrigin(0.5, 0.5);
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
    return module.rand([LVL.A, LVL.B, LVL.C, LVL.D, LVL.E]);
};

module.get_random_tile_set = () =>
{
    return module.rand([IMG.TILES_A, IMG.TILES_B, IMG.TILES_C]);
};

module.get_random_coin_position = (dir=null) =>
{
    const pad_pos = module.get_pad_position();
    let l_array = [spawn_point[0], spawn_point[2], spawn_point[4], spawn_point[6]];
    let r_array =[spawn_point[1], spawn_point[3], spawn_point[5], spawn_point[7]];
    if( dir === null )
    {
        return module.rand(spawn_point);
    }
    if( dir === 'L' )
    {
        // remove pad pos coin spawn
        if(pad_pos === 'L') l_array[3] = l_array[0]
        return module.rand(l_array);
    }
    if( dir === 'R' )
    {
        // remove pad pos coin spawn
        if(pad_pos === 'R') r_array[3] = r_array[0]
        return module.rand(r_array);
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
    setTimeout(cb, 2000);
};

module.put_exit_message = (scene) =>
{
    window.r = scene.add.rectangle(CENTER_X, CENTER_Y, WIDTH, 50, 0x000000);
    window.b1 = scene.add.bitmapText(CENTER_X, CENTER_Y -15, IMG.FONT, 'PRESS AGAIN TO EXIT', 20, 1).setOrigin(0.5, 0.5);
    window.b2 = scene.add.bitmapText(CENTER_X, CENTER_Y +15, IMG.FONT, 'or LEFT or RIGHT to CANCEL', 20, 1).setOrigin(0.5, 0.5);
};

module.remove_exit_message = (scene) =>
{
    if(window.r && window.r.destroy) window.r.destroy();
    if(window.b1 && window.b1.destroy) window.b1.destroy();
    if(window.b2 && window.b2.destroy) window.b2.destroy();
};

module.exit_to_home_btn = (scene) =>
{
    
    const btn = scene.add.bitmapText(CENTER_X, CENTER_Y + 160,  IMG.FONT, 'MAIN MENU', 40, 1);
    btn.setOrigin(0.5, 0.5);
    btn.setInteractive();
    btn.on('pointerdown', () =>
    {
        scene.add.tween(
        {
            targets: [btn],
            alpha: { from: 0, to: 1 },
            duration: 1000,
            delay: 0,
            onComplete: () =>
            {
                scene.scene.pause();
                scene.scene.start('start-scene');
            }
        });
    });
};

module.do_screen_shot = (scene) =>
{
    function exportCanvasAsPNG(id, fileName, dataUrl)
    {
        var canvasElement = document.getElementById(id);
        var MIME_TYPE = "image/png";
        var imgURL = dataUrl;
        var dlLink = document.createElement('a');
        dlLink.download = fileName;
        dlLink.href = imgURL;
        dlLink.dataset.downloadurl = [MIME_TYPE, dlLink.download, dlLink.href].join(':');
        document.body.appendChild(dlLink);
        dlLink.click();
        document.body.removeChild(dlLink);
    }
    scene.game.renderer.snapshot((image) => exportCanvasAsPNG('show','shot.png', image.src));
};

export default module;