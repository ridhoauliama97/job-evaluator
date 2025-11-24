/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { JobAlternative } from "@/types/psi";
import { CRITERIA_DATA } from "@/data/criteriaData";
import { Plus, Trash2, Briefcase, Upload } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import * as XLSX from "xlsx";

interface JobAlternativesFormProps {
  onSubmit: (alternatives: JobAlternative[]) => void;
  onBack: () => void;
}

export const JobAlternativesForm = ({
  onSubmit,
  onBack,
}: JobAlternativesFormProps) => {
  const [alternatives, setAlternatives] = useState<JobAlternative[]>([
    {
      id: "1",
      name: "",
      values: {},
    },
  ]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCriteria = async () => {
      // Simulate loading for better UX
      await new Promise((resolve) => setTimeout(resolve, 300));
      setIsLoading(false);
    };
    loadCriteria();
  }, []);

  const addAlternative = () => {
    setAlternatives([
      ...alternatives,
      {
        id: Date.now().toString(),
        name: "",
        values: {},
      },
    ]);
  };

  const removeAlternative = (id: string) => {
    if (alternatives.length > 1) {
      setAlternatives(alternatives.filter((alt) => alt.id !== id));
    }
  };

  const updateAlternativeName = (id: string, name: string) => {
    setAlternatives(
      alternatives.map((alt) => (alt.id === id ? { ...alt, name } : alt))
    );
  };

  const updateAlternativeValue = (
    id: string,
    criteriaId: string,
    value: number
  ) => {
    setAlternatives(
      alternatives.map((alt) =>
        alt.id === id
          ? { ...alt, values: { ...alt.values, [criteriaId]: value } }
          : alt
      )
    );
  };

  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const importedAlternatives: JobAlternative[] = jsonData.map(
          (row: any, index) => {
            const values: Record<string, number> = {};
            CRITERIA_DATA.forEach((criteria) => {
              if (row[criteria.id] !== undefined) {
                values[criteria.id] = Number(row[criteria.id]);
              }
            });
            return {
              id: Date.now().toString() + index,
              name: row.Name || `Job ${index + 1}`,
              values,
            };
          }
        );

        if (importedAlternatives.length > 0) {
          setAlternatives(importedAlternatives);
          toast({
            title: "Import Successful",
            description: `Imported ${importedAlternatives.length} job alternatives`,
          });
        }
      } catch (error) {
        toast({
          title: "Import Failed",
          description: "Please ensure the Excel file has the correct format",
          variant: "destructive",
        });
      }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    const invalidAlternatives = alternatives.filter(
      (alt) =>
        !alt.name || Object.keys(alt.values).length !== CRITERIA_DATA.length
    );

    if (invalidAlternatives.length > 0) {
      toast({
        title: "Incomplete Data",
        description: "Please fill in all job names and criteria values",
        variant: "destructive",
      });
      return;
    }

    onSubmit(alternatives);
  };

  const isValid = alternatives.every(
    (alt) => alt.name && Object.keys(alt.values).length === CRITERIA_DATA.length
  );

  if (isLoading) {
    return (
      <Card className="shadow-medium">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="space-y-4 p-4 border border-border rounded-lg"
            >
              <Skeleton className="h-10 w-full" />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {[1, 2, 3, 4, 5, 6].map((j) => (
                  <Skeleton key={j} className="h-20 w-full" />
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-medium">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle>Job Alternatives</CardTitle>
                <CardDescription className="hidden sm:block">
                  Add and evaluate multiple job options
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById("excel-upload")?.click()}
                className="flex-1 sm:flex-none"
              >
                <Upload className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Import Excel</span>
                <span className="sm:hidden">Import</span>
              </Button>
              <input
                id="excel-upload"
                type="file"
                accept=".xlsx,.xls"
                onChange={handleExcelUpload}
                className="hidden"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {alternatives.map((alternative, altIndex) => (
              <Card key={alternative.id} className="border-2 border-muted">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      Alternative {altIndex + 1}
                    </CardTitle>
                    {alternatives.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAlternative(alternative.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>
                      Job Name <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      value={alternative.name}
                      onChange={(e) =>
                        updateAlternativeName(alternative.id, e.target.value)
                      }
                      placeholder="e.g., Software Engineer at Tech Corp"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {CRITERIA_DATA.map((criteria) => (
                      <div key={criteria.id} className="space-y-2">
                        <Label>
                          {criteria.name}{" "}
                          <span className="text-red-600">*</span>
                          <span className="ml-2 text-xs text-muted-foreground">
                            ({criteria.type})
                          </span>
                        </Label>
                        <Select
                          value={
                            alternative.values[criteria.id]?.toString() || ""
                          }
                          onValueChange={(value) =>
                            updateAlternativeValue(
                              alternative.id,
                              criteria.id,
                              Number(value)
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select option" />
                          </SelectTrigger>
                          <SelectContent>
                            {criteria.options.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value.toString()}
                              >
                                {option.label} ({option.value})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={addAlternative}
                className="flex-1"
              >
                <Plus className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">
                  Add Another Alternative
                </span>
                <span className="sm:hidden">Add Job</span>
              </Button>
            </div>

            <div className="flex gap-2 sm:gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="flex-1"
              >
                Back
              </Button>
              <Button type="submit" disabled={!isValid} className="flex-1">
                <span className="hidden sm:inline">Calculate PSI Results</span>
                <span className="sm:hidden">Calculate</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
