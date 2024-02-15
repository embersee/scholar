'use client'
import SignIn from "@/components/auth/SignIn"

import { useState } from "react";


const Enter = (props: { botName: string }) => {
  const [entered, setEntered] = useState(false);
  return (
    <>
      {!entered ?
        <button onClick={() => setEntered(true)} className={"bg-[#9381FF] font-bold text-nowrap  text-white rounded-[20px] xl:text-[18px] lg:text-[14px]  md:text-[20px] text-[16px] px-[20px] py-[18px] xl:px-[40px] xl:py-[24px]"}>
          <p>Получить задание</p>
        </button> :
        <SignIn botUsername={props.botName} />
      }
    </>
  )
}

export default Enter