"use client"
/**
 * v0 by Vercel.
 * @see https://v0.dev/t/kQ9047gEF1W
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface TopTenI {
  name: string;
  email: string;
  percentage: number;
}

export default function TopTenBoard({ topTenPlayers }: { topTenPlayers: TopTenI[] }) {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const onClick = () => {
    if (!email) return;
    router.push(`/s/${email}`);
  };

  // Uncomment and use the loading state if needed
  // if (!topTenPlayers) {
  //   return "loading...";
  // }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="mb-5">Top Ten Students</CardTitle>
        <div className="flex w-full gap-2">
          <Input type="email" className="rounded-md rounded" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email to check your progress" />
          <Button onClick={onClick} className="rounded-md rounded">Search</Button> {/* Add button text */}
        </div>
      </CardHeader>
      <hr />
      <CardContent className="mt-3">
        <div className="grid gap-4">
          {topTenPlayers.map((player, index) => (
            <div key={index} onClick={() => router.push(`/s/${player.email}`)}  className="grid grid-cols-[auto,1fr,1fr,auto] items-center gap-4"> {/* Add a key prop */}
              <div className="bg-primary text-primary-foreground rounded-full px-3 py-1 font-medium">
                {index + 1}
              </div>
              <div className="flex items-center gap-3">
                <div>
                  <div className="font-medium">{player.name}</div>
                  <div className="text-muted-foreground text-sm">{player.email}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">{player.percentage}%</div>
                <div className="text-muted-foreground text-sm">Score</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
