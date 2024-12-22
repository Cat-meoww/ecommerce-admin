import { SkeletonNavbar } from "@/components/loading/SkeletonNavbar";
import Navbar from "@/components/navbar";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";


export default async function DashboardLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ storeId: string }>
}) {

    const { userId } = await auth();

    if (!userId) redirect('/sign-in')


    const store = await prismadb.store.findFirst({
        where: {
            id: (await params).storeId,
            userId
        }
    });

    if (!store) redirect('/')


    return (
        <>
            <Suspense fallback={<SkeletonNavbar />}>
                <Navbar />
            </Suspense>
            {children}
        </>
    )
}