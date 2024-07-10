/**
 * v0 by Vercel.
 * @see https://v0.dev/t/gMlaMFyOPoy
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import {
  LinkedinIcon,
  LucideYoutube,
  Puzzle,
  PuzzleIcon,
  YoutubeIcon,
} from "lucide-react";
import Link from "next/link";

interface IClassComponent {
  classTopic: string;
  classNumber: string;
  instructorName: string;
  linkedin: string;
  youtube: string;
  quiz: string;
}

export default function ClassComponent({
  classNumber,
  classTopic,
  instructorName,
  linkedin,
  quiz,
  youtube,
}: IClassComponent) {
  return (
    <div className="bg-background rounded-xl shadow-sm border border-input">
      <div className="p-0 sm:p-4 md:p-6">
        <div className="flex items-start justify-between mb-4 md:mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary rounded-full px-2 py-1 text-xs font-medium text-primary-foreground">
              {classNumber}
            </div>
            <h3 className="whitespace-break-spaces truncate font-normal text-base sm:text-xl sm:font-semibold ">
              {classTopic}
            </h3>
          </div>
          <div className=" items-center gap-2 hidden sm:flex">
            <Link
              href={youtube}
              className="text-muted-foreground hover:text-primary transition-colors"
              prefetch={false}
              target="_blank"
            >
              <YoutubeIcon className="w-5 h-5" />
            </Link>
            <Link
              href={quiz}
              className="text-muted-foreground hover:text-primary transition-colors"
              prefetch={false}
              target="_blank"
            >
              <PuzzleIcon className="w-5 h-5" />
            </Link>
            <Link
              href={linkedin}
              className="text-muted-foreground hover:text-primary transition-colors"
              prefetch={false}
              target="_blank"
            >
              <LinkedinIcon className="w-5 h-5" />
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 md:gap-6">
          <div>
            <p className="text-sm font-medium">Instructor</p>
            <p className="text-muted-foreground text-sm">{instructorName}</p>
          </div>
          <div className="w-9">
            <p className="text-sm font-medium mb-3">YouTube</p>
            <Link
              href={youtube}
              className="text-muted-foreground  truncate hover:text-primary transition-colors"
              prefetch={false}
              target="_blank"
            >
              <LucideYoutube />
            </Link>
          </div>
          <div>
            <p className="text-sm font-medium mb-3">Quiz</p>
            <Link
              href={quiz}
              className="text-muted-foreground truncate hover:text-primary transition-colors"
              prefetch={false}
              target="_blank"
            >
              <PuzzleIcon />
            </Link>
          </div>
          <div>
            <p className="text-sm font-medium mb-3">LinkedIn</p>
            <Link
              href={linkedin}
              className="text-muted-foreground hover:text-primary transition-colors"
              prefetch={false}
              target="_blank"
            >
              <LinkedinIcon />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
