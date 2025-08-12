import React from "react";
import Person from "./person";

interface TCCCSymptom {
  id: string;
  name: string;
}

interface TCCCMechanismOfInjury {
  id: string;
  name: string;
}

interface PDFPreviewProps {
  title: string;
  injuries: string;
  symptoms: TCCCSymptom[];
  mechanismOfInjury: TCCCMechanismOfInjury;
  annotations: { x: number; y: number }[];
}

const PDFPreview: React.FC<PDFPreviewProps> = ({
  title,
  injuries,
  symptoms,
  mechanismOfInjury,
  annotations,
}) => {
  return (
    <div
      id="pdf-content"
      className="w-[148mm] h-[210mm] p-4 bg-white text-black text-sm"
    >
      <h2 className="text-lg font-bold mb-2">{title}</h2>

      <div className="max-w-[350px] border-2 border-gray-500 p-4 flex justify-center mb-4">
        <Person annotations={annotations} />
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <h3 className="font-bold text-md mb-1">M - Mechanism of Injury</h3>
          <p className="pl-2">{mechanismOfInjury.name}</p>
        </div>
        <div>
          <h3 className="font-bold text-md mb-1">I - Injuries</h3>
          <p className="pl-2">{injuries}</p>
        </div>
        <div>
          <h3 className="font-bold text-md mb-1">S - Signs and Symptoms</h3>
          <p className="pl-2">{symptoms.map((s) => s.name).join(", ")}</p>
        </div>
      </div>
    </div>
  );
};

export default PDFPreview;
