### command menu

It adds a context menu to vscode and run command when be clicked.  

### config

Specify the commands by settings `commandMenu.commands`. `command` is the command to run. `{}` in `command` will be replaced with related filename.  `name` is optional.

```conf
commandMenu.commands = [
    {"command": "echo test"},
    {"name": "show filename", "command": "echo {}"}
]
```

When you click `Run Command` context menu on file `hello.py` and pick `show filename`, the command `echo "hello.py"` will be executed.  
When there is no command configuration, it allows you to enter a command to execute.  
When there is one command configuration, it directly executes the command.
