import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function NutritionChart({ data }) {
    const carbs = data.carbohydrates || 0;
    const protein = data.protein || 0;
    const fat = data.fat || 0;
    const fiber = data.fibre || data.fiber || 0;

    const chartData = {
        labels: ["Carbs", "Protein", "Fat", "Fiber"],
        datasets: [{
            data: [carbs, protein, fat, fiber],
            backgroundColor: ["#f59e0b", "#10b981", "#60a5fa", "#34d399"],
            borderColor: "transparent",
            hoverBorderColor: "#18181b",
            borderWidth: 2,
        }],
    };

    const options = {
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: '#a1a1aa',
                    font: { size: 11, family: 'Inter' },
                    padding: 12,
                    usePointStyle: true,
                    pointStyleWidth: 8,
                },
            },
            tooltip: {
                backgroundColor: '#18181b',
                borderColor: '#3f3f46',
                borderWidth: 1,
                titleColor: '#a1a1aa',
                bodyColor: '#f4f4f5',
                callbacks: {
                    label: (ctx) => ` ${ctx.label}: ${ctx.parsed}g`,
                },
            },
        },
        cutout: '65%',
    };

    return (
        <div className="w-full max-w-[220px] mx-auto">
            <p className="text-xs text-zinc-500 text-center mb-3 font-medium uppercase tracking-wider">Macro Breakdown (per 100g)</p>
            <Doughnut data={chartData} options={options} />
        </div>
    );
}
