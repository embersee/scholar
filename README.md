# Настройка проекта
Установить WSL
```
wsl --install
```
Установить Docker Desktop

Установить WSL Ubuntu 22.04
```sh
wsl --install "Ubuntu-22.04"
```

Клонировать репоз внутри wsl
```bash
git clone https://github.com/embersee/scholar.git
cd scholar
```
Установить ngrok и добавить автотокен (для этого нужно зарегаться) https://ngrok.com/download<br/>
Установить зависимости
```bash
apt update && upgrade
apt install curl
curl -fsSL https://deb.nodesource.com/setup_21.x | sudo -E bash - &&\
sudo apt-get install -y nodejs
npm i -g npm@latest
apt install jq
```
Создать `.env` файл и вставить в него код из `.env.example`. Заполнить то, что там указано.<br/>
Заменить имя пользователя БД c `postgres` на своего в `docker-compose.yaml` в строке :35
```
test: ["CMD", "pg_isready", "-U", "postgres", "-d", "scholar"]
```
Запустить скрипт
```bash
bash ./scripts/run-dev.sh
```
Поменять `botUsername` в `components/auth/SignIn.tsx` на имя вашего бота.<br/>
Скопировать адрес в командной строке и добавить его как домен для своего бота в https://t.me/botfather.

❗️Важно!

После каждого запуска Docker-контейнера прийдется заново привязывать домен бота.<br/>
