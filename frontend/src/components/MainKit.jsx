import React, { useEffect, useState } from "react";
import {
  Load_MainKit_Service,
  Save_MainKit_Service,
  Update_MainKit_Service,
} from "../services/MainKit_Service";
import { toast } from "react-toastify";

export const MainKit = () => {
  const parentKit_InitialValue = {
    id: "",
    bag_number: "",
    description: "",
    qty: "1",
    min_weight: "",
    max_weight: "",
    part_level: "P",
    parent_item_code: "",
    sub_assy: "",
    rate: "",
  };
  const [parentKitData, setParentKitData] = useState(parentKit_InitialValue);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiData, setApiData] = useState([]);

  const loadData = async () => {
    try {
      const result = Load_MainKit_Service();
      console.log("Load Data :", result);
    } catch (error) {
      console.log("Error Load Mainkit Data:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handle_InputChange = (e) => {
    const { name, value } = e.target;
    setParentKitData((preve) => ({
      ...preve,
      [name]: value,
    }));
  };

  const handle_FormSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (!isEdit) {
        // save function ...
        const result = await Save_MainKit_Service(parentKitData);
        console.log("result :", result);
        if (result) {
          toast.success("Save Success!");
        } else {
          toast.error("Save Fail!");
        }
      } else if (isEdit) {
        // update function ...
        const result = await Update_MainKit_Service(parentKitData);
        console.log("result :", result);
        if (result) {
          toast.success("Update Success!");
        } else {
          toast.error("Update Fail!");
        }
      }
    } catch (error) {
      console.log("Error :", error);
    } finally {
      setLoading(false);
      setParentKitData(parentKit_InitialValue);
    }
  };
  return (
    <>
      <div className="w-full border-2 rounded-t-sm">
        <div className="bg-gray-400 text-black px-5 py-2 rounded-t-sm">
          Add Main Kit
        </div>

        <div className="mx-4 mt-2 mb-2">
          <form onSubmit={handle_FormSubmit}>
            <div className="mb-2">
              <label htmlFor="bag_number" className="label-style">
                Bag Number
              </label>
              <input
                id="bag_number"
                name="bag_number"
                value={parentKitData.bag_number}
                onChange={handle_InputChange}
                placeholder="Enter ItemCode."
                className="input-style"
              />
            </div>

            <div className="mb-2">
              <label htmlFor="description" className="label-style">
                Description
              </label>
              <input
                id="description"
                name="description"
                value={parentKitData.description}
                onChange={handle_InputChange}
                placeholder="Enter Description."
                className="input-style"
              />
            </div>

            <div className="mb-2">
              <label htmlFor="min_weight" className="label-style">
                Min Weight
              </label>
              <input
                id="min_weight"
                name="min_weight"
                value={parentKitData.min_weight}
                onChange={handle_InputChange}
                placeholder="Kit Min Weight."
                className="input-style"
              />
            </div>

            <div className="mb-2">
              <label htmlFor="max_weight" className="label-style">
                Max Weight
              </label>
              <input
                id="max_weight"
                name="max_weight"
                value={parentKitData.max_weight}
                onChange={handle_InputChange}
                placeholder="Kit Max Weight."
                className="input-style"
              />
            </div>

            <div className="mb-2">
              <label htmlFor="rate" className="label-style">
                Rate/Kit
              </label>
              <input
                id="rate"
                name="rate"
                value={parentKitData.rate}
                onChange={handle_InputChange}
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
          </form>
        </div>

        <div></div>
      </div>
    </>
  );
};
