import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export const RadioGroupModel = ({ radioData, radioValue,setRadioValue}) => {
   const customRadioStyle = "w-4 h-4 border-2 border-gray-800 rounded-full"; // big size & dark border
    
   return (
    <>
       <RadioGroup value={radioValue} onValueChange={(value)=>setRadioValue(value)}>
      <div className="flex items-center gap-3">
        <RadioGroupItem value="" id="radio_default" className={customRadioStyle} />
        <Label htmlFor="radio_default">None</Label>
      </div>
      {radioData.map((item, index) => {
        const itemId = `radio_${index}`;
        return (
          <div className="flex items-center gap-3" key={index}>
            <RadioGroupItem value={item} id={itemId} className={customRadioStyle} />
            <Label htmlFor={itemId} className="font-medium">{item}</Label>
          </div>
        );
      })}
    </RadioGroup>

      {/* <RadioGroup defaultValue="comfortable">
      <div className="flex items-center gap-3">
        <RadioGroupItem value="default" id="r1" />
        <Label htmlFor="r1">Default</Label>
      </div>
      <div className="flex items-center gap-3">
        <RadioGroupItem value="comfortable" id="r2" />
        <Label htmlFor="r2">Comfortable</Label>
      </div>
      <div className="flex items-center gap-3">
        <RadioGroupItem value="compact" id="r3" />
        <Label htmlFor="r3">Compact</Label>
      </div>
    </RadioGroup> */}
    </>
  );
};
