# BrowseVideo
A script that can help you to browse video automatically.

## Intro
This script is aimed at the theoretical study of the Hangzhou driver's license course. The video website is <http://hz.5u5u5u5u.com/home.action>.

#### Function
* Identify Verification code automatically.
* Simulate mouse and keyboard operations.

## Use
The script was only tested on the Firefox browser.
1. Install Tampermonkey on your Firefox browser.
2. I use [Chaojiying platform](http://www.chaojiying.com/) to identify Verification Code. So, you have to register an account on <http://www.chaojiying.com/>. Besides, fill in your account information in the code.(You have to recharge on the platform, ¥1 is enough)
    ``````
    const userName = 'xxxxxx';
    const passWord = 'xxxxxx';
    const softId = 'xxxxxx';
    ``````
3. Use Tampermonkey to run "browseVideo.js"
4. Open [Video website](http://hz.5u5u5u5u.com/home.action), click on the video and play it. Then you can do other things, the script will help you browse video automatically. 

## Todo
* Handling Verification Code recognition failure.
* Automatic log-in.
* Play the next video automatically.