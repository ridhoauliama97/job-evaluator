import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PSIResult } from "@/types/psi";
import { CRITERIA_DATA } from "@/data/criteriaData";
import { ArrowLeft, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DetailedCalculationViewProps {
  result: PSIResult;
  onBack: () => void;
}

export const DetailedCalculationView = ({
  result,
  onBack,
}: DetailedCalculationViewProps) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Card className="shadow-medium">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-xl sm:text-2xl">
                Detailed PSI Calculation Process
              </CardTitle>
              <CardDescription className="text-sm">
                Step-by-step breakdown of the PSI methodology
              </CardDescription>
            </div>
            <Button onClick={onBack} variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Decision Matrix */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-semibold">
                Step 1: Decision Matrix
              </h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-4 h-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Original values for each alternative across all criteria
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="overflow-x-auto -mx-3 sm:mx-0">
              <table className="w-full text-xs sm:text-sm border border-border rounded-lg">
                <thead>
                  <tr className="bg-muted">
                    <th className="p-2 text-left border-r border-border sticky left-0 bg-muted">
                      Alternative
                    </th>
                    {CRITERIA_DATA.map((criteria) => (
                      <th
                        key={criteria.id}
                        className="p-2 text-center border-r border-border last:border-r-0 min-w-[60px]"
                      >
                        {criteria.id}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.alternatives.map((alt, i) => (
                    <tr key={alt.id} className="border-t border-border">
                      <td className="p-2 font-medium border-r border-border sticky left-0 bg-background">
                        {alt.name}
                      </td>
                      {CRITERIA_DATA.map((criteria) => (
                        <td
                          key={criteria.id}
                          className="p-2 text-center border-r border-border last:border-r-0"
                        >
                          {alt.values[criteria.id]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Step 2: Normalized Matrix */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">
                Step 2: Normalized Matrix
              </h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-4 h-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Values normalized based on Benefit (max) or Cost (min)
                      criteria type
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-border rounded-lg">
                <thead>
                  <tr className="bg-muted">
                    <th className="p-2 text-left border-r border-border">
                      Alternative
                    </th>
                    {CRITERIA_DATA.map((criteria) => (
                      <th
                        key={criteria.id}
                        className="p-2 text-center border-r border-border last:border-r-0"
                      >
                        {criteria.id}
                        <div className="text-xs text-muted-foreground">
                          {criteria.type}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.normalizedMatrix.map((row, i) => (
                    <tr key={i} className="border-t border-border">
                      <td className="p-2 font-medium border-r border-border">
                        {result.alternatives[i].name}
                      </td>
                      {row.map((value, j) => (
                        <td
                          key={j}
                          className="p-2 text-center font-mono border-r border-border last:border-r-0"
                        >
                          {value.toFixed(4)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Step 3: Averages */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">Step 3: Average Values</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-4 h-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Mean value for each criterion across all alternatives</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-border rounded-lg">
                <thead>
                  <tr className="bg-muted">
                    {CRITERIA_DATA.map((criteria) => (
                      <th
                        key={criteria.id}
                        className="p-2 text-center border-r border-border last:border-r-0"
                      >
                        {criteria.id}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {result.averages.map((avg, i) => (
                      <td
                        key={i}
                        className="p-2 text-center font-mono border-r border-border last:border-r-0"
                      >
                        {avg.toFixed(4)}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Step 4: Preference Variations */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">
                Step 4: Preference Variation Values
              </h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-4 h-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Sum of squared differences from average for each criterion
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-border rounded-lg">
                <thead>
                  <tr className="bg-muted">
                    {CRITERIA_DATA.map((criteria) => (
                      <th
                        key={criteria.id}
                        className="p-2 text-center border-r border-border last:border-r-0"
                      >
                        {criteria.id}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {result.preferenceVariations.map((pv, i) => (
                      <td
                        key={i}
                        className="p-2 text-center font-mono border-r border-border last:border-r-0"
                      >
                        {pv.toFixed(4)}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Step 5: Weights */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">
                Step 5: Criteria Weights
              </h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-4 h-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Final weights determining importance of each criterion
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-border rounded-lg">
                <thead>
                  <tr className="bg-muted">
                    {CRITERIA_DATA.map((criteria) => (
                      <th
                        key={criteria.id}
                        className="p-2 text-center border-r border-border last:border-r-0"
                      >
                        {criteria.id}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {result.weights.map((weight, i) => (
                      <td
                        key={i}
                        className="p-2 text-center font-mono font-bold text-primary border-r border-border last:border-r-0"
                      >
                        {weight.toFixed(4)}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Step 6: PSI Values */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">
                Step 6: Final PSI Values
              </h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-4 h-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Weighted sum of normalized values for each alternative
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-border rounded-lg">
                <thead>
                  <tr className="bg-muted">
                    <th className="p-2 text-left border-r border-border">
                      Alternative
                    </th>
                    <th className="p-2 text-center border-r border-border">
                      PSI Value
                    </th>
                    <th className="p-2 text-center">Rank</th>
                  </tr>
                </thead>
                <tbody>
                  {result.rankedAlternatives.map((item) => (
                    <tr
                      key={item.alternative.id}
                      className="border-t border-border"
                    >
                      <td className="p-2 font-medium border-r border-border">
                        {item.alternative.name}
                      </td>
                      <td className="p-2 text-center font-mono font-bold text-primary border-r border-border">
                        {item.psiValue.toFixed(4)}
                      </td>
                      <td className="p-2 text-center font-bold">
                        #{item.rank}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
