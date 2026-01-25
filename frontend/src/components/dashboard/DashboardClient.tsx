"use client";

import { getIndustryInsights } from "@/backend-apis/industryInsights";
import { useAppSelector } from "@/redux/hooks";
import { LineChart, TrendingDown, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { format, formatDistanceToNow } from "date-fns";

export default function DashboardClient() {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.user);

  /* 
"industryInsights": {
            "_id": "68f9db321acf49c9fa00438e",
            "industry": "financial services",
            "salaryRanges": [
                {
                    "role": "Financial Analyst",
                    "min": 65000,
                    "max": 120000,
                    "median": 90000,
                    "location": "USA",
                    "_id": "68f9db321acf49c9fa00438f"
                },
                {
                    "role": "Investment Banking Analyst",
                    "min": 100000,
                    "max": 250000,
                    "median": 175000,
                    "location": "USA",
                    "_id": "68f9db321acf49c9fa004390"
                },
                {
                    "role": "Wealth Manager",
                    "min": 60000,
                    "max": 200000,
                    "median": 110000,
                    "location": "USA",
                    "_id": "68f9db321acf49c9fa004391"
                },
                {
                    "role": "Risk Manager",
                    "min": 85000,
                    "max": 180000,
                    "median": 130000,
                    "location": "USA",
                    "_id": "68f9db321acf49c9fa004392"
                },
                {
                    "role": "Quantitative Analyst",
                    "min": 120000,
                    "max": 250000,
                    "median": 180000,
                    "location": "USA",
                    "_id": "68f9db321acf49c9fa004393"
                }
            ],
            "growthRate": 7,
            "demandLevel": "High",
            "topSkills": [
                "Financial Modeling",
                "Data Analysis (Python, SQL)",
                "Risk Management",
                "Regulatory Compliance (KYC/AML)",
                "Client Relationship Management"
            ],
            "marketOutlook": "Positive",
            "keyTrends": [
                "Digital Transformation and Fintech Integration",
                "AI/ML in Trading and Risk Assessment",
                "Sustainable Finance and ESG Investing",
                "Increased Regulatory Scrutiny",
                "Adoption of Blockchain and DeFi Concepts"
            ],
            "recommendedSkills": [
                "Python for Data Science",
                "Machine Learning Fundamentals",
                "Cloud Computing Basics (AWS/Azure)",
                "ESG Analysis",
                "Cybersecurity Awareness"
            ],
            "nextUpdate": "2025-10-30T07:37:22.659Z",
            "createdAt": "2025-10-23T07:37:22.715Z",
            "updatedAt": "2025-11-22T13:27:54.043Z",
            "__v": 0
        }
*/
  useEffect(() => {
    if (!user) return;

    if (!user.isOnboarded) {
      router.replace("/onboard-user");
      return;
    }

    // user is onboarded and valid
    (async () => {
      const response = await getIndustryInsights();
      console.log(response);
    })();
  }, [user, router]);

  const industryInsights = user?.industryInsights;
  const salaryData = industryInsights?.salaryRanges.map((range) => ({
    name: range.role,
    min: range.min / 1000,
    max: range.max / 1000,
    median: range.median / 1000,
  }));

  const getDemandLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "high":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getMarketOutlookInfo = (outlook: string) => {
    switch (outlook.toLowerCase()) {
      case "positive":
        return { icon: TrendingUp, color: "text-green-500" };
      case "neutral":
        return { icon: LineChart, color: "text-yellow-500" };
      case "negative":
        return { icon: TrendingDown, color: "text-red-500" };
      default:
        return { icon: LineChart, color: "text-gray-500" };
    }
  };

  const marketOutlook = industryInsights?.marketOutlook ?? "neutral";
  const OutlookIcon = getMarketOutlookInfo(marketOutlook).icon;
  const outlookColor = getMarketOutlookInfo(marketOutlook).color;

  // Format dates using date-fns
  const lastUpdatedDate = industryInsights
    ? format(new Date(industryInsights.updatedAt), "dd/MM/yyyy")
    : "";
  const nextUpdateDistance = industryInsights
    ? formatDistanceToNow(new Date(industryInsights.nextUpdate), {
        addSuffix: true,
      })
    : "";

  return (
    <div className="flex justify-center mt-7">
      Welcome to your Dashboard {user?.name}
    </div>
  );
}
