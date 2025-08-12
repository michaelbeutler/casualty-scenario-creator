import { ScenarioForm } from "@/components/scenario-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const HomePage = async () => {
  return (
    <div className="h-full w-full xl:flex flex-row justify-between gap-4">
      <div className="h-full flex-1">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Customize</CardTitle>
            </div>
            <CardDescription>
              Customize your scenario and distribute.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScenarioForm
              symptoms={[
                {
                  id: "1",
                  name: "Headache",
                  description: "Pain in the head",
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
                {
                  id: "2",
                  name: "Nausea",
                  description: "Feeling of sickness",
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
              ]}
              mechanismOfInjury={[
                {
                  id: "1",
                  name: "Fall",
                  description: "Injury from falling",
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
                {
                  id: "2",
                  name: "Collision",
                  description: "Injury from collision",
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
              ]}
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
