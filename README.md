# Scholar
Система учета студентов на практике.
Собрана на стеке Next.js + PostgreSQL + Prisma + tRPC
# Настройка проекта
Проект для запуска использует `bash` скрипты, поэтому для корректной работы понадобятся настроенные WSL и Docker.
Дальнейшие инструкции по установке зависимостей будут производиться для дистрибутива Ubuntu.

Клонировать репоз внутри wsl
```bash
git clone https://github.com/embersee/scholar.git
cd scholar
```
Установить ngrok и добавить автотокен (для этого нужно зарегаться) https://ngrok.com/download<br />
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
Запустить скрипт
```bash
bash ./scripts/run-dev.sh
```
Поменять `botUsername` в `components/auth/SignIn.tsx` на имя вашего бота.<br/>
Скопировать адрес в командной строке и добавить его как домен для своего бота в https://t.me/botfather.

## ❗️Важно!

После каждого запуска Docker-контейнера прийдется заново привязывать домен бота.<br/>
