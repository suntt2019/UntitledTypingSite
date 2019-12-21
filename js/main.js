var timerCycle=10;//ms
var disableAnimation=false,animationTime=10,timeBetweenLines=false;//配置数据

var available=true,timems=0,timeTemp,firstChar=false;
var cnt=0,answerCnt=4,spaceCnt=0;//该行数据
var ac1Cnt=0,ac2Cnt=0,totalCnt=0,totalTime=0,totalWord=0;//累计数据
var ac1Rate,ac2Rate,totalSpeedWPM;//计算出的数据
var timer=setInterval(function(){timems+=timerCycle;},timerCycle);
var blurTimer=setInterval(function(){$('button').blur();},100);
var optionActiveTimer;

$(document).on('keypress',function(e){
	if(!available)
		return;
	if(cnt>=answerCnt){
		nextpage();
		if(e.which!=13&&e.which!=32)//enter/space
			console.log('Incorrectly press ['+String.fromCharCode(e.which)+'] for starting a new line');
			//TODO:增加一个按的不是回车或空格的提示
		return;
	}
	console.log('[input]'+e.which);
	if(!keyJudge(e.which))
		return;
	cnt++;
	if(!firstChar){
		timems=0;
		firstChar=true;
	}
	if(e.which==32){
		$('#input').append(
		'<div class="char space" id="ch'+cnt+'">␣</div>\n'
		);
	}else{
		$('#input').append(
		'<div class="char" id="ch'+cnt+'">'
		+String.fromCharCode(e.which)
		+'</div>\n'
		);
	}
	if($('#ch'+cnt).text()!=$('#ach'+cnt).text()){
		$('#ch'+cnt).addClass('wrong');
		$('#ach'+cnt).addClass('mistaken');
	}else if($('#ach'+cnt).hasClass('mistaken')){
		$('#ch'+cnt).addClass('mistaken');
		console.log('#ch'+cnt);
	}
});

$(document).on('keydown',function(e){
	if(e.which==8){
		$('#ch'+cnt).remove();
		if(cnt>0)
			cnt--;
	}
});

function nextpage(){
	available=false;
	var i=0;
	timeTemp=timems;
	var refresh=setInterval(function(){
		i++;
		totalCnt++;
		ac1Cnt++;
		ac2Cnt++;
		$('#ch'+i).text('-');
		$('#ch'+i).css({padding:'0px 0px'});
		$('#ach'+i).text('-');
		if($('#ch'+i).hasClass('wrong')){
			ac2Cnt--;
			ac2Rate=ac2Cnt/totalCnt;
			$('#ac21').text(Math.floor(ac2Rate*100));
			$('#ac22').text(Math.floor(ac2Rate*1000)%10);
		}
		if($('#ach'+i).hasClass('mistaken')){
			ac1Cnt--;
			ac1Rate=ac1Cnt/totalCnt;
			$('#ac11').text(Math.floor(ac1Rate*100));
			$('#ac12').text(Math.floor(ac1Rate*1000)%10);
		}
		if(i>=answerCnt){
			
			totalWord+=spaceCnt+1;
			totalTime+=timeTemp;
			totalSpeedWPM=totalWord/totalTime*60000;
			$('#sp01').text(Math.floor(totalSpeedWPM));
			$('#sp02').text(Math.floor((totalSpeedWPM*10)%10));
			if(!timeBetweenLines)
				firstChar=false;
			//TODO:换单位/换单次记速，绘制图表...
			view();
			
			newinfo();
			available=true;
			timems=0;
			clearInterval(refresh);
		}
	},animationTime);
	return;
}

var info='welcome to yoyoyo';

function newinfo(){
	cnt=0;
	$('#input').html('<div class="preText">Yo...</div>\n');
	//TODO: 从后端载入数据
	answerCnt=info.length;
	spaceCnt=0;
	$('#answer').html('<div class="preText">Yo...</div>\n');
	for(var i=1;i<=answerCnt;i++){
		if(info[i-1]==' '){
			$('#answer').append('<div id="ach'+i+'" class="answerChar space">␣</div>\n');
			spaceCnt++;
		}
		else
			$('#answer').append('<div id="ach'+i+'" class="answerChar">'+info[i-1]+'</div>\n');

	}
	//$('#answer').html('<div class="preText">Yo...</div>\n<div id="ach1" class="answerChar">a</div>\n<div id="ach2" class="answerChar">s</div>\n<div id="ach3" class="answerChar">d</div>\n<div id="ach4" class="answerChar">f</div>');
	return;
}


function view(){
	console.log('===============view===============');
	console.log('[Accuracy]');
	console.log('totalCnt',totalCnt,'ac1Cnt',ac1Cnt,'ac2Cnt',ac2Cnt);
	console.log('ac1Rate',ac1Rate,'ac2Rate',ac2Rate);
	console.log('[Speed]');
	console.log('totalWord',totalWord,'totalTime',totalTime);
	console.log('totalSpeedWPM',totalSpeedWPM);
	console.log('==================================');
	return;
}

function keyJudge(keynum) {
	if(32<=keynum&&keynum<=126)//A-Z,a-z,0-9,otherChar
		return true;
	return false;
}

$('.contentDetail').on('click',function(){
	$(this).parent().parent().find('.contentClass').removeClass('chosen');
	$(this).parent().parent().find('.contentTitle').removeClass('chosen');
	$(this).parent().parent().find('.contentDetail').removeClass('chosen');
	$(this).parent().addClass('chosen');
	$(this).parent().find('.contentTitle').addClass('chosen');
	$(this).addClass('chosen');
	optionActivefunction();
})

