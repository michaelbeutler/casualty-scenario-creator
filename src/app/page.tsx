import { ScenarioForm } from "@/components/scenario-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

const HomePage = async () => {
  const symptoms = await prisma.symptom.findMany();
  const mechanismOfInjury = await prisma.mechanismOfInjury.findMany();

  return (
    <div className="h-full w-full xl:flex flex-row justify-between gap-4">
      <div className="h-full flex-1">
        <Card>
          <CardHeader>
            <CardTitle>Customize</CardTitle>
            <CardDescription>
              Customize your scenario and distribute.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScenarioForm
              symptoms={symptoms}
              mechanismOfInjury={mechanismOfInjury}
            />
          </CardContent>
        </Card>
      </div>
      {/* <div className="h-full">
        <Preview />
      </div> */}
    </div>
  );
};

export default HomePage;
