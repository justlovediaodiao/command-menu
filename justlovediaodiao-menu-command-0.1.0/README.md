### command menu

It adds a context menu to vscode and run command when be clicked.  

### config

Specify the commands by settings `commandMenu.commands`. The file name will be passed to the command as a argument when running command.  

```conf
commandMenu.commands = [
    {"name": "echo", "command": "echo"},
    {"name": "tail", "command": "tail -10"}
]
```

When you click `Run Command` context menu on file `hello.py` and pick `tail`, the command `tail -10 hello.py` will be executed.  
When there is no command configuration, it allows you to enter a command to execute.  
When there is one command configuration, it directly executes the command.
