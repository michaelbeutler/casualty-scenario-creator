"use client";
import React, { useRef, useState } from "react";
import { useCompletion } from "ai/react";
import { toast } from "./ui/use-toast";
import { useDebouncedCallback } from "use-debounce";
import { Textarea } from "./ui/textarea";

export enum KeyEnum {
  TAB = "Tab",
  ENTER = "Enter",
  ARROW_UP = "ArrowUp",
  ARROW_DOWN = "ArrowDown",
  ESC = "Escape",
}

export interface DataSourceItem {
  text: string;
  value: string | number;
  [key: string]: any;
}

export interface InlineAutoCompleteProps
  extends React.HTMLAttributes<HTMLTextAreaElement> {}

const InlineAutoComplete: React.FC<InlineAutoCompleteProps> = ({
  onChange,
  defaultValue,
  ...props
}) => {
  const [internal, setInternal] = useState<string>(String(defaultValue || ""));
  const { complete, completion, isLoading, stop } = useCompletion({
    api: "/api/completion",
    onResponse: (res) => {
      // trigger something when the response starts streaming in
      // e.g. if the user is rate limited, you can show a toast
      if (res.status === 429) {
        toast({
          title: "You are being rate limited. Please try again later.",
          variant: "destructive",
        });
      } else if (res.status === 401) {
        toast({
          title: "You are not logged in.",
          variant: "destructive",
        });
      }
    },
    onFinish: () => {
      // do something with the completion result
      toast({
        title: "Successfully generated completion!",
      });
    },
  });

  const handleInputChange = useDebouncedCallback((e) => {
    complete(e.target.value);
  }, 500);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (Object.values(KeyEnum).includes(e.key as KeyEnum)) {
      e.preventDefault();
    }

    switch (e.key) {
      case KeyEnum.TAB:
        if (!isLoading && !internal.includes(completion)) {
          if (onChange)
            onChange({
              ...e,
              // target: Object.assign(e.target, {
              //   value: e.currentTarget.value + " " + completion,
              // }),
              currentTarget: Object.assign(e.currentTarget, {
                value: e.currentTarget.value + " " + completion,
              }),
            });
        }
        break;
      case KeyEnum.ESC:
        stop();
        break;
      default:
        break;
    }
  };

  return (
    <div className="relative">
      <Textarea
        rows={10}
        {...props}
        className="relative z-10"
        onInput={(e) => {
          setInternal(e.currentTarget.value);
        }}
        defaultValue={internal}
        onKeyDown={handleKeyDown}
        onChange={(e) => {
          if (onChange) onChange(e);
          if (e.currentTarget.value.length > 4) handleInputChange(e);
        }}
      ></Textarea>
      <div className="absolute top-0 flex text-gray-300 min-h-[60px] w-full rounded-md border border-transparent bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
        {internal}{" "}
        {isLoading ? "Loading..." : completion.replaceAll("\n", "\n\n")}
      </div>
    </div>
  );
};

export default InlineAutoComplete;
