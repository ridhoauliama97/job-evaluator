import { useState } from "react";
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
import { UserDetails } from "@/types/psi";
import { User } from "lucide-react";

interface UserDetailsFormProps {
  onSubmit: (details: UserDetails) => void;
  initialData?: UserDetails;
}

export const UserDetailsForm = ({
  onSubmit,
  initialData,
}: UserDetailsFormProps) => {
  const [details, setDetails] = useState<UserDetails>(
    initialData || {
      name: "",
      age: "",
      education: "",
      location: "",
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (details.name && details.age && details.education && details.location) {
      onSubmit(details);
    }
  };

  const isValid =
    details.name && details.age && details.education && details.location;

  return (
    <Card className="shadow-medium">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle>User Information</CardTitle>
            <CardDescription>
              Please provide your personal details
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Full Name <span className="text-red-600">*</span>
            </Label>
            <Input
              id="name"
              value={details.name}
              onChange={(e) => setDetails({ ...details, name: e.target.value })}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="age">
              Age <span className="text-red-600">*</span>
            </Label>
            <Input
              id="age"
              type="number"
              value={details.age}
              onChange={(e) => setDetails({ ...details, age: e.target.value })}
              placeholder="Enter your age"
              min="18"
              max="100"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="education">
              Education Level <span className="text-red-600">*</span>
            </Label>
            <Input
              id="education"
              value={details.education}
              onChange={(e) =>
                setDetails({ ...details, education: e.target.value })
              }
              placeholder="e.g., Bachelor's Degree in Computer Science"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">
              Location <span className="text-red-600">*</span>
            </Label>
            <Input
              id="location"
              value={details.location}
              onChange={(e) =>
                setDetails({ ...details, location: e.target.value })
              }
              placeholder="Enter your city/region"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={!isValid}>
            Continue
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
