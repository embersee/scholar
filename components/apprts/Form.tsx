"use client";

import { useForm } from "react-hook-form";
import {
  ApprenticeshipForm,
  apprenticeshipFormSchema,
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

export default function ApprtsForm({session}: {session: any}) {
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
      FIO: "",
      phone_number: "",
      institution: "",
      specialty: "",
      academic_year: "",
      apprenticeship_type: "",
      // date: {
      //   from: undefined,
      //   to: undefined,
      // },
    },
    reValidateMode: "onChange",
  });

  // TODO: get data for institutions
  const apprts = api.apprts.createApprenticeship.useMutation({
    onSuccess: ()=> alert("success!!!"),
    onError: (e)=> {
      alert("Error");
      console.error(e);
    }
  });

  async function handleSubmit(data: ApprenticeshipForm) {
    const userId = session.data?.user.id as string;
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
          name="FIO"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display name</FormLabel>
              <FormControl>
                <Input
                  className="w-[300px]"
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
                  className="w-[300px]"
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
              <FormLabel>Учебное заведение</FormLabel>
              <FormControl>
                <Combobox
                  placeholder="Select university"
                  options={[
                    {
                      value: "СПбГУТ им. М.А. Бонч-Бруевича",
                      label: "СПбГУТ им. М.А. Бонч-Бруевича",
                    },
                    {
                      value: "sveltekit",
                      label: "SvelteKit",
                    },
                    {
                      value: "nuxt.js",
                      label: "Nuxt.js",
                    },
                    {
                      value: "remix",
                      label: "Remix",
                    },
                    {
                      value: "astro",
                      label: "Astro",
                    },
                  ]}
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
          name="specialty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Specialty</FormLabel>
              <FormControl>
                <Input
                  className="w-[300px]"
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

        <FormField
          control={form.control}
          name="apprenticeship_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Вид практики</FormLabel>
              <FormControl>
                <Combobox
                  placeholder="Select apprenticeship"
                  options={[
                    {
                      value: "Дипломная",
                      label: "Дипломная",
                    },
                    {
                      value: "Преддипломная",
                      label: "Преддипломная",
                    },
                    {
                      value: "Производственная",
                      label: "Производственная",
                    },
                    {
                      value: "Учебная",
                      label: "Учебная",
                    },
                    {
                      value: "Производственная (UI/UX + CSS)",
                      label: "UI/UX",
                    }
                  ]}
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
              <FormLabel>Курс</FormLabel>
              <FormControl>
                <Input
                  className="w-[300px]"
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
              <FormLabel>Даты практики</FormLabel>
              <FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant={"outline"}
                      className={cn(
                        "w-[300px] justify-start text-left font-normal",
                        !form.watch().date && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        form.watch().date.to ? (
                          <>
                            {format(form.watch().date.from, "dd LLLL y", {
                              locale: ru,
                            })}{" "}
                            -{" "}
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
                        <span>Pick a date</span>
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
