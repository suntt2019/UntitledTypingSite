var timerCycle=10;//ms
var animationTime=5,timeBetweenLines=false,inputBarMode='off';//配置数据
var cheatMode=false,spUnit='WPM-all';
var totalSpeedWPM=0,lineSpeedWPM=0,totalSpeedCPS=0,lineSpeedCPS=0,outPutSpeed=0;

var available=true,timems=0,timeTemp,firstChar=true;
var cnt=0,answerCnt=7,spaceCnt=0;//该行数据
var ac1Cnt=0,ac2Cnt=0,totalCnt=0,totalTime=0,totalWord=0;//累计数据
var ac1Rate,ac2Rate,totalSpeedWPM;//计算出的数据
var timer=setInterval(function(){timems+=timerCycle;},timerCycle);
var focusTimer=setInterval(function(){$('#inputBTN').focus();},100);//TODO:添加一个选择input的选项，以供虚拟键盘打字练习
var optionActiveTimer;


$(document).on('keypress',null,null,function(e){
	keyPressFunction(e.which);
});

function keyPressFunction(inputChar){
	console.log('[input]'+inputChar);
	//e.preventDefault();会影响按住时的连续输入
	if(!available)
		return;
	if(cheatMode){
		if(cnt>=answerCnt)
			inputChar=13;
		else{
			if($('#ach'+(cnt+1)).hasClass('space'))
				inputChar=32;
			else
				inputChar=$('#ach'+(cnt+1)).text().charCodeAt(0);
		}
	}
	if(cnt>=answerCnt){
		nextpage();
		if(inputChar!=13&&inputChar!=32)//enter/space
			console.log('Incorrectly press ['+String.fromCharCode(inputChar)+'] for starting a new line');
			//TODO:增加一个按的不是回车或空格的提示
		return;
	}
	if(!keyJudge(inputChar))
		return;
	cnt++;
	if(firstChar){
		if(!timeBetweenLines)
			timems=0;
		firstChar=false;
	}
	if(inputChar==32){
		$('#input').append(
		'<div class="char space" id="ch'+cnt+'">␣</div>\n'//兼容性对齐问题
		);
	}else{
		$('#input').append(
		'<div class="char" id="ch'+cnt+'">'
		+String.fromCharCode(inputChar)
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
}


function inputBackspace(){
	$('#ch'+cnt).remove();
		if(cnt>0)
			cnt--;
	return;
}

$(document).on('keydown',function(e){
	if(e.which==8)
		inputBackspace();
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
			lineSpeedWPM=(spaceCnt+1)/timeTemp*60000;
			totalSpeedWPM=totalWord/totalTime*60000;
			totalSpeedCPS=totalCnt/totalTime*1000;
			lineSpeedCPS=cnt/timeTemp*1000;
			
			outputSpeedFunction();

			//if(!timeBetweenLines)
				firstChar=true;
			//TODO:换单位/换单次记速，绘制图表...
			view();
			if(page>=9)
				page=0;
			page++;
			//ajax加载时按键切到下一页
			$.ajax('./data/test/'+page+'.txt').done(function(data){
				info=data;
				newinfo();
				available=true;
				timems=0;
			});
			clearInterval(refresh);
		}
	},animationTime);
	return;
}

function outputSpeedFunction(){
	switch(spUnit){
		case 'WPM-all':
			outPutSpeed=totalSpeedWPM;
			break;
		case 'WPM-line':
			outPutSpeed=lineSpeedWPM;
			break;
		case 'CPS-all':
			outPutSpeed=totalSpeedCPS;
			break;
		case 'CPS-line':
			outPutSpeed=lineSpeedCPS;
			break;
	}
	$('#sp01').text(Math.floor(outPutSpeed));
	$('#sp02').text(Math.floor((outPutSpeed*10)%10));
	// console.log(spUnit);
	// console.log('totalSpeedWPM',totalSpeedWPM,'lineSpeedWPM',lineSpeedWPM);
	// console.log('totalSpeedCPS',totalSpeedCPS,'lineSpeedCPS',lineSpeedCPS);
}



