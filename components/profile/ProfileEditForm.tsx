"use client";
import Container from "@/components/ui/container";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { User, updateUserSchema } from "@/server/schema/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { User as UserClient } from "@prisma/client";
import { Button } from "../ui/button";
import Link from "next/link";
import { useEffect, useRef } from "react";
import autoAnimate from "@formkit/auto-animate";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";

const ProifleEditForm = ({ user }: { user: UserClient }) => {
    const parent = useRef(null);

    useEffect(() => {
        parent.current && autoAnimate(parent.current);
    }, [parent])

    const form = useForm<User>({
        resolver: zodResolver(updateUserSchema),
        defaultValues: {
            id: user.id,
            telegram_id: user.telegram_id,
            username: user.username ?? "",
            display_name: user.display_name ?? "",
            FIO: user.FIO ?? "",
            phone_number: user.phone_number ?? "",
        },
        reValidateMode: "onChange",
    });

    const router = useRouter();

    const {mutate: updateUSer, isLoading: isUserUpdating} = api.user.updateUser.useMutation({
        onSuccess: ()=> router.push("/dash/profile"),
        onError: console.error
    })

    function handleSubmit(data: User) {
        alert("hell")
        console.log(JSON.stringify(data));
        updateUSer({...data});
    }

    
    return (
        <Container className="justify-center">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    autoComplete="off"
                    className="flex flex-col gap-6"
                    ref={parent}
                >
                    <FormField
                        control={form.control}
                        name="display_name"
                        render={({ field }) => (
                            <FormItem className="w-max">
                                <FormLabel>Display name</FormLabel>
                                <Input
                                    className="w-72"
                                    autoComplete="off"
                                    {...field}
                                />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="FIO"
                        render={({ field }) => (
                            <FormItem className="w-max">
                                <FormLabel>FIO</FormLabel>
                                <Input
                                    className="w-72"
                                    autoComplete="off"
                                    placeholder="Ivanov Ivan Ivanovich"
                                    {...field}
                                />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="phone_number"
                        render={({ field }) => (
                            <FormItem className="w-max">
                                <FormLabel>Phone Number</FormLabel>
                                <Input
                                    type="number"
                                    className="w-72"
                                    placeholder="88005553535"
                                    autoComplete="off" {...field}
                                />
                            </FormItem>
                        )}
                    />
                    <div className="mt-4 flex flex-col gap-4">
                        <Link href="/dash/profile">
                            <Button type="reset" className="w-72">Discard Changes</Button>
                        </Link>
                        <Button type="submit" className="w-72">Submit</Button>
                    </div>
                </form>
            </Form>
        </Container >
    );
}

export default ProifleEditForm;