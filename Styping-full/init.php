<?php
$newfile2 = fopen("./feedback/qutanzhikekeli/qutanzhikekeli.txt", "a");
fwrite($newfile2, "[Feedback-Init]\n");
fwrite($newfile2, "Time:".date("Y-m-d")."-".date("H:i:s")."\n");
fwrite($newfile2, "IP:".$_SERVER['REMOTE_ADDR']."\n");
fwrite($newfile2, "[Feedback-Init]\n");
fclose($newfile2);
echo 'Finished init.\n';
echo "Time:".date("Y-m-d")."-".date("H:i:s").'\n';
echo "IP:".$_SERVER['REMOTE_ADDR'].'\n';
?>