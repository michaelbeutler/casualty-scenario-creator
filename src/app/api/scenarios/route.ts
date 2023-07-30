import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const scenario = await request.json();

  await prisma.scenario.create({
    select: {
      title: scenario.title,
    },
    data: {
      ...scenario,
      symptoms: {
        connect: scenario.symptoms.map((symptom: any) => ({ id: symptom })),
      },
    },
  });

  return NextResponse.json(scenario);
}