var info='welcome to yoyoyo';
var type='test';
var page=0;

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
	optionActivefunction();
});


function optionActivefunction(){
	//console.log('yo');
	clearTimeout(optionActiveTimer);
	optionActiveTimer=setTimeout(function(){
			clicked=false;
			$('.option').addClass('inactive');
		},3000);
	clicked=true;
	$('.option').removeClass('inactive');
}

$('#inputSubmitButton').on('click',function(e){
	e.preventDefault();
	keyPressFunction(13);
})

$('#inputBarMode-content').on('click',function(){
	if(inputBarMode=='content'){//content->off
		$('#inputBarMode-content').removeClass('active');
	}else{//off->content  or  event->content
		$('#inputBarMode-event').removeClass('active');
		$('#inputBarMode-content').addClass('active');
	}
	if(inputBarMode!='event')
		inputBarOnOffFunction('content');
	else
		inputBarMode='content';
	$('#inputBar').on('input',function(){
		if($('#inputBar').val().length>1)
			keyPressFunction($('#inputBar').val().charCodeAt(1));
 		else
 			inputBackspace();
 		$('#inputBar').val('0');
	});
	$(document).off();
	$('#inputBar').val('0');
	optionActivefunction();
});


$('#inputBarMode-event').on('click',function(){
	if(inputBarMode=='event'){//event->off
		$('#inputBarMode-event').removeClass('active');
	}else{//off->event  or  content->event
		$('#inputBarMode-content').removeClass('active');
		$('#inputBarMode-event').addClass('active');
	}
	if(inputBarMode!='content')
		inputBarOnOffFunction('event');
	else
		inputBarMode='event';
	$('#inputBar').off();
	$(document).off();
	$(document).on('keypress',null,null,function(e){
		keyPressFunction(e.which);
		$('#inputBar').val('');
	});
	$(document).on('keydown',function(e){
		if(e.which==8)
			inputBackspace();
	});
	optionActivefunction();
});

$('#cheatMode').on('click',function(){
	if(cheatMode){
		$('#cheatMode').removeClass('active');
	}else{
		$('#cheatMode').addClass('active');
	}
	cheatMode=!cheatMode;
})

function inputBarOnOffFunction(mode){
	clearInterval(focusTimer);
	if(inputBarMode!='off'){
		focusTimer=setInterval(function(){$('#inputBTN').focus();},100);
		//console.log(inputBarMode+'->off');
		inputBarMode='off';
	}else{
		focusTimer=setInterval(function(){$('#inputBar').focus();},100);
		inputBarMode=mode;
		//console.log('off->'+mode);
	}
	return;
}


$('#spUnit').on('click',function(){
	if(spUnit=='WPM-all'){
		$('#spUnit').text('WPM-line');
		$('#spUnit').attr('title','词数/每分钟(单行)');
		spUnit='WPM-line';
	}else if(spUnit=='WPM-line'){
		$('#spUnit').text('CPS-all');
		$('#spUnit').attr('title','字符数/每秒(总计)');
		spUnit='CPS-all';
	}else if(spUnit=='CPS-all'){
		$('#spUnit').text('CPS-line');
		$('#spUnit').attr('title','字符数/每秒(单行)');
		spUnit='CPS-line';
	}else if(spUnit=='CPS-line'){
		$('#spUnit').text('WPM-all');
		$('#spUnit').attr('title','词数/每分钟(总计)');
		spUnit='WPM-all';
	}
	outputSpeedFunction();
},);

$('#timeBetweenLines').on('click',function(){
	if(timeBetweenLines){
		$('#timeBetweenLines').removeClass('active');
	}else{
		$('#timeBetweenLines').addClass('active');
	}
	timeBetweenLines=!timeBetweenLines;
})

