import React, { useState } from "react";

export const PartKit = () => {
  const [isEdit, setIsEdit] = useState(false);

  return (
    <>
      <div className="w-full border-2 rounded-t-sm">
        <div className="bg-gray-400 text-black px-5 py-2 rounded-t-sm">
          Add Part
        </div>

        <div className="mx-4 mt-2 mb-2">
          <div className="mb-2">
            <label htmlFor="Kit_ItemCode" className="label-style">
              Kit_ItemCode
            </label>
            <input
              id="Kit_ItemCode"
              name="Kit_ItemCode"
              placeholder="Enter ItemCode."
              className="input-style"
            />
          </div>

          <div className="mb-2">
            <label htmlFor="Kit_ItemName" className="label-style">
              Kit_ItemName
            </label>
            <input
              id="Kit_ItemName"
              name="Kit_ItemName"
              placeholder="Enter ItemCode."
              className="input-style"
            />
          </div>

          <div className="mb-2">
            <label htmlFor="Kit_MinWeight" className="label-style">
              Min Weight
            </label>
            <input
              id="Kit_MinWeight"
              name="Kit_MinWeight"
              placeholder="Kit Min Weight."
              className="input-style"
            />
          </div>

          <div className="mb-2">
            <label htmlFor="Kit_MaxWeight" className="label-style">
              Max Weight
            </label>
            <input
              id="Kit_MaxWeight"
              name="Kit_MaxWeight"
              placeholder="Kit Max Weight."
              className="input-style"
            />
          </div>

          <div className="mb-2">
            <label htmlFor="Kit_MaxWeight" className="label-style">
              Rate/Kit
            </label>
            <input
              id="Kit_MaxWeight"
              name="Kit_MaxWeight"
              placeholder="Kit Rate."
              className="input-style"
            />
          </div>

          <button
            className={`${
              isEdit
                ? "bg-yellow-400"
                : "bg-green-500 text-white  rounded-sm hover:bg-green-400 "
            } w-full px-2 py-1`}
          >{`${isEdit ? "Update" : "Save"}`}</button>
        </div>
      </div>
    </>
  );
};
