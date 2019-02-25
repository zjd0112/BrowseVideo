// ==UserScript==
// @name         ClassHelper
// @namespace    https://zjd0112.github.io
// @version      0.1
// @description  browse online class automatically
// @author       zjd0112
// @match        http://hz.5u5u5u5u.com/*
// @grant        none
// ==/UserScript==

'use strict';
// Your code here...
const NotificationInstance = Notification || window.Notification;
const url_chaojiying = 'http://upload.chaojiying.net/Upload/Processing.php';
const userName = 'xxxxxx';
const passWord = 'xxxxxx';
const softId = 'xxxxxx';
const codeType = '9104';
const len_min = '0';

// 获取显示桌面通知的权限
function getPermission() {
    if (!!NotificationInstance) {
        const permissionNow = NotificationInstance.permission;
        if (permissionNow === 'granted') {//允许通知
            console.log('权限已获取');
        } else if (permissionNow === 'denied') {
            console.log('用户拒绝了你!!!');
        } else {
            NotificationInstance.requestPermission(function (PERMISSION) {
                if (PERMISSION === 'granted') {
                    console.log('获取权限成功');
                } else {
                    console.log('用户无情残忍的拒绝了你!!!');
                }
            });
        }
    }
}

// 创建通知并显示
function CreatNotification() {
    const noti = new NotificationInstance('XX网站消息通知', {
        body: '快来填写验证码！',
        tag: 'zjd0112',
        icon: '',
        data: {
            url: 'https://zjd0112.github.io'
        }
    });
    noti.onshow = function () {
        console.log('通知显示了！');
    }
    noti.onclick = function (e) {
        //可以直接通过实例的方式获取data内自定义的数据
        //也可以通过访问回调参数e来获取data的数据
        window.open(noti.data.url, '_blank');
        noti.close();
    }
    noti.onerror = function (err) {
        console.log('出错了，小伙子再检查一下吧');
        throw err;
    }
    setTimeout(() => {
        noti.close();
    }, 10000);
}

// 检测页面有没有验证码弹出
function checkIdentifyCode() {
    var identifyCode = $("div.pop_top_bg.5u");
    if (identifyCode.length > 0) {
        clearInterval(timer_checkICode);
        console.log('验证码弹出');
        CreatNotification();    // 弹出桌面通知
        getIdentifyCodeRes();
    }
}

// 图片转换为Base64
function convertImgToBase64(url_img, callback, outputFormat) {
    var canvas = document.createElement('CANVAS');
    var ctx = canvas.getContext('2d');
    var img = new Image;

    img.crossOrigin = 'Anonymous';
    img.onload = function() {
        canvas.height = img.height;
        canvas.width = img.width;
        ctx.drawImage(img,0,0);
        var dataURL = canvas.toDataURL(outputFormat || 'image/png');
        callback.call(this, dataURL);
        canvas = null;
    }
    img.src = url_img;
}

// 获取验证码图片并上传,得到图片识别结果
function getIdentifyCodeRes() {
    var url_img = document.getElementById('validateImg').src;

    convertImgToBase64(url_img, function(base64Img){
        //转化后的base64
        console.log('convertImage');
        base64Img = base64Img.replace('data:image/png;base64,','');
        console.log(base64Img);
        // 上传
        $.post(url_chaojiying, {'user':userName, 'pass':passWord, 'softid':softId, 'codetype':codeType, 'len_min':len_min, 'file_base64':base64Img}, function(result,status){

            console.log(result);
            console.log(status);
            simulateClick(result);
            
            },"json");
    });
}

var CPos = {};
(function($){
    $.$getAbsPos = function(p){
        var _x = 0;
        var _y = 0;
        while(p.offsetParent){
            _x += p.offsetLeft;
            _y += p.offsetTop;
            p = p.offsetParent;
        }
        
        _x += p.offsetLeft;
        _y += p.offsetTop;

        return {x:_x,y:_y};
    };

    $.$getMousePos = function(clientX, clientY){
        var _x,_y;
        
        if(clientX || clientY){
            _x = clientX - document.body.scrollLeft + document.body.offsetLeft;
            _y = clientY - document.body.scrollTop + document.body.clientTop;
        }
        return {x:_x,y:_y};
    }
})(CPos);

// 根据图片识别结果,执行自动点击操作
function simulateClick(result) {
    var parseResult = result; 
    var pic_str;
    var pic_array;

    console.log('begin simulateClick');
    console.log('length: %d', $("#validateImg").length);
    console.log('err_no: %d', parseResult.err_no);
    console.log(parseResult.pic_str);

    if(parseResult.hasOwnProperty("err_no") && parseResult.err_no == 0) {
        pic_str = parseResult.pic_str;
        pic_array = pic_str.split("|");

        // 创建event,模拟鼠标点击
        var ev = document.createEvent('HTMLEvents'); 
        for (var count = 0; count < pic_array.length; count++)
        {
            console.log('begine loop: %d', count);

            var position_array = pic_array[count].split(",");
            var clientX = parseInt(position_array[0]);
            var clientY = parseInt(position_array[1]);
            var clickPos = CPos.$getMousePos(clientX, clientY);
            var absPos = CPos.$getAbsPos(document.getElementById('validateImg'));

            ev.clientX = clickPos.x + absPos.x;
            ev.clientY = clickPos.y + absPos.y;

            ev.initEvent('click', false, true); 
            document.getElementById('validateImg').dispatchEvent(ev);

            // $("#xubox_iframe1")[0].contentWindow.$("#validateImg").dispatchEvent(ev);   
        }
        // $("#xubox_iframe1")[0].contentWindow.$("#validateImg").click()
        // $("#xubox_iframe4")[0].contentWindow.document.getElementById('validateImg').offsetParent

        // 点击确定按钮
        $("div.queding_btn.fl.5u").click();
    }
    else {
        console.log("Parse Error");
    }
}

// 模拟按键,防止弹出"长时间未操作"
jQuery.fn.simulateKeyPress = function(character) {
    // 内部调用jQuery.event.trigger
    // 参数有 (Event, data, elem). 最后一个参数是非常重要的的！
    jQuery(this).trigger({ type: 'keypress', which: character.charCodeAt(0) });
};

//模拟键盘+鼠标
function simulateKey() {
    // 模拟按键了 x
    $('body').simulateKeyPress('x');
    $("body").mousedown();
    $("body").mouseup();
    $("body").mousedown();
    $("body").mouseup();
    $("body").mousemove();

    console.log('simulateKeyPress');

    if ($("span.xubox_botton").length > 0) {
        $("a.xubox_yes.xubox_botton2").click();
    }
}

var timer_checkICode;
var timer_pressKey;
window.onload = function() {
    // 获取弹出桌面通知权限
    getPermission();
    // 检查是否有验证码弹出
    timer_checkICode = setTimeout(checkIdentifyCode, 10000);
    // 周期模拟按键,防止因长时间未操作,终止计时
    timer_pressKey = setInterval(simulateKey, 30000);
}
