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
import { DownloadIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Person from "./person";
import InlineAutoComplete from "./inline-autocomplete";
import { Switch } from "./ui/switch";
import React, { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import PDFPreview from "./pdf-preview";
import { createRoot } from "react-dom/client";

const FormSchema = z.object({
  title: z
    .string()
    .min(2, {
      message: "Title must be at least 2 characters.",
    })
    .max(35, {
      message: "Title must be at most 20 characters.",
    }),
  injuries: z
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

interface TCCCSymptom {
  id: string;
  name: string;
}

interface TCCCMechanismOfInjury {
  id: string;
  name: string;
}

export const ScenarioForm: React.FC<{
  symptoms: TCCCSymptom[];
  mechanismOfInjury: TCCCMechanismOfInjury[];
}> = ({ symptoms, mechanismOfInjury }) => {
  const [enableAI, setEnableAI] = useState<boolean>(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      injuries: "",
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

  const handleDownload = async () => {
    const data = form.getValues();
    const selectedSymptoms = symptoms.filter((s) =>
      data.symptoms.includes(s.id)
    );
    const selectedMechanism = mechanismOfInjury.find(
      (m) => m.id === data.mechanismOfInjury
    );

    if (!selectedMechanism) {
      toast({
        title: "Mechanism of injury not selected",
        description: "Please select a mechanism of injury to generate the PDF.",
        variant: "destructive",
      });
      return;
    }

    const previewContainer = document.createElement("div");
    previewContainer.style.position = "absolute";
    previewContainer.style.left = "-9999px";
    document.body.appendChild(previewContainer);

    const root = createRoot(previewContainer as HTMLElement);
    root.render(
      <PDFPreview
        title={data.title}
        injuries={data.injuries}
        symptoms={selectedSymptoms}
        mechanismOfInjury={selectedMechanism}
        annotations={data.annotations}
      /> as any
    );

    await new Promise((resolve) => setTimeout(resolve, 500));

    const canvas = await html2canvas(
      previewContainer.querySelector("#pdf-content") as HTMLElement
    );
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a5",
    });
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    const pdfBlob = pdf.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl);
    URL.revokeObjectURL(pdfUrl);

    document.body.removeChild(previewContainer);
  };

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
              name="injuries"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Injuries</FormLabel>
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
                            <RadioGroupItem value={mechanism.id} />
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

        <Button type="button" onClick={handleDownload}>
          <DownloadIcon className="mr-2 h-4 w-4" /> Download PDF
        </Button>
      </form>
    </Form>
  );
};
