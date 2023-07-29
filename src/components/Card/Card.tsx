import React from "react";
import Person from "../Person/Person";
import Icon from "../Icon/Icon";
import stc from "string-to-color";

export const mechanismOfInjury = [
  "Artillery",
  "Blunt",
  "Burn",
  "Fall",
  "Grenade",
  "GSW",
  "IDE",
  "Landmine",
  "MVC",
  "RPG",
  "Other",
];

const Card: React.FC<{
  conditions: { name: string; icon: string }[];
  title: string;
  description: string;
  moi: typeof mechanismOfInjury[number] | null;
  hr: number;
  bp: string;
  o2: number;
  rr: number;
  pain: number;
}> = ({ conditions, title, description, moi, hr, bp, o2, rr, pain }) => {
  return (
    <div className="py-4 px-6 items-start flex flex-col gap-2">
      <h1 className="text-xl font-bold mb-4">{title}</h1>
      <Person />
      <div className="flex flex-row gap-2 mb-4">
        {conditions.map((condition) => (
          <div
            key={condition.name}
            className="flex flex-col gap-1 justify-center border-2 px-2 pb-2"
            style={{
              borderColor: stc(condition.icon),
            }}
          >
            <Icon icon={condition.icon} />
            <span className="text-xs text-center">{condition.name}</span>
          </div>
        ))}
      </div>

      <p className="prose mb-3">{description}</p>

      <div className="flex flex-row gap-4">
        <div>
          <b>MOI: </b> {moi !== null ? moi : "n/a"}
        </div>
        <div>
          <b>HR: </b> {hr}
        </div>
        <div>
          <b>BP: </b> {bp}
        </div>
        <div>
          <b>O2: </b> {o2}%
        </div>
        <div>
          <b>RR: </b> {rr}
        </div>
        <div>
          <b>Pain Scale:</b> {pain}/10
        </div>
      </div>
    </div>
  );
};

export default Card;
