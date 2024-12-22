import { Skeleton } from "@/components/ui/skeleton"


export const SkeletonNavbar = () => {
    return (
        <div className="border-b">

            <div className="flex h-16 items-center  px-4">

                <Skeleton className="w-52 h-7 " />
                <div className="flex gap-2 mx-6">
                    <Skeleton className="w-24 h-5 " />
                    <Skeleton className="w-24 h-5 " />
                    <Skeleton className="w-24 h-5 " />
                    <Skeleton className="w-24 h-5 " />
                    <Skeleton className="w-24 h-5 " />
                    <Skeleton className="w-24 h-5 " />
                </div>


                <div className="ml-auto flex items-center space-x-4">
                    <Skeleton className="w-7 h-7 " />
                    <Skeleton className="w-7 h-7 rounded-full" />
                </div>
            </div>

        </div>
    )
}