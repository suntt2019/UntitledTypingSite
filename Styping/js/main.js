var timerCycle=10;//ms
var animationTime=5,animationTimeStep=1,timeBetweenLines=false,inputBarMode='off',countLineBreakIntoAccuracy=false;//配置数据
var cheatMode=false,spUnit='WPM-all',accuracyLine=false;
var totalSpeedWPM=0,lineSpeedWPM=0,totalSpeedCPS=0,lineSpeedCPS=0,outPutSpeed=0;

var infoMode='lorem_Lorem';
var info='happy new year';

var available=true,timems=0,timeTemp,firstChar=true;
var cnt=0,lineCnt=0,answerCnt=7,spaceCnt=0,ac1CntLine=0,ac2CntLine=0,ac1RateLine=1,ac2RateLine=1,wrongNewLine=false;//该行数据
var ac1CntTotal=0,ac2CntTotal=0,totalCnt=0,totalTime=0,totalWord=0;//累计数据
var ac1RateTotal=1,ac2RateTotal=1,totalSpeedWPM;//计算出的数据
var timer=setInterval(function(){timems+=timerCycle;},timerCycle);
var focusTimer=setInterval(function(){$('#inputBTN').focus();},100);
var optionActiveTimer,boom=false;



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
		if(inputChar!=13&&inputChar!=32){//enter/space
			console.log('Incorrectly press ['+String.fromCharCode(inputChar)+'] for starting a new line');
			$('#input').append('<div class="char prompt">['+String.fromCharCode(inputChar)+']</div>\n');
			if(countLineBreakIntoAccuracy)
				wrongNewLine=true;
		}
		nextpage();
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
	ac1CntLine=0;
	ac2CntLine=0;
	lineCnt=0;
	ac1RateLine=1;
	ac2RateLine=1;
	var refresh=setInterval(function(){
		i++;
		lineCnt++;
		totalCnt++;
		ac1CntLine++;
		ac2CntLine++;
		ac1CntTotal++;
		ac2CntTotal++;
		$('#ch'+i).text('-');
		$('#ch'+i).css({padding:'0px 0px'});
		$('#ach'+i).text('-');
		if($('#ch'+i).hasClass('wrong')){
			ac2CntLine--;
			ac2CntTotal--;
			ac2RateLine=ac2CntLine/lineCnt;
			ac2RateTotal=ac2CntTotal/totalCnt;
			outputAccuracyFunction();	
		}
		if($('#ach'+i).hasClass('mistaken')){
			ac1CntLine--;
			ac1CntTotal--;
			ac1RateLine=ac1CntLine/lineCnt;
			ac1RateTotal=ac1CntTotal/totalCnt;
			outputAccuracyFunction();
		}
		if(i>=answerCnt){
			ac1RateLine=ac1CntLine/lineCnt;
			ac1RateTotal=ac1CntTotal/totalCnt;
			ac2RateLine=ac2CntLine/lineCnt;
			ac2RateTotal=ac2CntTotal/totalCnt;
			outputAccuracyFunction();

			//newline
			if(wrongNewLine){
				lineCnt++;
				totalCnt++;
				ac1RateLine=ac1CntLine/lineCnt;
				ac1RateTotal=ac1CntTotal/totalCnt;
				ac2RateLine=ac2CntLine/lineCnt;
				ac2RateTotal=ac2CntTotal/totalCnt;
				outputAccuracyFunction();
			}


			wrongNewLine=false;

			totalWord+=spaceCnt+1;
			totalTime+=timeTemp;
			lineSpeedWPM=(spaceCnt+1)/timeTemp*60000;
			totalSpeedWPM=totalWord/totalTime*60000;
			totalSpeedCPS=totalCnt/totalTime*1000;
			lineSpeedCPS=cnt/timeTemp*1000;
			
			outputSpeedFunction();

			firstChar=true;
			//TODO:绘制图表...
			view();
			generateNewInfoFunction();
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

function outputAccuracyFunction(){
	if(accuracyLine){
		$('#ac11').text(Math.floor(ac1RateLine*100));
		$('#ac12').text(Math.floor(ac1RateLine*1000)%10);
		$('#ac21').text(Math.floor(ac2RateLine*100));
		$('#ac22').text(Math.floor(ac2RateLine*1000)%10);
	}else{
		$('#ac11').text(Math.floor(ac1RateTotal*100));
		$('#ac12').text(Math.floor(ac1RateTotal*1000)%10);
		$('#ac21').text(Math.floor(ac2RateTotal*100));
		$('#ac22').text(Math.floor(ac2RateTotal*1000)%10);
	}
	console.log(accuracyLine);
	console.log('Line',ac1RateLine,ac2RateLine);
	console.log(ac1CntLine,ac2CntLine,lineCnt);
	console.log('Total',ac1RateTotal,ac2RateTotal);
	console.log(ac1CntTotal,ac2CntTotal,totalCnt);
	return;
}


var page=0;

function newinfo(){
	cnt=0;
	$('#input').html('<div class="preText" title="你输入的">>&nbsp;</div>\n');
	answerCnt=info.length;
	spaceCnt=0;
	$('#answer').html('<div class="preText" title="你要输入的">>&nbsp;</div>\n');
	for(var i=1;i<=answerCnt;i++){
		if(info[i-1]==' '){
			$('#answer').append('<div id="ach'+i+'" class="answerChar space">␣</div>\n');
			spaceCnt++;
		}
		else
			$('#answer').append('<div id="ach'+i+'" class="answerChar">'+info[i-1]+'</div>\n');

	}
	available=true;
	timems=0;
	//$('#answer').html('<div class="preText">Yo...</div>\n<div id="ach1" class="answerChar">a</div>\n<div id="ach2" class="answerChar">s</div>\n<div id="ach3" class="answerChar">d</div>\n<div id="ach4" class="answerChar">f</div>');
	return;
}


function view(){
	console.log('===============view===============');
	console.log('[Accuracy]');
	console.log('totalCnt',totalCnt,'ac1CntTotal',ac1CntTotal,'ac2CntTotal',ac2CntTotal);
	console.log('ac1RateTotal',ac1RateTotal,'ac2RateTotal',ac2RateTotal);
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
	if($(this).hasClass('unusable'))
		return;
	$(this).parent().parent().find('.contentClass').removeClass('chosen');
	$(this).parent().parent().find('.contentTitle').removeClass('chosen');
	$(this).parent().parent().find('.contentDetail').removeClass('chosen');
	$(this).parent().addClass('chosen');
	$(this).parent().find('.contentTitle').addClass('chosen');
	$(this).addClass('chosen');
	infoMode=$(this).parent().attr('className')+'_'+$(this).text();
	//console.log(infoMode);
	infoBaseReadyFunction(infoMode);
	optionActivefunction();
})

$('.contentTitle').on('click',function(){
	if($(this).hasClass('unusable'))
		return;
	$(this).parent().parent().find('.contentClass').removeClass('chosen');
	$(this).parent().parent().find('.contentTitle').removeClass('chosen');
	$(this).parent().parent().find('.contentDetail').removeClass('chosen');
	$(this).parent().addClass('chosen');
	$(this).addClass('chosen');
	$(this).parent().find('.contentDetail.default').addClass('chosen');
	infoMode=$(this).parent().attr('className')+'_'
	+$(this).parent().find('.contentDetail.default').text();
	//console.log(infoMode);
	infoBaseReadyFunction(infoMode);
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
});

$('#countLineBreakIntoAccuracy').on('click',function(){
	if(countLineBreakIntoAccuracy){
		$('#countLineBreakIntoAccuracy').removeClass('active');
	}else{
		$('#countLineBreakIntoAccuracy').addClass('active');
	}
	countLineBreakIntoAccuracy=!countLineBreakIntoAccuracy;
	return;
});

$('#ac').on('click',function(){
	if(accuracyLine){
		$('#ac').text('Aca');
		$('#ac').attr('title','正确率AccuracyAll(总计)');
	}else{
		$('#ac').text('Acl');
		$('#ac').attr('title','正确率AccuracyLine(单行)');
	}
	accuracyLine=!accuracyLine;
	outputAccuracyFunction();
	return;
})

var maxLength=55,pageOfPi=1,infoPointer=0,infoBase,infoBaseLength,infoBaseTemp='';
function generateNewInfoFunction(){
	info='';
	switch(infoMode){
		case 'lorem_Lorem':
			$.ajax('./data/'+infoMode+'/'+page+'.txt').done(function(data){
				info=data;
				newinfo();
			});
			break;
		case 'number_random':
			var numberLength,firstNumber=true;
			//console.log(info,info.length);
			while(info.length<=maxLength){
				numberLength=Math.floor(Math.random()*4)+3;
				if(numberLength+info.length>maxLength)
					break;
				if(!firstNumber)
					info=info+' ';
				else
					firstNumber=false;
				info=info+Math.floor(Math.random()*Math.pow(10,numberLength))+'';
			}
			firstNumber=true;
			newinfo();
			break;
		case 'number_π':case 'passage_诗歌':
			var i,k;
			for(i=0;i<maxLength;i++){
				info=info+infoBase[infoPointer+i];
				if(infoMode=='number_π'&&i%5==4&&i!=maxLength-1)
					info=info+' ';
				//console.log('[info]',infoPointer,i,info);
			}
			k=i;
			while(k>0&&info[k]!=' ')
				k--;
			if(!k)
				k=i;
			else
				infoPointer++;
			infoPointer+=k;
			info=info.substring(0,k);
			newinfo();
			if(infoBaseLength<infoPointer+maxLength){
				available=false;
				console.log('[Load]','info',info,'infoBase',infoBase,'infoBaseTemp',infoBaseTemp);
				$.ajax('./data/'+infoMode+'/'+infoMode+'_'+page+'.txt').done(function(data){
					infoBaseTemp=infoBase.substring(infoPointer,infoBaseLength);
					infoBase=infoBaseTemp+data;
					infoBaseLength=infoBase.length;
					infoBaseTemp='';
					infoPointer=0;
					console.log('[Load]','info',info,'infoBase',infoBase,'infoBaseTemp',infoBaseTemp);
					page++;
					if(page>pageMax(infoMode))
						page=0;
					available=true;
				});
			}
			
			break;
		case 'number_date':
			var firstNumber=true,year,month,day,date;
			while(info.length<=maxLength){
				year=Math.floor(Math.random()*60)+1970;
				month=Math.floor(Math.random()*12)+1;
				if(month==4||month==6||month==9||month==11)
					day=Math.floor(Math.random()*30)+1;
				else if(month==2&&((year%4==0&&year%100!=0)||year%400==0))
					day=Math.floor(Math.random()*29)+1;
				else if(month==2)
					day=Math.floor(Math.random()*28)+1;
				else
					day=Math.floor(Math.random()*31)+1;
				date=year+'-'+month+'-'+day;
				//console.log(year,month,day,date);
				if(date.length+info.length>maxLength)
					break;
				if(!firstNumber)
					info=info+' ';
				else
					firstNumber=false;
				info=info+date;
				newinfo();
			}
	}
	console.log(infoMode);
	console.log(info);
	return;	
}



function infoBaseReadyFunction(infoMode){
	page=0;
	infoBase=='';
	available=false;
	infoPointer=0;
	console.log('[infoBase-load]',infoMode);
	if(infoMode=='number_π'||infoMode=='passage_诗歌'){
		$.ajax('./data/'+infoMode+'/'+infoMode+'_'+page+'.txt').done(function(data){
			infoBase=data;
			infoBaseLength=infoBase.length;
			page++;
			available=true;
		});
	}else{
		available=true;
	}
	return;
}

function pageMax(infoMode){//文本最后记得加一个空格
	switch(infoMode){
		case 'number_π':return 9;
		case 'passage_诗歌':return 1;
	}
}


$('#animationTimeMinus').on('click',function(){
	animationTime-=animationTimeStep;
	animationTimeUpadteFunction();
});

$('#animationTimePlus').on('click',function(){
	if(boom)
		return;
	animationTime+=animationTimeStep;
	animationTimeUpadteFunction();
});

function animationTimeUpadteFunction(){
	if(boom)
		return;
	if(animationTime<0){
		animationTime=0;
	}
	switch(Math.floor(animationTime/10)){
		case 0:
			animationTimeStep=1;
			break;
		case 1:
			animationTimeStep=2;
			break;
		case 2:case 3:case 4:
			animationTimeStep=5;
			break;
		case 5:case 6:case 7:case 8:case 9:
			animationTimeStep=10;
			break;
		default:
			animationTimeStep=20;
			break;
	}
	if(animationTime>=1000)
		animationTimeStep=500;
	else if(animationTime>=500)
		animationTimeStep=100;
	else if(animationTime>=300)
		animationTimeStep=50;
	$('#animationTimeMinus').text('-'+animationTimeStep+'ms');
	$('#animationTimePlus').text('+'+animationTimeStep+'ms');
	$('#animationTime').val(animationTime);
	if(animationTime>20000){
		animationTime=20000;
		$('#animationTimePlus').text('BOOM!!!');
		$('#animationTimePlus').css('color','#fff');
		$('#animationTimeMinus').css('font-size','0.2rem');
		$('#animationTime').css('font-size','0.2rem');
		$('#animationTimePlus').css('font-size','1.6rem');
		$('#cheatMode').css('display','inline-block');
		$('.hide').removeClass('hide');
		$('#cheatMode').css('color','#ccc');
		boom=true;
		setTimeout(function(){
			$('#animationTimePlus').text('+'+animationTimeStep+'ms');
			$('#animationTimePlus').css('color','#999');
			$('#animationTimePlus').css('font-size','1rem');
			$('#animationTimeMinus').css('font-size','1rem');
			$('#animationTime').css('font-size','1rem');
			$('#cheatMode').css('color','#999');
			boom=false;
		},2000);
	}
	return;
}

$('.settingButton').on('click',function(){
	optionActivefunction();
});