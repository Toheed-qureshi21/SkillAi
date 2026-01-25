"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { industries } from "@/data/industries";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { onboardUser } from "@/backend-apis/user";
import { setUser } from "@/redux/userSlice";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { payloadForOnboarding } from "@/types";



const CompleteProfileCardForm = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [errors,setErrors] = useState({});
  const [selectedIndustry, setSelectedIndustry] = useState<
    null | (typeof industries)[0]
  >(null);
  const [details, setDetails] = useState<payloadForOnboarding>({
    specialization: "",
    yearsOfExperience: 0,
    skills: "",
    bio: "",
  });

  const { user } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (!user) return;
    if (user && user.isOnboarded) {
      router.replace("/dashboard"); // ✅ mirror opposite condition
    }
  }, [user, router]);

  if (!user) return null;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  interface BackendZodError {
    path: string[];
    message: string;
  }

  const handleFormSumbitForOnboarding = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload :payloadForOnboarding = {
        industry: selectedIndustry?.name || "",
        specialization: details.specialization,
        yearsOfExperience: Number(details.yearsOfExperience), // ✅ convert to number
        skills: (typeof details.skills === "string"
          ? details.skills.split(",").map((s) => s.trim().toLowerCase())
          : details.skills), // ✅ convert to array
        bio: details.bio,
      };
      const response = await onboardUser(payload );
      dispatch(setUser(response.data.user));
      return toast.success(response.data.message)
    }catch (error: AxiosError | unknown) {
      // Check if it's an Axios error
      if (error instanceof AxiosError) {
        const backendData = error.response?.data;

        // 2. Check if the backend sent specific validation errors (the array you showed)
        if (backendData && Array.isArray(backendData.errors)) {
          const fieldErrors: Partial<Record<keyof payloadForOnboarding, string>> = {};

          // Loop through the backend Zod errors
          (backendData.errors as BackendZodError[]).forEach((issue) => {
            // path[0] is the field name (e.g., "bio", "skills")
            const fieldName = issue.path[0] as keyof payloadForOnboarding;
            fieldErrors[fieldName] = issue.message;
          });

          // Update the state to show red text under inputs
          setErrors(fieldErrors);
          
          // Optional: Show a generic toast so they know something failed
          toast.error("Please fix the errors in the form");
        } else {
          // Fallback for generic errors (like 500 Server Error)
          const message = backendData?.message || error.message || "Something went wrong";
          toast.error(message);
        }
      } else {
        // Non-Axios error
        toast.error("An unexpected error occurred");
      }
    }finally {
      setLoading(false);
    }    
    }
 

  return (
    <Card className=" h-fit mt-8 w-[25rem]">
      <CardHeader>
        <CardTitle>
          <h1 className="text-3xl font-bold">Complete your profile</h1>
        </CardTitle>
        <CardDescription>
          Select your industry to get personalized career insights and
          recommendations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleFormSumbitForOnboarding}
          className="flex flex-col gap-4 w-full"
        >
          {/* Industry Select */}
          <div className="flex flex-col space-y-2 gap-1 w-full">
            <Label htmlFor="industry">Industry</Label>
            <Select
              value={selectedIndustry?.id ?? undefined}
              onValueChange={(value) =>
                setSelectedIndustry(
                  industries.find((ind) => ind.id === value) ?? null
                )
              }
            >
              <SelectTrigger id="industry" className="w-full">
                <SelectValue placeholder="Select an industry" />
              </SelectTrigger>
              <SelectContent className="w-full">
                <SelectGroup>
                  <SelectLabel>Industries</SelectLabel>
                  {industries.map((ind) => (
                    <SelectItem key={ind.id} value={ind.id}>
                      {ind.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Specialization Select */}
          <div className="flex flex-col space-y-2 gap-1 w-full">
            <Label htmlFor="subIndustry">Specialization</Label>
            <Select
              value={details.specialization}
              onValueChange={(value) =>
                handleSelectChange("specialization", value)
              }
              disabled={!selectedIndustry}
            >
              <SelectTrigger id="subIndustry" className="w-full">
                <SelectValue placeholder="Select your specialization" />
              </SelectTrigger>
              <SelectContent className="w-full">
                <SelectGroup>
                  <SelectLabel>Specializations</SelectLabel>
                  {selectedIndustry?.subIndustries.map((sub) => (
                    <SelectItem key={sub} value={sub}>
                      {sub}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          {/* Years of Experience */}
          <div className="flex flex-col space-y-2 gap-1 w-full">
            <Label htmlFor="yoe">Year of Experience</Label>
            <Input
              id="yoe"
              type="number"
              name="yearsOfExperience"
              value={details.yearsOfExperience}
              onChange={handleInputChange}
              placeholder="Enter your years of experience"
              className="w-full"
              min={0}
              max={40}
            />
          </div>

          {/* Skills */}
          <div className="flex flex-col space-y-2 gap-1 w-full">
            <Label htmlFor="skills">Skills</Label>
            <Textarea
              name="skills"
              value={details.skills}
              onChange={handleInputChange}
              id="skills"
              rows={0}
            />
            <p className="text-sm text-muted-foreground">
              Enter your skills, separated by commas
            </p>
          </div>

          {/* Bio */}
          <div className="flex flex-col space-y-2 gap-1 w-full">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              value={details.bio}
              onChange={handleInputChange}
              rows={3}
            />
            <p className="text-sm text-muted-foreground">
              A short bio to introduce yourself
            </p>
          </div>
          {/* Submit Button*/}
          <Button
            className="w-full"
            type="submit"
            disabled={
              !selectedIndustry ||
              !details.yearsOfExperience ||
              !details.specialization ||
              !details.bio ||
              !details.skills
            }
          >
            {loading ? "Processing..." : "Complete Profile"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CompleteProfileCardForm;
