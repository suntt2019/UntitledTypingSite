var timerCycle=10;//ms
var disableAnimation=false,animationTime=5,timeBetweenLines=false;//配置数据

var available=true,timems=0,timeTemp,firstChar=false;
var cnt=0,answerCnt=7,spaceCnt=0;//该行数据
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
			if(page>=9)
				page=0;
			page++;
			$.ajax('./data/test/'+page+'.txt').done(function(data){
				info=data;
				newinfo();
			});
			available=true;
			timems=0;
			clearInterval(refresh);
		}
	},animationTime);
	return;
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




