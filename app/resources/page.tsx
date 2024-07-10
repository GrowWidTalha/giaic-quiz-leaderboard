import { links } from "@/classList";
import ClassComponent from "@/components/classComponent";
import React from "react";

const ResourcesPage = () => {
  return (
    <section className="w-full max-w-4xl mx-auto py-12 md:py-16 lg:py-20">
      <div className="px-4 md:px-6">
        <div className="mb-8 md:mb-10 lg:mb-12">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            Available Classes
          </h2>
          <p className="text-muted-foreground mt-2 text-sm md:text-base">
            Explore our collection of educational resources.
          </p>
        </div>
        <div className="grid gap-6 md:gap-8 lg:gap-10">
          {links.map((link) => (
            <ClassComponent
              key={link.className}
              classNumber={link.className}
              classTopic={link.topic}
              instructorName={link.teacherName}
              linkedin={link.teacherLinkedIn}
              quiz={link.quizLink}
              youtube={link.youtubeLink}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResourcesPage;
