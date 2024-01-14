# Настройка проекта
Установить WSL
`wsl --install`
Установить Docker Desktop
Установить WSL Ubuntu 22.04
`wsl --install "Ubuntu-22.04"`
Клонировать репоз внутри wsl
```bash
git clone https://github.com/embersee/scholar.git
cd scholar
```
Установить ngrok и добавить автотокен (для этого нужно зарегаться) https://ngrok.com/download
Установить зависимости
```bash
apt update && upgrade
apt install curl

apt install jq
```
Создать `.env` файл и вставить в него код из `.env.example`. Заполнить то, что там указано.
Заменить имя пользователя БД c `postgres` на своего в `docker-compose.yaml` в строке :35
```
test: ["CMD", "pg_isready", "-U", "postgres", "-d", "scholar"]
```
Запустить скрипт
```bash
bash ./scripts/run-dev.sh
```
Скопировать адрес в командной строке и добавить его как домен для своего бота в https://t.me/botfather.
❗️Важно!
После каждого запуска Docker-контейнера прийдется заново привязывать домен бота
Поменять botUsername в components/auth/SignIn.tsx на имя вашего бота.