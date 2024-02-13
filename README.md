# Scholar
Students apprenticeships accounting system

## Installation (Ngrok)

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


### Important

After each project launch, make sure to add the ngrok url to your telegram bot's domain in bot settings @BotFather.


## Installation (localhost)

Fill in required env vars
```bash
cp .env.example .env
```
Change web port from `3000:3000` to `80:3000` in `docker-compose.yaml:17`:
```yaml
ports:
  - "80:3000"
```
Edit `Dockerfile:29`, change `npm run build` to port 80:
```Dockerfile
# Deploying the build version
RUN npm run dev --port 80
```
Set bot domain as `127.0.0.1` in @BotFather s</br>

Start server with
```bash
docker-compose up
```
