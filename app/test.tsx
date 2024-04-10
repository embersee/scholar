"use client";

import { api } from "@/trpc/react";

export default function Test() {
  const { mutate, data } = api.hello.mutateHello.useMutation();

  return <button onClick={() => mutate()}>hello{JSON.stringify(data)}</button>;
}
