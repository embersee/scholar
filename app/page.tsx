import { ThemeToggle } from "@/components/utils/ThemeToggle";
import { env } from "@/env.mjs"
import Image from "next/image";
import EnterButton from "./EnterButton";
// Test Comment 
// Test Comment 2

export default async function Home() {
  return (
    <main className="flex bg-[#EAEAEA]  min-h-screen flex-col items-center  dark:bg-[#1F1E1F] transition-all ">
      <header
        className="z-10 max-w-[1320px] w-full items-center justify-between text-sm flex pt-[20px] px-[30px] md:px-[60px] lg:px-[100px]  ">
        <button className=" md:text-[26px] font-semibold max-[300px]:w-full">
          <p className={'px-[12px] md:px-[20px] py-[14px] md:py-[22px] rounded-xl bg-white dark:bg-[#2C2C2C] transition-all'}>Практика.ру</p>
        </button>
        <div className="h-10  bg-white dark:bg-[#2C2C2C] rounded-md" >
          <ThemeToggle />
        </div>
      </header>
      <section
        className={"flex pb-12 md:pb-0 gap-[77px] max-w-[1100px] px-[30px] items-center mt-[100px] max-[1000px]:flex-col mb-[48px] max-[375px]:pb-0"}>
        <p className={"font-light xl:max-w-[700px] lg:max-w-[600px] md:max-w-[500px] xl:text-[24px] 2xl:text-[26px] lg:text-[20px]  md:text-[18px] text-[16px] "}>
          <span className={"text-[#9381FF]"}>{`Практика.ру`}</span> – это место, где вы сможете
          найти задания, соответствующие вашим интересам и
          направлению обучения. Независимо от того, посвящена ли ваша специализация программированию,
          маркетингу, инженерии или любой другой области, у нас вы найдете полезные и актуальные
          задачи,
          которые помогут вам почувствовать себя профессионалом уже сейчас.
        </p>
        <EnterButton botName={env.BOT_NAME} />
      </section>
      <div className="max-[375px]:hidden w-full flex items-center justify-center">
        <Image
          className="xl:max-w-screen-lg  p-4 rounded-xl bg-white dark:bg-[#2C2C2C] lg:max-w-screen-md mx-auto transition-all"
          src={"/people.png"}
          alt={"people"}
          layout="responsive"
          width={1}
          height={1}
        />
      </div>
    </main>
  );
}

