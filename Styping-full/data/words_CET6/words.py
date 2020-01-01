import re
from random import shuffle

inputFileDir='cet6-original-words_x10.txt'
outputFileDir='cet4-all.txt'
nameTitle='words_CET6_'
MAXLENGTH=200


inputFile=open(inputFileDir,'r')
contentList=inputFile.readlines()
inputFile.close()
content=''.join(contentList)
#print(content)
pattern=re.compile(r'\n[\w-]+\ ')
resultList=pattern.findall(content)
# print(resultList)
cleanList=[]
for word in resultList:
	word=re.sub('\n','',word)
	cleanList.append(word)

shuffle(cleanList)
pointer=0
num=0
while pointer<len(cleanList):
	groupLength=0
	groupList=[]
	while pointer<len(cleanList) and groupLength<MAXLENGTH:
		groupList.append(cleanList[pointer])
		groupLength+=len(cleanList[pointer])
		group=''.join(groupList)
		pointer+=1
	#print(num,'$$$',group)
	outputFile=open(nameTitle+str(num)+'.txt','w')
	outputFile.write(group)
	outputFile.close()
	num+=1

print('generated',num+1,'pages.')
#print(pointer,'/',len(cleanList))
#print(result)


# for num in range(0,99):
# 	outputFile=open(nameTitle+num+'.txt','w')
	
# 	while 

# outputFile=open(outputFileDir,'w')
# outputFile.write(result)
# outputFile.close()

