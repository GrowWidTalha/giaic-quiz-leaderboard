"use client"
import { aggregateResponses, getUserDataByEmail } from "@/actions"
import { sheetConfigs } from "@/sheetConfig";
import ErrorPage from "@/components/error";
import Footer from "@/components/footer";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { User2 } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
  params: {
    email: string;
  }
}

export default function Component({ params }: Props) {
  const [data, setData] = useState<any>(null); // Use a specific type for data
  const [percentage, setPercentage] = useState<number>(0); // Initialize with a default value
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const decodedEmail = decodeURIComponent(params.email as string);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Start loading
        const aggregatedResponses = await aggregateResponses();
        const userData = await getUserDataByEmail(aggregatedResponses, decodedEmail);
        console.log('User Data:', userData);
        setData(userData);

        // Calculate percentage after userData is set
        const perc = getSinglePercentage(userData.quizzes);
        setPercentage(perc);

        setLoading(false); // Stop loading
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError(true); // Set error state if fetching fails
        setLoading(false); // Stop loading
      }
    };

    fetchData();
  }, [decodedEmail]);

  if (loading) {
    return <SearchPageSkeleton />;
  }

  if (error || !data || !data.quizzes) {
    return <ErrorPage />;
  }

  return (
    <div>
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 h-screen">
        <div className="bg-background rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback>
                <User2 />
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold">{data.name}</h2>
              <div className="text-3xl font-bold text-primary">{percentage}%</div>
              <div className="text-sm text-muted-foreground">{decodedEmail}</div>
            </div>
          </div>
        </div>
        <Card className="bg-background rounded-lg shadow-md p-6 col-span-2 lg:col-span-2 h-fit">
          <div>
            <h2 className="text-xl font-bold mb-4">Quizzes</h2>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quiz Name</TableHead>
                  <TableHead>Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.quizzes.map((quiz: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium text-md">{quiz.quizName}</TableCell>
                    <TableCell className="text-md font-bold text-primary">
                      {`${quiz.marks} / ${quiz.totalMarks}`}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
      <Footer />
    </div>
  );
}

const getSinglePercentage = (quizzes: { quizName: string; marks: number; totalMarks: number }[]) => {
  let totalAchieved = 0;
  let totalPossible = 0;

  quizzes.forEach(quiz => {
      totalAchieved += quiz.marks;
      totalPossible += quiz.totalMarks;
  });

  if (totalPossible === 0) return 0; // Handle case where totalPossible is zero to avoid division by zero

  const basePercentage = (totalAchieved / totalPossible) * 100;

  // Apply a factor based on the number of quizzes attempted
  const attemptFactor = quizzes.length / sheetConfigs.length;

  // Calculate final percentage incorporating the attempt factor
  const finalPercentage = basePercentage * attemptFactor;

  return parseInt(finalPercentage.toFixed());
  
};


const SearchPageSkeleton = () =>{
  return (
    <div className="flex flex-col p-5 md:flex-row w-full items-center justify-between">
      <div className="flex flex-col space-y-3">
      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
    <div className="flex flex-col space-y-3 w-full">
      <Skeleton className="h-[125px] w-full rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
    </div>
  )
}