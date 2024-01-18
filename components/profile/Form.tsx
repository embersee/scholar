"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import autoAnimate from "@formkit/auto-animate";
import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";

import { Combobox } from "@/components/ui/combobox";
import { GetUser, UserForm, userFormSchema } from "@/server/schema/user";
import { Institution } from "@/server/schema/institution";

export default function ProfileForm(props: {
  user: GetUser;
  institutions: Institution[];
}) {
  const parent = useRef(null);

  const institutions = props.institutions.map((v, i) => ({
    value: v.id,
    label: v.name,
  }));

  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);

  const form = useForm<UserForm>({
    // latest Zod release has introduced a TS error with zodResolver
    // open issue: https://github.com/colinhacks/zod/issues/2663
    // errors locally but not in production
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      ...props.user,
      institution: props.user?.institution?.name,
    } ?? {
      FIO: "",
      phone_number: "",
      institution: "",
      specialty: "",
    },
    reValidateMode: "onChange",
  });

  function handleSubmit(data: UserForm) {
    console.log(JSON.stringify(data));
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        autoComplete="off"
        className="flex grow flex-col justify-start"
        ref={parent}
      >
        <FormField
          control={form.control}
          name="FIO"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display name</FormLabel>
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
              <FormLabel>Phone number</FormLabel>
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
          name="institution"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Institution</FormLabel>
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
              <FormLabel>Specialty</FormLabel>
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

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
