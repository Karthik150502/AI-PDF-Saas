import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { LogIn } from "lucide-react";
import { FileUpload } from "@/components/ui/file-upload";
import clsx from "clsx";
import "./globals.css"
import { checkSubscription } from "@/lib/subscription";
import SubscriptionButton from "@/components/subscriptionButton";

import GoToChats from "@/components/goToChats";
import { db } from "@/lib/db";
import { chat } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import LandingAnimation from "@/components/landingAnimation/LandingAnimation";
import { getCachedUserChat } from "@/lib/cache";
export default async function Page() {

  const { userId } = auth();
  const isAuth = !!userId
  // const chats = (await db.select().from(chat).where(eq(chat.userId, userId!)))[0]

  const chat = await getCachedUserChat(userId);
  const isPro = await checkSubscription();


  return (

    <main className={clsx("flex min-h-screen h-screen w-screen m-0 pb-0 pt-0 bg-gradient-to-br from-slate-200 from-20% via-teal-100 via-50% to-emerald-500 to-90 md:flex-col sm:flex-col lg:flex-row sm:justify-start sm:items-start md:justify-start md:items-start md:overflow-y-scroll sm:overflow-y-scroll main")}>

      <div className="lg:w-1/2 md:w-screen sm:w-screen min-h-screen flex flex-col items-center justify-center px-2">

        <div className="flex flex-col items-start justify-center text-start">
          <div
            className="flex items-center">
            <h1 className="text-5xl mr-2 font-extrabold drop-shadow-sm bg-transparent bg-clip-text">Chat with any PDF</h1>
            <UserButton signInUrl="" />
          </div>
          <div

            className="flex mt-1">
            {
              isAuth && chat && <GoToChats />
            }
            {
              <div className="ml-2">
                <SubscriptionButton isPro={isPro} />
              </div>
            }
          </div>


          <p className="max-w-xl text-lg mt-1 text-slate-600">How magical would it be if your study material could talk with you, and answer all your douts? Well say no more. </p>
          <div
            className="w-full mt-2">
            {
              isAuth ? <FileUpload /> : <Link href="sign-in"><Button className="rouded-full">Lets get started <LogIn strokeWidth={1} size={20} className="ml-1" /></Button></Link>
            }
          </div>

        </div>
      </div>

      <div className="lg:w-1/2 md:w-full sm:w-full min-h-screen flex flex-col items-center justify-center">
        <LandingAnimation />
      </div>
    </main>
  );
}

