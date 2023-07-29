import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import React, { useState } from "react";
import Card, { mechanismOfInjury } from "./components/Card/Card";

const symptoms = [
  {
    name: "Bleeding",
    icon: "body/blood_drop.svg",
  },
  {
    name: "Unconscious",
    icon: "emotions/dizzy.svg",
  },
  {
    name: "Talking",
    icon: "people/speech_language_therapy.svg",
  },
  {
    name: "Joints",
    icon: "body/joints.svg",
  },
];

const App = () => {
  const [title, setTitle] = useState("Explosionstrauma");
  const [description, setDescription] = useState(
    "Eine Truppeneinheit gerät in einen Sprengstoffanschlag und mehrere Soldaten erleiden Verletzungen durch die Explosion."
  );
  const [bp, setBp] = useState("120/80");
  const [hr, setHr] = useState("80");
  const [o2, setO2] = useState("80");
  const [rr, setRr] = useState("20");
  const [pain, setPain] = useState(5);

  const [conditions, setConditions] = useState<
    { name: string; icon: string }[]
  >([]);
  const [moi, setMoi] = useState<typeof mechanismOfInjury[number] | null>(
    "IED"
  );
  const printRef = React.useRef<HTMLDivElement>(null);

  const handleDownloadPdf = async () => {
    const element: any = printRef.current;
    const canvas = await html2canvas(element);
    const data = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    const imgProperties = pdf.getImageProperties(data);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

    pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${title}.pdf`.replaceAll(" ", "_"));
  };

  return (
    <div className="flex flex-row justify-between h-screen bg-gray-100">
      <div className="py-4 px-6 flex-col gap-4 flex-1">
        <h1 className="text-2xl font-bold">Configure</h1>

        <label className="mt-4">
          <span className="text-gray-700">Title</span>
          <input
            type="text"
            className="mt-1 block w-full"
            placeholder=""
            defaultValue={title}
            onInput={(e) => {
              setTitle(e.currentTarget.value);
            }}
          />
        </label>

        <label className="mt-4">
          <span className="text-gray-700">Description</span>
          <textarea
            className="mt-1 block w-full"
            rows={5}
            onInput={(e) => {
              setDescription(e.currentTarget.value);
            }}
          >
            {description}
          </textarea>
        </label>

        <div className="flex flex-row gap-1">
          <label className="mt-4">
            <span className="text-gray-700">HR</span>
            <input
              type="number"
              className="mt-1 block w-full"
              placeholder=""
              defaultValue={hr}
              onInput={(e) => {
                setHr(e.currentTarget.value);
              }}
            />
          </label>
          <label className="mt-4">
            <span className="text-gray-700">BP</span>
            <input
              type="text"
              className="mt-1 block w-full"
              placeholder=""
              defaultValue={bp}
              onInput={(e) => {
                setBp(e.currentTarget.value);
              }}
            />
          </label>
          <label className="mt-4">
            <span className="text-gray-700">O2</span>
            <input
              type="number"
              className="mt-1 block w-full"
              placeholder=""
              defaultValue={o2}
              onInput={(e) => {
                setO2(e.currentTarget.value);
              }}
            />
          </label>
          <label className="mt-4">
            <span className="text-gray-700">RR</span>
            <input
              type="number"
              className="mt-1 block w-full"
              placeholder=""
              defaultValue={rr}
              onInput={(e) => {
                setRr(e.currentTarget.value);
              }}
            />
          </label>
        </div>

        <div className="mt-4">
          <label>
            <span className="text-gray-700">Pain Scale {pain}</span>
            <input
              type="range"
              min={1}
              max={10}
              step={1}
              className="mt-1 block w-full"
              placeholder=""
              defaultValue={pain}
              onInput={(e) => {
                setPain(Number(e.currentTarget.value));
              }}
            />
          </label>
        </div>

        <div className="grid grid-cols-4 gap-1 mt-4">
          {symptoms.map((key) => (
            <div className="" key={key.icon}>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={conditions.includes(key)}
                  value={key.name}
                  name={key.name}
                  onChange={(e) => {
                    if (conditions.includes(key)) {
                      setConditions(
                        conditions.filter((condition) => condition !== key)
                      );
                      return;
                    }
                    setConditions([...conditions, key]);
                  }}
                />
                <span className="ml-2">{key.name}</span>
              </label>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-4 gap-1 mt-4">
          {mechanismOfInjury.map((key) => (
            <div className="" key={key}>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  checked={moi === key}
                  value={key}
                  name="moi"
                  onChange={(e) => {
                    setMoi(e.target.value);
                  }}
                />
                <span className="ml-2">{key}</span>
              </label>
            </div>
          ))}
        </div>

        <button
          onClick={handleDownloadPdf}
          className="px-4 py-1 bg-blue-500 text-white hover:bg-blue-600 mt-4"
        >
          Download
        </button>
      </div>
      <div ref={printRef} className="w-[800px]">
        <Card
          title={title}
          description={description}
          conditions={conditions}
          moi={moi}
          hr={Number(hr)}
          bp={bp}
          o2={Number(o2)}
          rr={Number(rr)}
          pain={pain}
        />
      </div>
    </div>
  );
};

export default App;
