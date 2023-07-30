import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DownloadIcon } from "@radix-ui/react-icons";
import Person from "./person";

const Preview = () => {
  return (
    <div className="flex flex-row gap-2 w-full">
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <CardDescription>Preview your changes.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-gray-500 px-4 py-2">
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
              Explosion Lorem Ipsum
            </h4>

            <AspectRatio ratio={1 / 1.41}>
              <Person />
            </AspectRatio>

            <div className="flex flex-row gap-2">
              <div className="bg-red-500 h-6 w-full"></div>
              <div className="bg-red-500 h-6 w-full"></div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button>
            <DownloadIcon className="mr-2 h-4 w-4" /> Download PDF
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Preview;
