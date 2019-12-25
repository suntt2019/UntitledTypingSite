#include <stdio.h>

int main(){
	char str[1000005],filename[30]="number_π_0.txt";
	FILE * finput=fopen("pi.txt","r");
	printf("start\n");
	for(int i=0;i<10;i++){
		printf("%d\n",i);
		fgets(str,10001,finput);
		//filename[3]=i/10+'0';
		filename[10]=i%10+'0';
		FILE * foutput=fopen(filename,"w");
		fputs(str,foutput);
		fclose(foutput);
	}
	fclose(finput);
	return 0;
}