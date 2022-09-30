
# AUTO-GEN

░█▀█░█░█░▀█▀░█▀█░░░░░█▀▀░█▀▀░█▀█
░█▀█░█░█░░█░░█░█░▄▄▄░█░█░█▀▀░█░█
░▀░▀░▀▀▀░░▀░░▀▀▀░░░░░▀▀▀░▀▀▀░▀░▀

A CLI tool that take JSON file as input and create a react js project with complete routing.




## Features

- Fully customized layouts (header, footer)
- Auto folder structure ready to go
- Proper naming convention of files
- Proper import exports
- Nested Routes and Components support


## Installation & Usage

Install this package using npm

```bash
  npm install -g @anovius/auto-gen
```

This will create porject in current directory

```bash
  autogen you_json_file.json
```

## JSON file template

```json
{
    "project": "Sample",
    "layout": {
        "header": false,
        "pages": [
            {
                
                "header": true,
                "sub": [],
                "footer": false
            },
            {
                "name": "Auth",
                "header": true,
                "sub": [
                    {
                        "name": "Login"
                    },
                    {
                        "name": "Register",
                        "sub": [
                            {
                                "name": "Admin"
                            },
                            {
                                "name": "User"
                            }
                        ]
                    }
                ],
                "footer": false
            },
            {
                "name": "Dashboard",
                "header": true,
                "sub": [
                    {
                        "name": "Main"
                    },
                    {
                        "name": "Profile"
                    },
                    {
                        "name": "Settings"
                    }
                ],
                "footer": false
            }
        ],
        "footer": true
    },

    "type": "js"
}
```

## Template Properties

| Name              | Type                | Usage                |
| ----------------- | --------------------| -------------------- |
|project|string|Name of your project
|type|string|Your project type JS for Javascript and TS for Typescript|
|layout|object|Main header and footer of your project
|header|bool|Default false
|footer|bool|Default false
|name|string|Your page name|
|pages|array|Main pages of the project|
|sub|array|Nested Pages of a page|


## Authors

- [Usman Farooq](http://usmandev.com/)

