import React, { useEffect, useState } from "react";
import {
    PieChart as RechartsPieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import colorPalette, { generateColorFade } from "../helpers/colorHelper";
import {
    CollaborationModel,
    getCollaborators,
} from "../helpers/playlistHelper";

const PieChart = React.memo(() => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<CollaborationModel[]>([]);

    useEffect(() => {
        const fetchCollaborators = async () => {
            try {
                const collaboratorsData = await getCollaborators();
                setData(collaboratorsData);
            } catch (error) {
                console.error("Error fetching collaborators:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCollaborators();
    }, []); // Empty dependency array ensures this runs only once

    if (loading) {
        return <div>Loading...</div>;
    }

    if (data.length === 0) {
        return <div>No data available</div>;
    }

    const colors = generateColorFade(
        colorPalette.GetColor("subtext"),
        colorPalette.GetColor("button-secondary"),
        data.length
    );

    return (
        <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart margin={{ top: 0, bottom: 0, left: 0, right: 0 }}>
                <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    startAngle={90}
                    endAngle={-270}
                    paddingAngle={0}
                    outerRadius="100%"
                    innerRadius="70%"
                    animationBegin={100}
                    animationDuration={500}
                    animationEasing="ease-out"
                >
                    {data.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index]} />
                    ))}
                </Pie>
                <Legend
                    verticalAlign="middle"
                    layout="vertical"
                    iconType="circle"
                />
                <Tooltip
                    wrapperClassName="pieChart-tooltip"
                    wrapperStyle={{
                        backgroundColor: "transparent",
                        whiteSpace: "nowrap",
                        border: "none",
                    }}
                    contentStyle={{
                        backgroundColor: "var(--spice-main-secondary)",
                        border: "none",
                        borderRadius: "8px",
                    }}
                    labelStyle={{
                        color: "var(--spice-text)",
                    }}
                    itemStyle={{
                        color: "var(--spice-subtext)",
                        fontWeight: "400",
                    }}
                />
            </RechartsPieChart>
        </ResponsiveContainer>
    );
});

export default PieChart;
