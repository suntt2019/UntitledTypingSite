import re
from random import shuffle

inputFileDirTitle='passage_poem_'
outputFileDirTitle='passage_poem_'

for num in range(0,10):
	inputFile=open(inputFileDirTitle+str(num)+'.in','r')
	print(inputFile)
	contentList=inputFile.readlines()
	content=''.join(contentList)
	content=re.sub('\n',' ',content)
	inputFile.close()
	outputFile=open(outputFileDirTitle+str(num)+'.txt','w')
	outputFile.write(content)
	outputFile.close()