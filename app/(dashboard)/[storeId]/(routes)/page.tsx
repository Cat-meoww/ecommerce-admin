import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { CreditCard, IndianRupee, Package } from "lucide-react";
import { formatter } from "@/lib/utils";
import { Overview } from "@/components/overview";
import { getSalesCount } from "@/actions/get-sales-count";
import { getStockCount } from "@/actions/get-stock-count";
import { getTotalRevenue } from "@/actions/get-total-revenue";
import { getGraphRevenue } from "@/actions/get-graph-revenue";



interface DashboardLayoutProps {
    params: Promise<{ storeId: string }>,
}
export default async function DashboardPage({ params }: DashboardLayoutProps) {
    const slug = await params



    const totalRevenue = await getTotalRevenue(slug.storeId);
    const salesCount = await getSalesCount(slug.storeId);
    const stockCount = await getStockCount(slug.storeId)
    const graphRevenue = await getGraphRevenue(slug.storeId)


    return (
        <div className="flex-col">
            <div className="flex-1 p-8 pt-6 space-y-4">
                <Heading title="Dashboard" description="Overview of your store" />
                <Separator />


                <div className="grid grid-cols-3 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium">
                                Total Revenue
                            </CardTitle>
                            <IndianRupee className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatter.format(totalRevenue)}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium">
                                Sales
                            </CardTitle>
                            <CreditCard className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                +{salesCount}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium">
                                Products in Stock
                            </CardTitle>
                            <Package className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stockCount}
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <Overview data={graphRevenue} />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
} 