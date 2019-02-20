var time = '5' - 0;//次数
var castTime = '1' - 0;
/*-- 验证类型  1:签到 2:验证 3:签退 --*/
var validateType = '1' - 0;
var countFlag = true;
var perCast;

//后台验证
function InpectvalidateCode(result){
	$.ajax({
		url:"/learning_json/inpectvalidateCode.action", //url需重定义
		type : "post",
		data : "result="+result,
		async:false,
		type:'post',
		success:function(json){
	    	if(json.msg !="success"){
       			nextInpect();
			}else{
				countFlag=false;
				parent.validate(1,validateType,null, json.code);
				try {
					window.parent.closeCur();
				}catch(e) {
				}
			}
		}
	});
}

//获取点击位置
function getSelPic() {
	var ret = "";
	$(".sel").each(function(){
		ret += $(this).attr("data") + "_";
	})
	return ret;
}

$(function(){
	castTime = castTime*60;
	$(".queding_btn").click(function(){
		countFlag = false;
		var result = getSelPic();
		InpectvalidateCode(result);
	});
	$(".quxiao_btn").click(function(){
		closeFun();
	});
	$(".close_btn").click(function(){
		closeFun();
	});
	
	//首次生成题目
	perCast = castTime;
	randomQuestion();
	countFlag=true;
	startTime();
	
	$(".tt").dblclick(function(){//删广告
		$('body').children().each(function(){
			if(!$(this).attr('class') || $(this).attr('class').indexOf('5u') == -1) {
				console.log($(this).attr('class'));
				$(this).hide();
			}
		})
	});
	
	showTips();
});

function closeFun(){
	var current_i = $.layer({
		closeBtn : false,
	    shade : [0.5 , '#000' , true],
	    area : ['410px','160px'],
	    border : [8, 1, '#b8c9f5', true],
	    offset : ['10px','5px'],
	    move : false,
	    dialog : {
	        msg:'是否强制退出，若退出，将无法记录您的学时！',
	        btns : 2, 
	        type : 4,
	        btn : ['确定','取消'],
	        yes : function(){
	        	//取消验证
				parent.validate(0,validateType);
	        	layer.close(current_i);
	        	window.parent.closeCur();
	        },
	        no : function(){
	            layer.close(current_i);
	        }
	    }
	});	
}

//提示语修改
function showTips(){
	if(validateType == 1) {
		$(".xxym").html("<span class='color1 5u'>温馨提示：</span>只有通过验证，系统才开始记录您的学时哦！");
	}else if(validateType == 2) {
		$(".xxym").html("<span class='color1 5u'>温馨提示：</span>只有通过验证，系统才能继续记录您的学时哦！");
	}
}

/**
 * 随机生成题目
 */
function randomQuestion(){
	$("#validateImg").attr("src", "/imageServlet?" + Math.random());
	$(".sel").remove();
	titleCountdown();
}

function titleCountdown() {
	var title_content = '';
	if (validateType == 1) {
		title_content = '签到验证';
	} else if (validateType == 2) {
		title_content = "随机验证";
	} else if (validateType == 3) {
		title_content = "签退验证";
	}
	$(".tt").html(title_content + "(剩余" + perCast + " 秒," + time + "次机会)");
}

	
function startTime() {
	titleCountdown();
	if (!countFlag){
		return;
	}
	if (perCast < 1) {
		var cur_i = $.layer({
			area : [ '410px', 'auto' ],
			shade : [ 0.5, '#000', true ],
			border : [ 8, 1, '#b8c9f5', true ],
			offset : [ '10px', '5px' ],
			dialog : {
				msg : '您已超过验证时间，将退出学习。',
				type : 8,
				btns : 1,
				btn : [ '确定' ],
				yes : function(index) {
					parent.validate(0, validateType);
					layer.close(cur_i);
					window.parent.closeDialog();
				}
			},
			close : function(index) {
				layer.close(cur_i);
				window.parent.closeDialog();
				window.parent.toLessonList();
			}
		});
		return;
	}
	perCast--;
	setTimeout("startTime()", 1000);
}

//再次验证
function nextInpect() {
	countFlag = false;
	time--;
	if (time <= 0) {
		// 		window.parent.closeCur();
		parent.validate(-1, validateType);
		return;
	}
	perCast = castTime;
	randomQuestion();
	countFlag = true;
}
	
	
	
	
	
	
	
var JPos = {};  
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
      
    $.$getMousePos = function(evt){  
        var _x,_y;  
        evt = window.event||evt;
        if(evt.pageX || evt.pageY){  
            _x = evt.pageX;  
            _y = evt.pageY;  
        }else if(evt.clientX || evt.clientY){  
            _x = evt.clientX + document.body.scrollLeft - document.body.clientLeft;  
            _y = evt.clientY + document.body.scrollTop - document.body.clientTop;  
        }else{  
            return $.$getAbsPos(evt.target);      
        }  
        return {x:_x,y:_y};  
    }  
})(JPos);  
	  
function vControl(pChoice, dom, e){  
    switch(pChoice){  
        case "GETMOUSEPOSINPIC":  
            var mPos = JPos.$getMousePos(e);  
            var iPos = JPos.$getAbsPos(arguments[1]);  
            window.status = (mPos.x - iPos.x) + " " + (mPos.y - iPos.y);  
            setSel((mPos.x - iPos.x + 44), (mPos.y - iPos.y + 32))
            
            break;  
    }  
} 

function setSel(x,y) {
	var i = $(".sel").last().html();
	if(!i){
		i=1;
	}else {
		i=i-0+1;
	}
	var html = "<a class='5u sel' data='"+Math.round(x-44)+","+Math.round(y-32)+"' onclick='delThis(this)' style='position: absolute; left:"+x+"px; top:"+y+"px'>"+i+"</a>";
	$(".imgCon").append(html);perCast
}

function delThis(doc) {
	var i = $(doc).html() - 0;
	$(".sel").each(function(){
		if(i<=$(this).html()-0) {
			$(this).remove();
		}
	});
}
