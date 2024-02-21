import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";

import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { useEffect, useState, useId, useRef } from "react";
import autoAnimate from "@formkit/auto-animate";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import {Institution} from "@/server/schema/institution";
import {Curator, CuratorForm} from "@/server/schema/curator";
import { X } from "lucide-react";



const CuratorEditForm = ({onCreate, data}:{onCreate: Function, data: Curator }) => {
    const parent = useRef(null);

    useEffect(() => {
        parent.current && autoAnimate(parent.current);
    }, [parent]);

    const form = useForm<CuratorForm>({
        defaultValues: {
            id: data.id ,
            // group_url: data.group_url.join(","),
            telegram_id: data.telegram_id,
            FIO: data.FIO,
        },
        reValidateMode: "onChange"
    });

    const curatorMutation = api.curators.updateCurator.useMutation({ onSuccess: () => onCreate(), onError: console.error })


    function handleSubmit(data: CuratorForm): void {
        // console.log(JSON.stringify(data));
        // console.log(JSON.stringify(data));
        // // const { group_url, ...rest } = data;
        // let newUrl: any = group_url;
        // newUrl = newUrl.split(",");
        // console.log({ ...rest, group_url: newUrl})
        // curatorMutation.mutate({ ...rest, group_url: newUrl });

        console.log(JSON.stringify(data));

        let newUrls: any = links.map(el => ({...el, id: el.group_link+data.id}));

        console.log({ ...data, group_links: newUrls })
        curatorMutation.mutate({ ...data, group_links: newUrls });
        // institutionEditMutation.mutate(data);
    }

    interface ILink {
        group_link: string;
        group_name: string;
        curatorId?: string;
        id?: string;
    }

    const [links, setLinks] = useState<ILink[]>(data.group_links);
    const [newLink, setNewLink] = useState<ILink>({
        group_link: "",
        group_name: "",
    })


    return <Form {...form}>
        <form autoComplete="off" className="flex flex-col w-72 gap-2" onSubmit={form.handleSubmit(handleSubmit)} ref={parent}>
            <FormField
                control={form.control}
                name="telegram_id"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Telegram ID</FormLabel>
                        <Input autoFocus autoComplete="off" aria-autocomplete="none" placeholder="Введите id" {...field} />
                    </FormItem>
                )} />
            <FormField
                control={form.control}
                name="FIO"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>FIO</FormLabel>
                        <Input autoFocus autoComplete="off" aria-autocomplete="none" placeholder="Введите ФИО" {...field} />
                    </FormItem>
                )} />
            <FormItem>
                    <FormLabel>Added links</FormLabel>

                {links.map(el => (<div className="px-[4px]" key={el.group_link}>
                        <div className="font-bold flex"><span>{el.group_name}</span> <X className="hover:cursor-pointer" onClick={e => {


                            setLinks(links.filter(link => link.group_link !== el.group_link))
                        }}/></div>
                        <div>{el.group_link}</div>
                    </div>)
                )}

                {!links.length && <div className="italic">No links added</div>}
                </FormItem>

                <FormItem>
                    <FormLabel>Add new link</FormLabel>
                    <div className="flex items-center gap-[10px]">name<Input type={"text"} maxLength={20} minLength={1}  autoFocus autoComplete="off" aria-autocomplete="none" placeholder="имя группы" value={newLink.group_name} onChange={e => setNewLink({...newLink, group_name: e.target.value})} /></div>
                    <div className="flex items-center gap-[10px]">link <Input type={"url"}   autoFocus autoComplete="off" aria-autocomplete="none" placeholder="ссылка на группу" value={newLink.group_link} onChange={e => setNewLink({...newLink, group_link: e.target.value})} /></div>
                    <Button type="button" onClick={(e) => {
                        e.preventDefault();
                        setLinks([...links, newLink]);
                        setNewLink({group_link: "", group_name: ""});
                    }}
                    >Add</Button>

                </FormItem>
            <Button type="submit">{curatorMutation.isLoading ? "Submitting..." : "Submit"}</Button>
        </form>
    </Form>
}

export default CuratorEditForm;
