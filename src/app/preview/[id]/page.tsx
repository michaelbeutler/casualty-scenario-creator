import Person from "@/components/person";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { prisma } from "@/lib/prisma";
import React from "react";

const PreviewPage = async ({ params }: { params: { id: string } }) => {
  const scenario = await prisma.scenario.findUnique({
    where: { id: params.id },
  });

  if (!scenario) {
    return <div>Scenario not found. <Skeleton className="h-12 w-14" /></div>;
  }

  return (
    <div className="flex flex-col px-24 items-center">
      <div className="mx-auto my-24 w-[148.5mm] h-[210mm] bg-white shadow-md flex flex-col px-[1cm] py-[1cm] items-center gap-4">
        <h1>{scenario?.title}</h1>
        <Person annotations={scenario.annotations as any} />
        <p>{scenario?.description}</p>
      </div>
      <div className="max-w-24">
        <Button>Download PDF</Button>
      </div>
    </div>
  );
};

export default PreviewPage;
