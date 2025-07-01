// useWeightService.js
import { useState, useEffect } from "react";
import { safeCall, GET_Api } from "../services/ApiService";
import { toast } from "react-toastify";

export const useWeightService = () => {
  const [weight, setWeight] = useState(0);
  const [port, setPort] = useState(null);

  const Get_Weight = async () => {
    try {
      const weight_url = import.meta.env.VITE_SCALE_URL;
      const result = await safeCall(() => GET_Api(`${weight_url}/api/weight`));

      console.log("WeightService :", result);

      if (result.success) {
        setWeight(result?.data?.weight ?? 0);
        setPort(result?.data?.port ?? null);
      } else toast.error(result.message);
    } catch (error) {
      console.error("Error fetching weight:", error);
    }
  };

  useEffect(() => {
    Get_Weight();

    const scaleInterval = Number(import.meta.env.VITE_SCALE_INTERVAL) || 5000;
    const interval = setInterval(Get_Weight, scaleInterval);

    return () => clearInterval(interval);
  }, []);

  return { weight, port, Get_Weight };
};
