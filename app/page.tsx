"use client"
import { aggregateResponses, calculatePercentages, getTopTen } from "@/actions"
import TopTenBoard from "@/components/TopTenBoard"
import Footer from "@/components/footer"
import { Skeleton } from "@/components/ui/skeleton"
import { useEffect, useState } from "react"

const MainPage = () => {
    const [topTen, setTopTen] = useState<any>()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const aggregatedData =  aggregateResponses().then(async(data) => {
                    const percentages = await calculatePercentages(data)
                    const topTenResults = await getTopTen(percentages)
                    setTopTen(topTenResults)
                      
                })
            } catch (error) {
                console.log("something went wrong")
            }
        }
        fetchData()
    }, [])
    if(!topTen){
        return <MainSkeleton />
    }
    return (
        <div>
            <div className="flex items-start justify-center w-full mb-4">
                <TopTenBoard topTenPlayers={topTen}/>
            </div>
            <Footer />
        </div>
    )
}

export default MainPage

const MainSkeleton = () => {
    return <div className="w-full p-5 flex flex-col justify-center h-screen items-center gap-4">
        <Skeleton className="h-20 w-1/2 rounded-md" />
        <Skeleton className="h-12 w-1/2 rounded-md" />
        <Skeleton className="h-12 w-1/2 rounded-md" />
        <Skeleton className="h-12 w-1/2 rounded-md" />
        <Skeleton className="h-12 w-1/2 rounded-md" />
        <Skeleton className="h-12 w-1/2 rounded-md" />
        <Skeleton className="h-12 w-1/2 rounded-md" />
        <Skeleton className="h-12 w-1/2 rounded-md" />
        <Skeleton className="h-12 w-1/2 rounded-md" />
        <Skeleton className="h-12 w-1/2 rounded-md" />


    </div> 
}