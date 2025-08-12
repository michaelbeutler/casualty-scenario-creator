import React from "react";
import { Symptom, MechanismOfInjury } from "@prisma/client";
import Person from "./person";

interface PDFPreviewProps {
  title: string;
  description: string;
  symptoms: Symptom[];
  mechanismOfInjury: MechanismOfInjury;
  annotations: { x: number; y: number }[];
}

const PDFPreview: React.FC<PDFPreviewProps> = ({
  title,
  description,
  symptoms,
  mechanismOfInjury,
  annotations,
}) => {
  return (
    <div
      id="pdf-content"
      className="w-[148mm] h-[210mm] p-4 bg-white text-black text-sm"
    >
      <h1 className="text-xl font-bold mb-2">{title}</h1>
      <div className="max-w-[350px] border-2 border-gray-500 p-4 flex justify-center mb-4">
        <Person annotations={annotations} />
      </div>
      <p className="mb-2">{description}</p>
      <div className="flex flex-row gap-2">
        <div>
          <b>MOI: </b> {mechanismOfInjury.name}
        </div>
        <div>
          <b>Symptoms: </b> {symptoms.map((s) => s.name).join(", ")}
        </div>
      </div>
    </div>
  );
};

export default PDFPreview;
