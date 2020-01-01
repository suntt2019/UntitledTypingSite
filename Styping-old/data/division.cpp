#include <stdio.h>
#include <string.h>
#include <unistd.h>
#include <sstream>
using namespace std;
//参数：每个文件字节数

int main(int argc, char **argv){
	stringstream ss;
	int cntPerFile;
	char str[1000005],filename2[50]="_00.txt",filename1[50],filename0[50],cwd[500],*p;
	FILE * finput;
	if(argc==1){
		printf("You didn't input the size of each file.\nSo, we divided them into 1K using the default setting.\n");
	}else if(argc!=2){
		printf("[ERROR]There should be one parameter.(Byte per file)\n usually we use 1000(1K)");
		return -2;
	}
	ss<<argv[1];
	ss>>cntPerFile;
	getcwd(cwd,500);
	p=cwd+strlen(cwd);
	while(*p!='/')
		p--;
	p++;
	strcpy(filename0,p);
	strcpy(filename1,filename0);
	strcat(filename1,".txt");
	if(!(finput=fopen(filename1,"r"))){
		printf("[ERROR]Can't find that file\n");
		return -1;
	}
	for(int i=0;i<100;i++){
		strcpy(filename1,filename0);
		fgets(str,cntPerFile+1,finput);
		filename2[1]=i/10+'0';
		filename2[2]=i%10+'0';
		strcat(filename1,filename2);
		printf("[output]%s\n",filename1);
		FILE * foutput=fopen(filename1,"w");
		fputs(str,foutput);
		fclose(foutput);
	}
	fclose(finput);
	return 0;
}