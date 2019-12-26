<?php
$feedback=$_POST['feedback'];
echo $feedback;

$newfile1 = fopen("./feedback/qutanzhikekeli/".date("Y-m-d")."-".date("H-i-s").".txt", "w");
fwrite($newfile1, "[[[feedback]]]\n");
fwrite($newfile1, "Time:".date("Y-m-d")."-".date("H:i:s")."\n");
fwrite($newfile1, "IP:".$_SERVER['REMOTE_ADDR']."\n");
fwrite($newfile1, "Content:\n\n");
fwrite($newfile1, $feedback);
fwrite($newfile1, "\n\n[END]\n");
fclose($newfile1);

$newfile2 = fopen("./feedback/qutanzhikekeli/qutanzhikekeli.txt", "a");
fwrite($newfile2, "\n=====================\n");
fwrite($newfile2, "Time:".date("Y-m-d")."-".date("H:i:s")."\n");
fwrite($newfile2, "IP:".$_SERVER['REMOTE_ADDR']."\n");
fwrite($newfile2, "Content:\n\n");
fwrite($newfile2, $feedback);
fwrite($newfile2, "\n\n=====================\n");
fclose($newfile2);
?>