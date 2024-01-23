"use client";

import { useForm } from "react-hook-form";
import {
  ApprenticeshipForm,
  apprenticeshipFormSchema,
  ApprenticeshipTypes,
  GetApprenticeship,
} from "@/server/schema/apprenticeship";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Combobox } from "@/components/ui/combobox";
import { api } from "@/trpc/react";

export default function ApprtsForm(props: {
  apprenticeships: GetApprenticeship;
  apprenticeshipTypes: ApprenticeshipTypes[];
  session: any
}) {
  const parent = useRef(null);

  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);

  const form = useForm<ApprenticeshipForm>({
    // latest Zod release has introduced a TS error with zodResolver
    // open issue: https://github.com/colinhacks/zod/issues/2663
    // errors locally but not in production
    resolver: zodResolver(apprenticeshipFormSchema),
    defaultValues: {
      referral: "",
      report: "",
      apprenticeship_type: "",
      // date: {
      //   from: undefined,
      //   to: undefined,
      // },
    },
    reValidateMode: "onSubmit",
  });

  const apprtsTypes = props.apprenticeshipTypes.map((v) => ({
    value: v.id,
    label: v.name,
  }));
  
  const apprts = api.apprts.createApprenticeship.useMutation({
    onSuccess: ()=> alert("success!!!"),
    onError: (e)=> {
      alert("Error");
      console.error(e);
    }
  });

  async function handleSubmit(data: ApprenticeshipForm) {
    const userId = props.session.data?.user.id as string;
    const {date: {from: start_date, to: end_date}} = data;

    const processedData = {...data, user_id: userId, start_date, end_date};
    console.log(JSON.stringify(processedData));
    apprts.mutate({...processedData});
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        autoComplete="off"
        className="flex grow flex-col justify-start items-center gap-4"
        ref={parent}
      >
        <FormField
          control={form.control}
          name="apprenticeship_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Вид практики</FormLabel>
              <FormControl>
                <Combobox
                  options={apprtsTypes}
                  {...field}
                  names={{
                    button: "Выбрать вид",
                    empty: "Нету такого...",
                    search: "Поиск вида практики",
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
          name="referral"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Место ссылки направления</FormLabel>
              <FormControl>
                <Input
                  autoComplete="off"
                  placeholder="пока пусть только string отправляет"
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
          name="report"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Место ссылки отчета</FormLabel>
              <FormControl>
                <Input
                  autoComplete="off"
                  placeholder="пока пусть только string отправляет"
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
          name="academic_year"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Укажи свой курс</FormLabel>
              <FormControl>
                <Input
                  autoComplete="off"
                  placeholder="1"
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
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Диапазон дат практики</FormLabel>
              <FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant={"outline"}
                      className={cn(
                        " justify-start text-left font-normal",
                        !form.watch().date && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        form.watch().date.to ? (
                          <>
                            {format(form.watch().date.from, "dd LLLL y", {
                              locale: ru,
                            })}
                            {` – `}
                            {format(form.watch().date.to, "dd LLLL y", {
                              locale: ru,
                            })}
                          </>
                        ) : (
                          format(form.watch().date.from, "dd LLLL y", {
                            locale: ru,
                          })
                        )
                      ) : (
                        <span>Выбери даты</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={form.watch().date?.from}
                      selected={field.value}
                      onSelect={field.onChange}
                      numberOfMonths={2}
                      locale={ru}
                    />
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-[300px]">{apprts.isLoading? "Loading...": "Submit"}</Button>
      </form>
    </Form>
  );
}
