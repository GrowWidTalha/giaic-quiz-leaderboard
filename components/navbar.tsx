/**
 * v0 by Vercel.
 * @see https://v0.dev/t/tsiPcdNOyyK
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Code, Code2Icon, CodeSquareIcon } from "lucide-react"
import Link from "next/link"

export default function NavBar() {
  return (
    <header className="flex h-16 w-full items-center justify-between bg-background px-4 md:px-6">
      <Link href="/" className="flex items-center gap-2" prefetch={false}>
        <CodeSquareIcon className="h-6 w-6" />
        <span className="text-lg font-semibold">Prep Partners</span>
      </Link>
      <nav className="flex items-center gap-4">
        <Link href="https://www.youtube.com/@GIAICSeniorpartners" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
          YouTube
        </Link>
        <Link href="https://chat.whatsapp.com/IHLAC0KgfTNIIz7lxkmIgn" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
          Whatsapp Community
        </Link>
        <Link href="https://www.linkedin.com/in/growwithtalha-webdeveloper" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
          LinkedIn
        </Link>
        <Link href="/resources" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
          Resources
        </Link>
      </nav>
    </header>
  )
}
