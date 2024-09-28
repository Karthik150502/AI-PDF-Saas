import { auth } from '@clerk/nextjs/server';
import { unstable_cache } from 'next/cache';
import { db } from './db';
import { chat } from './db/schema';
import { eq } from 'drizzle-orm';

export const getCachedUserChat = unstable_cache(
    async (id) => getChat(id),
    [], { tags: ['users-first-chat'], revalidate: 1800 }
);

export default async function getChat({ userid }: { userid: string }) {
    const singleChat = (await db.select().from(chat).where(eq(chat.userId, userid)))[0]
    console.log(singleChat)
    return singleChat
}