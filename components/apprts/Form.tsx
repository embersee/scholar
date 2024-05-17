"use client";

import { useForm } from "react-hook-form";
import {
  ApprenticeshipForm,
  apprenticeshipFormSchema,
  ApprenticeshipTypes,
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
import { useEffect, useRef, useState } from "react";
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
import { useRouter } from "next/navigation";
import { toast } from "../ui/use-toast";

export default function ApprtsForm(props: {
  apprenticeshipTypes: ApprenticeshipTypes[];
}) {
  const router = useRouter()
  const parent = useRef(null);

  const [referralFile, setReferralFile] = useState<File|null>(null);
  const currentApprenticeship = api.apprts.getCurrentApprenticeship.useQuery();

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
      apprenticeshipTypeId: "",
      // date: {
      //   from: undefined,
      //   to: undefined,
      // },
    },
    reValidateMode: "onSubmit",
  });

  const apprtsTypes = props.apprenticeshipTypes.map((v) => ({
    value: v.id as string,
    label: v.name,
  }));

  const apprts = api.apprts.createApprenticeship.useMutation({
    onMutate: () => {
      toast({
        title: '🔄 Создание...',
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
        description: 'Тип практики успешно создан'
      })
      form.reset();
      router.push("/dash/apprts")
    },
  });

  async function handleSubmit(data: ApprenticeshipForm) {
    console.log(data);

    try {
    if (!referralFile) throw new Error("Прикрепите файл направления"); 

    // Дополнительная проверка на клиенте, чтобы исключить лишнюю отправку файлов на файл сервер.
    if (!!currentApprenticeship.data) throw new Error("У вас уже есть одна активная практика, снаала завершите ее ;)");

    const referralFormData = new FormData();
    referralFormData.append("file[]", referralFile);
    referralFormData.append("system", "scholar");
    referralFormData.append("path", "");
    referralFormData.append("name", "referral");

    const referralResponse = await fetch(`http://127.0.0.11:8000/api/upload`, {
      method: "POST",
      mode: "cors",
      body: referralFormData,
    })

    if (referralResponse.ok){
      const referralResponseData = await referralResponse.json();
      console.log("Accepted referral", referralResponseData);

      if (referralResponseData.length<1 )
        throw new Error("Failed to save file");

      apprts.mutate({ 
        ...data, 
        referral: `http://127.0.0.11:8000/api/files/${referralResponseData[0].id}`, 
      });
    }
    else throw new Error("Failed to fetch file");
  }
  catch (e: any) {
    toast({
      title: '🚫 Ошибка',
      description: e?.message
    })
  }

  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          autoComplete="off"
          className="flex grow flex-col justify-start items-center gap-4"
          ref={parent}
        >
          <FormField
            control={form.control}
            name="apprenticeshipTypeId"
            render={({ field }) => (
              <FormItem className="w-72">
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
              <FormItem className="w-72">
                <FormLabel>Место ссылки направления</FormLabel>
                <FormControl>
                  <Input type="file"
                    accept=".jpg, .jpeg, .png, .svg, .gif, .mp4"
                    onChange={e => e.target.files? setReferralFile(e.target.files[0]): null} />
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
              <FormItem className="w-72">
                <FormLabel>Укажи свой курс</FormLabel>
                <FormControl>
                  <Input
                    className="w-[100%]"
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
              <FormItem className="w-72">
                <FormLabel>Диапазон дат практики</FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                          " justify-start text-left font-normal w-[100%]",
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
          <Button disabled={apprts.isLoading} type="submit" className="w-[300px]">{apprts.isLoading ? "Loading..." : "Submit"}</Button>
        </form>
      </Form>
    </>
  );
}