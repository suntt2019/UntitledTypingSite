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
	.haveClass(red)--->returen true/false

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
$('button').on('dblclick',function(){
	$('button').hide();
	$('button').fadeIn(1000);
})
var cnt=0;
var timer=setInterval(function(){$('input').focus()},200);
$('input').on('keypress',function(e){
	cnt++;
	console.log(e.which);
})