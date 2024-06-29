import Link from "next/link";
import { Button } from "./ui/button";

/**
 * v0 by Vercel.
 * @see https://v0.dev/t/KOCmLkjUtui
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
export default function Footer() {
    return (
      <footer className="z-10 bg-muted p-4 text-center text-muted-foreground">
        <p>Made with ❤️ by 
          <Link href={"https://www.linkedin.com/in/growwithtalha-webdeveloper"}>
          <Button variant={'link'}>
          
          GrowWithTalha</Button>
          </Link>
          </p>
      </footer>
    )
  }