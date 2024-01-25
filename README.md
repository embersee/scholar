# Scholar
Система учета студентов на практике.

## Installation

Install ngrok and register your account using the CLI at https://ngrok.com/download

Fill in required env vars
```bash
cp .env.example .env
```
Dev enviroment bash script
```bash
bash ./scripts/run-dev.sh
```
*Might require to get ```jq``` dependency, depending on your OS.

or

Manually start a ngrok instance using said env vars -> connect ngrok url to telegram bot domain in bot settings @BotFather.


## Important

After each project launch, make sure to add the ngrok url to your telegram bot's domain in bot settings @BotFather.
