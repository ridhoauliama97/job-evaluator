import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EvaluationHistory as EvaluationHistoryType } from "@/types/psi";
import { History, Trash2, Eye } from "lucide-react";
import { format } from "date-fns";

interface EvaluationHistoryProps {
  history: EvaluationHistoryType[];
  onView: (id: string) => void;
  onDelete: (id: string) => void;
}

export const EvaluationHistory = ({
  history,
  onView,
  onDelete,
}: EvaluationHistoryProps) => {
  if (history.length === 0) {
    return null;
  }

  return (
    <Card className="shadow-medium">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
            <History className="w-5 h-5 text-accent" />
          </div>
          <div>
            <CardTitle>Evaluation History</CardTitle>
            <CardDescription>Your previous PSI evaluations</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {history.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-foreground truncate">
                  {item.userDetails.name}
                </h4>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {format(item.timestamp, "PP")} • {item.alternativesCount}{" "}
                  alternatives
                </p>
                <p className="text-xs sm:text-sm text-primary font-medium mt-1 truncate">
                  Top: {item.topAlternative}
                </p>
              </div>
              <div className="flex gap-2 self-end sm:self-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onView(item.id)}
                >
                  <Eye className="w-4 h-4" />
                  <span className="ml-1 sm:hidden">View</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(item.id)}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                  <span className="ml-1 sm:hidden">Delete</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
