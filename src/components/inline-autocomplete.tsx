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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
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

  const acceptCompletion = () => {
    if (!isLoading && !internal.includes(completion)) {
      const newValue = internal + " " + completion;
      if (textareaRef.current) {
        // Manually update the textarea's value
        textareaRef.current.value = newValue;

        // Create a synthetic event to trigger the parent form's onChange
        const event = new Event("change", { bubbles: true });
        Object.defineProperty(event, "target", {
          writable: false,
          value: { value: newValue },
        });
        Object.defineProperty(event, "currentTarget", {
          writable: false,
          value: { value: newValue },
        });

        // Dispatch the event
        if (onChange) {
          onChange(event as any);
        }
        setInternal(newValue);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === KeyEnum.TAB) {
      e.preventDefault();
      acceptCompletion();
    } else if (e.key === KeyEnum.ESC) {
      e.preventDefault();
      stop();
    }
  };

  return (
    <div className="relative">
      <Textarea
        ref={textareaRef}
        rows={10}
        {...props}
        className="relative z-10 bg-transparent"
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
      <div
        className="absolute top-0 flex text-gray-300 min-h-[60px] w-full rounded-md border border-transparent bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        onClick={acceptCompletion}
      >
        <span className="invisible">{internal} </span>
        {isLoading ? "Loading..." : completion.replaceAll("\n", "\n\n")}
      </div>
    </div>
  );
};

export default InlineAutoComplete;
