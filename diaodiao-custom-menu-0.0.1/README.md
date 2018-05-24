## instruction
An externtion for vscode. It adds a context menu to vscode and run a command when be clicked.   
You can specify the command by settings `custommenu.command`. The file name will be passed to the command as a argument when running command.  

eg: With settings `"custommenu.command": "echo"`, when you click the custom menu on file `hello.py` , it will run command `echo hello.py`.