<?php

$feedback=$_POST['feedback'];
echo $feedback;
if($_POST['type']=='feedback')
	$newfile1 = fopen("./feedback/qutanzhikekeli/".date("Y-m-d")."-".date("H-i-s").".txt", "w");
else
	$newfile1 = fopen("./feedback/qutanzhikekeli/".date("Y-m-d")."-".date("H-i-s")."_BOOM.txt", "w");
fwrite($newfile1, "[[[feedback]]]\n");
fwrite($newfile1, "Time:".date("Y-m-d")."-".date("H:i:s")."\n");
fwrite($newfile1, "IP:".$_SERVER['REMOTE_ADDR']."\n");
if($_POST['type']=='feedback'){
	fwrite($newfile1, "Content:\n\n");
	fwrite($newfile1, $feedback);
	fwrite($newfile1, "\n\n[END]\n");
}else{
	fwrite($newfile1, "BOOM-BOOM-BOOM-BOOM-BOOM\n");
}
fclose($newfile1);

$newfile2 = fopen("./feedback/qutanzhikekeli/qutanzhikekeli.txt", "a");
fwrite($newfile2, "\n===============================\n");
fwrite($newfile2, "Time:".date("Y-m-d")."-".date("H:i:s")."\n");
fwrite($newfile2, "IP:".$_SERVER['REMOTE_ADDR']."\n");
if($_POST['type']=='feedback'){
	fwrite($newfile2, "Content:\n\n");
	fwrite($newfile2, $feedback);
	fwrite($newfile2, "\n\n===============================\n");
}else{
	fwrite($newfile2, "BOOM-BOOM-BOOM-BOOM-BOOM\n");
	fwrite($newfile2, "===============================\n");
}

fclose($newfile2);
?>