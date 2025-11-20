import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Save, X, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { Criteria, CriteriaOption, CriteriaType } from "@/types/psi";
import { CRITERIA_DATA } from "@/data/criteriaData";
import { toast } from "sonner";

const Criteria = () => {
  const [criteria, setCriteria] = useState<Criteria[]>([]);
  const [editingCriteria, setEditingCriteria] = useState<Criteria | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    const loadCriteria = async () => {
      // Simulate loading for better UX
      await new Promise((resolve) => setTimeout(resolve, 300));
      const savedCriteria = localStorage.getItem("criteria");
      if (savedCriteria) {
        setCriteria(JSON.parse(savedCriteria));
      } else {
        setCriteria(CRITERIA_DATA);
        localStorage.setItem("criteria", JSON.stringify(CRITERIA_DATA));
      }
      setIsLoading(false);
    };
    loadCriteria();
  }, []);

  const saveCriteria = (newCriteria: Criteria[]) => {
    setCriteria(newCriteria);
    localStorage.setItem("criteria", JSON.stringify(newCriteria));
  };

  const handleAddCriteria = () => {
    const newCriteria: Criteria = {
      id: `C${criteria.length + 1}`,
      name: "",
      type: "Benefit",
      options: [
        { label: "", value: 1 },
        { label: "", value: 2 },
        { label: "", value: 3 },
        { label: "", value: 4 },
        { label: "", value: 5 },
      ],
    };
    setEditingCriteria(newCriteria);
    setIsDialogOpen(true);
  };

  const handleEditCriteria = (criteriaToEdit: Criteria) => {
    setEditingCriteria({ ...criteriaToEdit });
    setIsDialogOpen(true);
  };

  const handleDeleteCriteria = (id: string) => {
    if (confirm("Are you sure you want to delete this criteria?")) {
      const newCriteria = criteria.filter((c) => c.id !== id);
      saveCriteria(newCriteria);
      toast.success("Criteria deleted successfully");
    }
  };

  const handleSaveCriteria = () => {
    if (!editingCriteria?.name.trim()) {
      toast.error("Please enter a criteria name");
      return;
    }

    if (!editingCriteria?.id.trim()) {
      toast.error("Please enter a criteria ID");
      return;
    }

    const invalidOptions = editingCriteria.options.some(
      (opt) => !opt.label.trim()
    );
    if (invalidOptions) {
      toast.error("Please fill in all option labels");
      return;
    }

    const existingIndex = criteria.findIndex(
      (c) => c.id === editingCriteria.id
    );

    // Check for duplicate ID when adding new criteria or changing ID
    const isDuplicate = criteria.some(
      (c, index) => c.id === editingCriteria.id && index !== existingIndex
    );

    if (isDuplicate) {
      toast.error(
        `Criteria ID "${editingCriteria.id}" already exists. Please use a unique ID.`
      );
      return;
    }

    let newCriteria: Criteria[];

    if (existingIndex >= 0) {
      newCriteria = [...criteria];
      newCriteria[existingIndex] = editingCriteria;
      toast.success("Criteria updated successfully");
    } else {
      newCriteria = [...criteria, editingCriteria];
      toast.success("Criteria added successfully");
    }

    saveCriteria(newCriteria);
    setIsDialogOpen(false);
    setEditingCriteria(null);
  };

  const handleResetToDefault = () => {
    if (
      confirm("Are you sure you want to reset all criteria to default values?")
    ) {
      saveCriteria(CRITERIA_DATA);
      setSelectedIds([]);
      toast.success("Criteria reset to default");
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === criteria.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(criteria.map((c) => c.id));
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;

    if (
      confirm(`Are you sure you want to delete ${selectedIds.length} criteria?`)
    ) {
      const newCriteria = criteria.filter((c) => !selectedIds.includes(c.id));
      saveCriteria(newCriteria);
      setSelectedIds([]);
      toast.success(`${selectedIds.length} criteria deleted successfully`);
    }
  };

  const updateEditingCriteria = (updates: Partial<Criteria>) => {
    if (editingCriteria) {
      setEditingCriteria({ ...editingCriteria, ...updates });
    }
  };

  const updateOption = (
    index: number,
    field: keyof CriteriaOption,
    value: string | number
  ) => {
    if (editingCriteria) {
      const newOptions = [...editingCriteria.options];
      newOptions[index] = { ...newOptions[index], [field]: value };
      updateEditingCriteria({ options: newOptions });
    }
  };

  const checkIdExists = (id: string): boolean => {
    if (!editingCriteria) return false;
    const existingIndex = criteria.findIndex(
      (c) => c.id === editingCriteria.id
    );
    return criteria.some((c, index) => c.id === id && index !== existingIndex);
  };

  const idError =
    editingCriteria &&
    editingCriteria.id.trim() &&
    checkIdExists(editingCriteria.id)
      ? `ID "${editingCriteria.id}" is already in use`
      : "";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 mt-16 sm:mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold text-foreground mb-1 sm:mb-2">
                Criteria Management
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Manage evaluation criteria and their conversion values
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleResetToDefault}
                variant="outline"
                size="sm"
                className="flex-1 sm:flex-none"
              >
                Reset to Default
              </Button>
              <Button
                onClick={handleAddCriteria}
                size="sm"
                className="flex-1 sm:flex-none"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Criteria
              </Button>
            </div>
          </div>

          {selectedIds.length > 0 && (
            <Card className="mb-4 border-primary">
              <CardContent className="py-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">
                    {selectedIds.length}{" "}
                    {selectedIds.length === 1 ? "criteria" : "criteria"}{" "}
                    selected
                  </p>
                  <Button
                    onClick={handleBulkDelete}
                    variant="destructive"
                    size="sm"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Selected
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Criteria List</CardTitle>
              <CardDescription>
                {isLoading ? (
                  <Skeleton className="h-4 w-32" />
                ) : (
                  `Total criteria: ${criteria.length}`
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center gap-4">
                      <Skeleton className="h-10 w-16" />
                      <Skeleton className="h-10 flex-1" />
                      <Skeleton className="h-10 w-20" />
                      <Skeleton className="h-10 w-24" />
                      <Skeleton className="h-10 w-28" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto -mx-3 sm:mx-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">
                          <input
                            type="checkbox"
                            checked={
                              selectedIds.length === criteria.length &&
                              criteria.length > 0
                            }
                            onChange={handleSelectAll}
                            className="cursor-pointer w-4 h-4"
                          />
                        </TableHead>
                        <TableHead className="min-w-[60px]">ID</TableHead>
                        <TableHead className="min-w-[150px]">Name</TableHead>
                        <TableHead className="min-w-[80px]">Type</TableHead>
                        <TableHead className="min-w-[80px]">Options</TableHead>
                        <TableHead className="text-right min-w-[120px]">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {criteria.map((c) => (
                        <TableRow key={c.id}>
                          <TableCell>
                            <input
                              type="checkbox"
                              checked={selectedIds.includes(c.id)}
                              onChange={() => handleToggleSelect(c.id)}
                              className="cursor-pointer w-4 h-4"
                            />
                          </TableCell>
                          <TableCell className="font-medium">{c.id}</TableCell>
                          <TableCell>{c.name}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                c.type === "Benefit" ? "default" : "secondary"
                              }
                            >
                              {c.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {c.options.length} options
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditCriteria(c)}
                                title="Edit"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteCriteria(c.id)}
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCriteria &&
              criteria.some((c) => c.id === editingCriteria.id)
                ? "Edit Criteria"
                : "Add New Criteria"}
            </DialogTitle>
            <DialogDescription>
              Define the criteria name, type, and conversion values
            </DialogDescription>
          </DialogHeader>

          {editingCriteria && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Criteria ID</Label>
                  <Input
                    value={editingCriteria.id}
                    onChange={(e) =>
                      updateEditingCriteria({ id: e.target.value })
                    }
                    placeholder="e.g., C1"
                    className={
                      idError
                        ? "border-destructive focus-visible:ring-destructive"
                        : ""
                    }
                  />
                  {idError && (
                    <Alert variant="destructive" className="py-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-xs">
                        {idError}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select
                    value={editingCriteria.type}
                    onValueChange={(value: CriteriaType) =>
                      updateEditingCriteria({ type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Benefit">Benefit</SelectItem>
                      <SelectItem value="Cost">Cost</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Criteria Name</Label>
                <Input
                  value={editingCriteria.name}
                  onChange={(e) =>
                    updateEditingCriteria({ name: e.target.value })
                  }
                  placeholder="e.g., Education Level"
                />
              </div>

              <div className="space-y-4">
                <Label>Conversion Options</Label>
                {editingCriteria.options.map((option, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <div className="w-20">
                      <Input
                        type="number"
                        value={option.value}
                        onChange={(e) =>
                          updateOption(index, "value", Number(e.target.value))
                        }
                        placeholder="Value"
                      />
                    </div>
                    <div className="flex-1">
                      <Input
                        value={option.label}
                        onChange={(e) =>
                          updateOption(index, "label", e.target.value)
                        }
                        placeholder="Label"
                      />
                    </div>
                    {editingCriteria.options.length > 2 && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const newOptions = editingCriteria.options.filter(
                            (_, i) => i !== index
                          );
                          updateEditingCriteria({ options: newOptions });
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newOptions = [
                      ...editingCriteria.options,
                      { label: "", value: editingCriteria.options.length + 1 },
                    ];
                    updateEditingCriteria({ options: newOptions });
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Option
                </Button>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveCriteria} disabled={!!idError}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Criteria
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <footer className="border-t border-border mt-12 sm:mt-20">
        <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
          <p className="text-center text-xs sm:text-sm text-muted-foreground">
            PSI Decision Support System &copy; {new Date().getFullYear()} •
            Built with precision, care and ❤️ by{" "}
            <a
              href="https://next-portfolio-ridhoauliama97.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-semibold"
            >
              Ridho Aulia Mahqoma Angkat
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Criteria;
