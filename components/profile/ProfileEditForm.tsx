"use client";
import Container from "@/components/ui/container";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";
import autoAnimate from "@formkit/auto-animate";
import { Combobox } from "@/components/ui/combobox";
import { GetUser, UserForm, userFormSchema } from "@/server/schema/user";
import { Institution } from "@/server/schema/institution";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { toast } from "../ui/use-toast";
import { z } from "zod";

interface RegForm {
    FIO: string,
    phone_number: string,
    institutionId: string,
    specialty: string,
}
export const RegFormSchema = z.object({
    FIO: z.string().min(3, "Обязательное поле"),
    phone_number: z
        .string()
        .regex(
            /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
            "Не соотвествует формату номера телефона",
        )
        .min(1),
    institutionId: z.string().min(1, "Обязательное поле"),
    specialty: z.string().min(1, "Обязательное поле"),
});

const ProifleEditForm = (props: {
    onCreate: Function | undefined,
    user: GetUser;
    institutions: Institution[];
}) => {
    const router = useRouter();
    const parent = useRef(null);

    const institutions = props.institutions.map((v, i) => ({
        value: v.id,
        label: v.name,
    }));

    useEffect(() => {
        parent.current && autoAnimate(parent.current);
    }, [parent]);
    const form = useForm<RegForm>({
        resolver: zodResolver(RegFormSchema),
        defaultValues: {
            FIO: "",
            phone_number: "",
            institutionId: "",
            specialty: "",
        },
        reValidateMode: "onChange",
    });

    const userShema = api.user.updateUser.useMutation({
        onMutate: () => {
            toast({
                title: '🔄 Обновление...',
            })
        },
        onError: (e) => {
            toast({
                title: '🚫 Ошибка',
                description: e.message
            })
        },
        onSuccess: () => {
            toast({
                title: '✅ Успех',
                description: 'Пользователь успешно обновлен'
            })
            props.onCreate ? props.onCreate() : router.push("/dash/profile")
        },
    })

    function handleSubmit(data: RegForm) {
        console.log(JSON.stringify(data));

        userShema.mutate({
            ...data,
            id: props.user?.id as string,
            telegram_id: props.user?.telegram_id as string,
        })
    }


    return (
        <Container className="justify-center">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    autoComplete="off"
                    className="flex flex-col justify-start w-72"
                    ref={parent}
                >
                    <FormField
                        control={form.control}
                        name="FIO"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>ФИО</FormLabel>
                                <FormControl>
                                    <Input
                                        autoComplete="off"
                                        placeholder="Иван Иванович"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription></FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="phone_number"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Номер телефона</FormLabel>
                                <FormControl>
                                    <Input
                                        autoComplete="off"
                                        placeholder="98273947"
                                        type="number"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription></FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="institutionId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Учебное заведение</FormLabel>
                                <FormControl>
                                    <Combobox
                                        options={institutions}
                                        {...field}
                                        names={{
                                            button: "Выбрать учеб. заведение",
                                            empty: "Нету такого учеб. заведения...",
                                            search: "Поиск по учеб. заведениям",
                                        }}
                                    />
                                </FormControl>
                                <FormDescription></FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="specialty"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Специальность</FormLabel>
                                <FormControl>
                                    <Input
                                        autoComplete="off"
                                        placeholder="Специальность"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription></FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit">{userShema.isLoading ? "Отправка..." : "Отправить"}</Button>
                </form>
            </Form>
        </Container>
    );
}

export default ProifleEditForm;