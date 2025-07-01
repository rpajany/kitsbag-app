import { useState, createContext, useContext } from "react";

// Create Context with a default value of null
const DateRangeContext = createContext(null);

// Provider Component
export const DateRangeProvider = ({ children }) => {
  // Get the current date
  const currentDate = new Date();

  // Get the first day of the current month
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );

  // Get the last day of the current month
  const lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );

  // Set date range state
  const [dateRange, setDateRange] = useState([
    {
      startDate: firstDayOfMonth, // new Date(),
      endDate: lastDayOfMonth, //addDays(new Date(), 7),
      key: "selection",
    },
  ]);

    // ✅ Utility to get ISO-formatted start and end date
  const API_DateRange = () => {
    const range = dateRange[0] || {};
    return {
      startDate: range.startDate?.toISOString() ?? null,
      endDate: range.endDate?.toISOString() ?? null,
    };
  };

  return (
    <DateRangeContext.Provider value={{ dateRange, setDateRange, API_DateRange  }}>
      {children}
    </DateRangeContext.Provider>
  );
};

// export const useDateRange = () => useContext(DateRangeContext);

export const useDateRange = () => {
  const context = useContext(DateRangeContext);

  if (context === undefined)
    throw new Error("useDateRange must be used within a DateRangeProvider");

  return context;
};
