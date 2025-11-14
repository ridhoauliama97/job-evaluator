import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PSIResult } from "@/types/psi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { Trophy, Download, RotateCcw, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { DetailedCalculationView } from "./DetailedCalculationView";
import { exportToPDF, exportToExcel, exportToCSV } from "@/utils/exportUtils";
import { toast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PSIResultsProps {
  result: PSIResult;
  onReset: () => void;
}

export const PSIResults = ({ result, onReset }: PSIResultsProps) => {
  const [showDetailed, setShowDetailed] = useState(false);

  const barChartData = result.rankedAlternatives.map((item) => ({
    name: item.alternative.name,
    "PSI Value": item.psiValue,
    rank: item.rank,
  }));

  const radarChartData = result.weights.map((weight, index) => ({
    criteria: `C${index + 1}`,
    weight: weight,
  }));

  const handleExport = async (format: "pdf" | "excel" | "csv") => {
    try {
      if (format === "pdf") {
        await exportToPDF(result);
      } else if (format === "excel") {
        await exportToExcel(result);
      } else {
        await exportToCSV(result);
      }
      toast({
        title: "Export Successful",
        description: `Results exported as ${format.toUpperCase()}`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "An error occurred during export",
        variant: "destructive",
      });
    }
  };

  if (showDetailed) {
    return (
      <DetailedCalculationView
        result={result}
        onBack={() => setShowDetailed(false)}
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Top Recommendation */}
      <Card className="shadow-strong border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">Top Recommendation</CardTitle>
              <CardDescription>
                Based on PSI analysis of {result.alternatives.length}{" "}
                alternatives
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-6 rounded-lg bg-background border-2 border-primary">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {result.rankedAlternatives[0].alternative.name}
                </h3>
                <p className="text-muted-foreground">
                  PSI Score:{" "}
                  <span className="font-bold text-primary text-xl">
                    {result.rankedAlternatives[0].psiValue}
                  </span>
                </p>
              </div>
              <Badge className="text-lg px-4 py-2">Rank #1</Badge>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => setShowDetailed(true)}
              variant="outline"
              className="flex-1"
            >
              <Eye className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">
                View Detailed Calculation
              </span>
              <span className="sm:hidden">Detailed View</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Export Results
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleExport("pdf")}>
                  Export as PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("excel")}>
                  Export as Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("csv")}>
                  Export as CSV
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={onReset} variant="outline" className="flex-1">
              <RotateCcw className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">New Evaluation</span>
              <span className="sm:hidden">New</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Rankings Table */}
      <Card className="shadow-medium">
        <CardHeader>
          <CardTitle>Complete Rankings</CardTitle>
          <CardDescription>
            All alternatives ranked by PSI value
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 font-semibold">Rank</th>
                  <th className="text-left p-3 font-semibold">
                    Job Alternative
                  </th>
                  <th className="text-right p-3 font-semibold">PSI Value</th>
                </tr>
              </thead>
              <tbody>
                {result.rankedAlternatives.map((item) => (
                  <tr
                    key={item.alternative.id}
                    className="border-b border-border/50 hover:bg-muted/50 transition-colors"
                  >
                    <td className="p-3">
                      <Badge variant={item.rank === 1 ? "default" : "outline"}>
                        #{item.rank}
                      </Badge>
                    </td>
                    <td className="p-3 font-medium">{item.alternative.name}</td>
                    <td className="p-3 text-right font-mono">
                      {item.psiValue}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Bar Chart */}
      <Card className="shadow-medium">
        <CardHeader>
          <CardTitle>PSI Values Comparison</CardTitle>
          <CardDescription>
            Visual comparison of all alternatives
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="PSI Value"
                  fill="hsl(var(--primary))"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Radar Chart */}
      <Card className="shadow-medium">
        <CardHeader>
          <CardTitle>Criteria Weights Distribution</CardTitle>
          <CardDescription>
            Relative importance of each criterion
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 sm:h-96">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarChartData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis
                  dataKey="criteria"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <PolarRadiusAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={10}
                />
                <Radar
                  name="Weight"
                  dataKey="weight"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.6}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
