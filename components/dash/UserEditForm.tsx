import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { useEffect, useId, useRef } from "react";
import autoAnimate from "@formkit/auto-animate";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import {updateUserParams, User} from "@/server/schema/user";

import {z} from "zod";




const UserEditForm = ({onCreate, data}:{onCreate: Function, data: User }) => {
    const parent = useRef(null);

    useEffect(() => {
        parent.current && autoAnimate(parent.current);
    }, [parent]);

    const form = useForm<User>({
        resolver: zodResolver(updateUserParams),
        defaultValues: {
            id: data.id ,
            username: data.username,
            FIO: data.FIO,
            display_name: data  ? data.display_name : '' ,
            phone_number: data.phone_number ,
            email: data.email,
        },
        reValidateMode: "onChange"
    });

    const userEditMutation = api.user.updateUser.useMutation({ onSuccess: () => onCreate(), onError: console.error })


    function handleSubmit(data: User): void {
        console.log(JSON.stringify(data));
        userEditMutation.mutate(data);
    }

    return <Form {...form}>
        <form autoComplete="off" className="flex flex-col w-72 gap-2" onSubmit={form.handleSubmit(handleSubmit)} ref={parent}>
            <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Id</FormLabel>
                        <Input autoFocus autoComplete="off" aria-autocomplete="none" placeholder="00001" {...field} />
                    </FormItem>
                )} />
            <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Username</FormLabel>
                        <Input  autoComplete="off" aria-autocomplete="none" placeholder="Username" {...field} />
                    </FormItem>
                )} />
            <FormField
                control={form.control}
                name="display_name"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Display name</FormLabel>
                        <Input autoFocus autoComplete="off" aria-autocomplete="none" placeholder="display name" {...field} />
                    </FormItem>
                )} />
            <FormField
                control={form.control}
                name="FIO"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>FIO</FormLabel>
                        <Input autoFocus autoComplete="off" aria-autocomplete="none" placeholder="FIO" {...field} />
                    </FormItem>
                )} />
            <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Phone number</FormLabel>
                        <Input autoFocus autoComplete="off" aria-autocomplete="none" placeholder="phone number" {...field} />
                    </FormItem>
                )} />
            <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <Input autoFocus autoComplete="off" aria-autocomplete="none" placeholder="email" {...field} />
                    </FormItem>
                )} />
            <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Phone number</FormLabel>
                        <Input autoFocus autoComplete="off" aria-autocomplete="none" placeholder="phone number" {...field} />
                    </FormItem>
                )} />
            <Button type="submit">{userEditMutation.isLoading ? "Submitting..." : "Submit"}</Button>
        </form>
    </Form>
}

export default UserEditForm;