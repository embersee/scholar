"use client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ProfileMenuPoint from "@/components/profile/ProfileMenuPoint";
import Container from "../ui/container";
import { useEffect } from "react";
import { GetUser } from "@/server/schema/user";

const profileInfo = ({ user }: { user: GetUser }) => {
    if (!user) return "Ошибка при загрузке данных пользователя, попробуйте войти снова";
    useEffect(()=> console.log(user), [user])
    return <Container className="justify-center md:col-span-3">
        <div className="flex flex-col max-w-80 gap-10">
            <Avatar className="w-44 h-44 mx-auto mb-6">
                <AvatarImage src={user.image as string}></AvatarImage>
                <AvatarFallback>{user.username?.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-row flex-nowrap">
                <div className="font-bold dark:text-slate-300 capitalize text-2xl">{user.display_name}</div>
            </div>

            <ProfileMenuPoint name="Telegram id" value={user.telegram_id} />
            <ProfileMenuPoint name="Имя пользователя" value={user.username} />
            <ProfileMenuPoint name="ФИО" value={user.FIO} />
            <ProfileMenuPoint name="Телефон" value={user.phone_number} />
            <ProfileMenuPoint name="Учебное заведение" value={user.institution?.name} />
            <ProfileMenuPoint name="Специальность" value={user.specialty} />

            <Link href="/dash/profile/edit" className="my-6 w-max">
                <Button variant="default" size="lg">Редактировать</Button>
            </Link>
        </div>
    </Container>
}

export default profileInfo;