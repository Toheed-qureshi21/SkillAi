import DashboardClient from "@/components/dashboard/DashboardClient";

export const metadata = {
  title: "Dashboard | SkillAI",
  description:
    "Access your personalized dashboard with insights, analytics, and essential industry information.",
  keywords: ["dashboard", "analytics", "insights", "industry insights"],
  openGraph: {
    title: "Dashboard | SkillAI",
    description:
      "View your personalized dashboard with insights and recommendations.",
    url: `${process.env.NEXT_FRONTEND_URL}`,
    siteName: "SkillAI",
    type: "website",
  },
};
export default function DashboardPage() {
    return(
        <DashboardClient/>
    )
}