$('.contentTitle').on('click',function(){
	$(this).parent().parent().find('.contentClass').removeClass('chosen');
	$(this).parent().parent().find('.contentTitle').removeClass('chosen');
	$(this).parent().parent().find('.contentDetail').removeClass('chosen');
	$(this).parent().addClass('chosen');
	$(this).addClass('chosen');
	$(this).parent().find('.contentDetail.default').addClass('chosen');
	optionActivefunction();
})


$('.option').on('mousemove',function(){
	//optionActivefunction();
});


function optionActivefunction(){
	console.log('yo');
	clearTimeout(optionActiveTimer);
	optionActiveTimer=setTimeout(function(){
			clicked=false;
			$('.option').addClass('inactive');
		},3000);
	clicked=true;
	$('.option').removeClass('inactive');
}


/*
TODO:
换等宽字体
筛选指定字符

*/


//NOTE

/*
12.3数据类型
Number NaN Infinty
String '等效"  
boolean 
Array  [1,2,'a']
Object o={title:"xx",desc:"yy"} o.desc
*/
/*
12.4类型
var 筐 = 'Yo';//可用中文
筐 = 1;//可变类型
console.log(typeof 筐);
typeof []  ---> object
a.length ---> object/array
*/
/*
12.5-9
0/null/undefined/''/NaN ---> false

if-else ---> same as C
switch-case ---> same as C
+-* /  += ++ -- = == != && || ---> same as C
for/while ---> same as C

== ===严格等于
*/
/*
12.10 函数

log(2);
function log(a){
	console.log(a,a);
	return a;
}

(function(){
	//....
})()
//匿名函数,后面括号触发

var a; ---> var window.a;
*/
/*
12.11 闭包
function user(name){
	var age, sex;
	return {
		GetName: function(){
			return name;
		},
		SetName: function(NewName){
			name=NewName;
		}
	}
}

var  whh=user('whh');
*/
/*
12.12windows对象
alert('Yo.');
confirm('Yo?'); ---> return true/false
prompt('Y_.'); ---> return 用户填写内容
setTimeout(function(){},2000);//2000ms
var timer=setInterval(function(){},1000);//无限循环 
clearInterval(timer);
*/ 

/*
12.25-26this是个啥
this:指代执行函数的对象（父级对象）
直接执行->window/undefine(严格模式)
'use strict';//使用严格模式

构造器中...

赋能：
	function yo(a,b,c){
		console.log("yo,I\'m"+this.name);
	}
	var whh={name:'whh'};
	whh.yo=yo;

	yo.call(whh,a,b,c);
	//call中的第一个参数是指定的this
	
	yo.apply(whh,[a,b,c]);
	//apply中参数放在数组中
	
	yo2=yo.bond(whh);
	//bond只绑this，不执行

*/
/*
12.27-28 回调函数
把函数a作为一个参数传入另一个函数A
A可以执行a
*/


/*
DOM接口23.x

html<->js
浏览器内置接口
*/
/*
jQuery
	html->DOM-[jQuery]<-js
	简洁化DOM+使得各浏览器通用化

选择器
	$('#a').css('background','blue');
	//id选择器  css(属性,值)
	'#a'--->id
	'.b'--->class
	'div'--->标签
	'#a div p'--->组合
	'input[type="number"]'--->属性选择
	'div:first'--->第一个div

过滤器
	$(.grandpa).find(.child);//有大向小找
	$(#child1).parent();//找上一层 --->pa
	$(#child2).parents(.grandpa);//从小向大找
	$(.child).filter(.smart);//过滤(进一步筛选)

操作样式
	.css({color:'red',background:'black'});
	//有下划线的样式要用引号框住
	.addClass(red);
	.removeClass(red);
	.hasClass(red)--->returen true/false

	.hide();
	.show();
	.toggle();
	.fadeOut(500);//500ms
	.fadeIn(500);
	.slideUp(500);
	.slideDown(500);//上/下隐藏

操作DOM
	.text()--->返回标签内文本内容
	.html()--->返回标签内全部HTML内容
	.text('La')  .html('La')--->修改标签内全部内容
	.append('aaa') --->追加
	.prepend('aaa') --->在前面追加
	.remove()--->删除

事件
	cardTriger.on('click',function(){...})
	//click dblclick mouseenter mouseleave
	等价cardTriger.click(function(){...})
	card.is(':visible')
	查询https://developer.mozilla.org/zh-CN/docs/Web/Events

操作元素属性
	.attr('href','http://biaoyansu.com')
	.attr('href') --->return href
	//显性属性(HTML)，包含自定义属性
	.prop('href','http://biaoyansu.com')
	.prop('href') --->return href
	//隐性属性(DOM...)

	.removeAttr('asdf')

表单和输入
	.val()
	.val('yo')
	//input只能用val
	.focus()//聚焦
	.select()//聚焦+全选
	.blur()//不聚焦
	//参数传function->检测+触发

	.submit()

Ajax
	//需要http服务器
	.load('card.html')

	.on('submit',function(e){//参数为事件
		e.preventDefault();
	})

	ajax方法
	$.ajax('http://api.github.com/...')
	.done(function(data){
		...
	})

	//url放下面的对象里也可以
	$.ajax('url',{   
		method:'get',//get post...
		data:{...},//post时
		success:function(data){...}//get时
		error:function(){...}//error

	})

	快捷方式:get/post/getJson/getScript

*/

/*
$(document).keyup(function(event){
			 switch(event.keyCode) {
			 case 32:
			  alert('enter!!');
			  return;
			  case 13:
			  alert('space!!');
			  case 20:
			  alert('Cap');
			  return;
		
			 }
 
			});
*/