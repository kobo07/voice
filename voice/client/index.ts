import * as alt from 'alt-client';
import * as native from 'natives';




let currentChannel = '远距离25米';  // 当前频道，默认为 '远距离25米'
let voiceRange = 25;  // 默认语音范围，与服务端设置相同
let shouldDraw = false;  // 控制是否绘制 Marker 的标志
let isNKeyPressed = false;  // 是否按下了 'N' 键

let drawTimeout: number | null = null;  // 用于存储 setTimeout 的返回值

// 绘制语音范围的函数
function drawVoiceRange1() {
    const playerPos = alt.Player.local.pos;
    if (isNKeyPressed) {
        if (alt.Player.local.vehicle == null) {
            native.drawMarker(1, playerPos.x, playerPos.y, playerPos.z - 1.2, 0, 0, 0, 0, 0, 0, voiceRange * 2, voiceRange * 2, 0.5, 0, 0, 255, 100, false, false, 2, false, null, null, false);
        }
        if (alt.Player.local.vehicle != null) {
            native.drawMarker(1, playerPos.x, playerPos.y, playerPos.z - 1.2, 0, 0, 0, 0, 0, 0, voiceRange * 2, voiceRange * 2, 1.5, 0, 0, 255, 100, false, false, 2, false, null, null, false);
        }
    }
}

alt.on('keydown', (key) => {
    if (key === 78 && alt.Player.local.isTalking) {  // 'N' 键的键码是 78
        isNKeyPressed = true;
    }
});





alt.on('keyup', (key) => {
    if (key === 78) {  // 'N' 键的键码是 78
        isNKeyPressed = false;
    }
});

// 绘制语音范围的函数
function drawVoiceRange() {
    if (!shouldDraw) return;  // 如果标志为 false，不绘制

    const playerPos = alt.Player.local.pos;
    native.drawMarkerSphere(playerPos.x, playerPos.y, playerPos.z, voiceRange, 0, 0, 255, 0.1);  // 蓝色的2D圈
}



alt.on('keydown', (key) => {
    if (key === 113) {  // F2 键的键码是 113
        // 如果已经有一个定时器在运行，先清除它
        if (drawTimeout !== null) {
            alt.clearTimeout(drawTimeout);
        }

        shouldDraw = true;  // 设置标志为 true，开始绘制

        // 设置新的定时器，2秒后停止绘制
        drawTimeout = alt.setTimeout(() => {
            shouldDraw = false;  // 2秒后设置标志为 false，停止绘制
            drawTimeout = null;  // 重置定时器变量
        }, 2000);

        if (currentChannel === '远距离25米') {
            currentChannel = '中距离8米';
            voiceRange = 8;  // 更新语音范围
        } else if (currentChannel === '中距离8米') {
            currentChannel = '近距离3米';
            voiceRange = 3;  // 更新语音范围
        } else {
            currentChannel = '远距离25米';
            voiceRange = 25;  // 更新语音范围
        }

        // 通知服务端切换频道
        alt.emitServer('switchVoiceChannel', currentChannel);
    }
});

alt.everyTick(drawVoiceRange);
alt.everyTick(drawVoiceRange1);


