"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { MechanismOfInjury, Symptom } from "@prisma/client";
import { DownloadIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Person from "./person";
import InlineAutoComplete from "./inline-autocomplete";
import { Switch } from "./ui/switch";
import { useState } from "react";

const FormSchema = z.object({
  title: z
    .string()
    .min(2, {
      message: "Title must be at least 2 characters.",
    })
    .max(35, {
      message: "Title must be at most 20 characters.",
    }),
  description: z
    .string()
    .min(20, {
      message: "Description must be at least 20 characters.",
    })
    .max(500, {
      message: "Description must be at most 500 characters.",
    }),
  symptoms: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
  mechanismOfInjury: z.string(),
  annotations: z
    .array(
      z.object({
        x: z.number(),
        y: z.number(),
      })
    )
    .min(0, {
      message: "You have to add at least one annotation.",
    }),
});

export const ScenarioForm: React.FC<{
  symptoms: Symptom[];
  mechanismOfInjury: MechanismOfInjury[];
}> = ({ symptoms, mechanismOfInjury }) => {
  const [enableAI, setEnableAI] = useState<boolean>(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      description: "",
      symptoms: [],
      mechanismOfInjury: "",
      annotations: [],
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });

    const res = await fetch("/api/scenarios", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (res.status !== 200) {
      toast({
        title: "Something went wrong.",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Explosion" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <>
                      {enableAI && <InlineAutoComplete {...field} />}
                      {!enableAI && <Textarea rows={10} {...field} />}
                    </>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Enable AI</FormLabel>
                <FormDescription>
                  Get AI generated text suggestions based on your current text.
                </FormDescription>
              </div>
              <FormControl>
                <Switch checked={enableAI} onCheckedChange={setEnableAI} />
              </FormControl>
            </FormItem>

            <FormField
              control={form.control}
              name="symptoms"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Symptoms</FormLabel>
                  </div>
                  <div className="grid xl:grid-cols-4 gap-1">
                    {symptoms.map((symptom) => (
                      <FormField
                        key={symptom.id}
                        control={form.control}
                        name="symptoms"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={symptom.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(symptom.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...field.value,
                                          symptom.id,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== symptom.id
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">
                                {symptom.name}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mechanismOfInjury"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Mechanism of injury</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      {mechanismOfInjury.map((mechanism) => (
                        <FormItem
                          className="flex items-center space-x-3 space-y-0"
                          key={mechanism.id}
                        >
                          <FormControl>
                            <RadioGroupItem value="all" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {mechanism.name}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="annotations"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Annotations</FormLabel>
                <div className="max-w-[500px] border-2 border-gray-500 p-4 flex justify-center">
                  <Person annotations={field.value} onChange={field.onChange} />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button>
          <DownloadIcon className="mr-2 h-4 w-4" /> Download PDF
        </Button>
      </form>
    </Form>
  );
};
function html2canvas(input: HTMLElement | null) {
  throw new Error("Function not implemented.");
}
