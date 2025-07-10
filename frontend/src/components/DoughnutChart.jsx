import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Label,
  Legend,
} from "recharts";
// const data = [
//   {
//     name: "Geeksforgeeks",
//     students: 400,
//   },
//   {
//     name: "GPL2023",
//     students: 700,
//   },
//   {
//     name: "Job-A-Thon",
//     students: 200,
//   },
//   {
//     name: "Dev Scripter 2024",
//     students: 1000,
//   },
// ];
// const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

// // Calculate total
// const totalStudents = data.reduce((acc, item) => acc + item.students, 0);

export const DoughnutChart = ({ data, COLORS }) => {
  // Filter out the "Total" row for the PieChart
  const chartData = data.filter((item) => item.status !== "Total");

  // Get total count from the "Total" item
  const totalItem = data.find((item) => item.status === "Total");
  const total = totalItem ? totalItem.count : 0;

  return (
    <>
      <div style={{ width: "500px", height: "500px", marginTop: "20px" }}> {/* marginTop: "-50px" */}
        <ResponsiveContainer>
          <PieChart>
            <Pie
              dataKey="count"
              nameKey="status"
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={150}
              innerRadius={90}
              fill="#8884d8"
              label
              isAnimationActive={true} // ✅ enable animation
            >
              {/* Center Label */}
              <Label
                value={`Total Orders : ${total}`}
                position="center"
                className="label-center"
                style={{ fontSize: "20px", fontWeight: "bold" }}
              />
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color || "#cccccc"} // fallback color
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} /> {/* ✅ legend */}
          </PieChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};
