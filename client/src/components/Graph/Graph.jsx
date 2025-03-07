import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

export default function NutritionChart({ data }) {
    // Data for the chart
    const chartData = {
        labels: ["Carbohydrates", "Protein", "Fat", "Fiber"],
        datasets: [
            {
                data: [data.carbohydrates, data.protein, data.fat, data.fiber],
                backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56", "#4BC0C0"],
                hoverBackgroundColor: ["#36A2EB", "#FF6384", "#FFCE56", "#4BC0C0"],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="w-full max-w-xs mx-auto">
            <h2 className="text-lg font-semibold text-center mb-4">Nutrient Breakdown (per 100g)</h2>
            <Doughnut data={chartData} />
        </div>
    );
}
