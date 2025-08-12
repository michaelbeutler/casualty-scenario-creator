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
                { id: "1", name: "Bewusstlosigkeit" },
                { id: "2", name: "Starke Blutung" },
                { id: "3", name: "Offene Fraktur" },
                { id: "4", name: "Atemnot" },
                { id: "5", name: "Schockzeichen" },
                { id: "6", name: "Verbrennungen" },
                { id: "7", name: "Penetrierende Thoraxverletzung" },
                { id: "8", name: "Schädel-Hirn-Trauma" },
              ]}
              mechanismOfInjury={[
                { id: "1", name: "Schussverletzung" },
                { id: "2", name: "Explosionsverletzung" },
                { id: "3", name: "Stumpfes Trauma" },
                { id: "4", name: "Verkehrsunfall" },
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
