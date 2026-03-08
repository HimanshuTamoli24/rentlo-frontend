import MainLayout from "@/components/main-layout";
import { useAuth } from "@/context/state.context.tsx";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Facehash } from "facehash";
import {
  Mail,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Building2,
  Activity,
} from "lucide-react";
import { useMyVisits, useIncomingVisits } from "../../visit/hooks/visit-hook";
import SEO from "@/components/seo";
import { formatDate } from "@/utils/format-date";

export default function ProfilePage() {
  const { user, role } = useAuth();
  const isOwner = role === "OWNER" || role === "BIGBOSS" || role === "ADMIN";

  const { data: tenantVisits } = useMyVisits({ enabled: !isOwner });
  const { data: ownerVisits } = useIncomingVisits({ enabled: isOwner });

  const visits = isOwner ? ownerVisits?.data || [] : tenantVisits?.data || [];

  const stats = {
    total: visits.length,
    pending: visits.filter((v: any) => v.status === "PENDING").length,
    scheduled: visits.filter((v: any) => v.status === "SCHEDULED").length,
    completed: visits.filter(
      (v: any) => v.status === "COMPLETED" || v.status === "VISITED",
    ).length,
    rejected: visits.filter((v: any) => v.status === "REJECTED").length,
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "BIGBOSS":
        return (
          <Badge className="bg-red-100 text-red-700 border-none font-bold">
            BIGBOSS
          </Badge>
        );
      case "OWNER":
        return (
          <Badge className="bg-blue-100 text-blue-700 border-none font-bold">
            OWNER
          </Badge>
        );
      case "TENANT":
        return (
          <Badge className="bg-green-100 text-green-700 border-none font-bold">
            TENANT
          </Badge>
        );
      default:
        return <Badge variant="secondary">{role}</Badge>;
    }
  };
  return (
    <MainLayout>
      <SEO
        title="User Profile"
        description="View your account details and activity summary."
      />

      <MainLayout.Title
        title="My Profile"
        description="Manage your account settings and view your interaction history."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border shadow-sm rounded-2xl overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-primary/10 to-primary/5" />
            <CardContent className="relative pt-0 px-6 pb-8">
              <div className="absolute -top-12 left-6">
                <Facehash
                  name={user?.name || user?.email || "User"}
                  size={96}
                  className="rounded-3xl border-4 border-background shadow-lg"
                  colorClasses={["bg-primary"]}
                />
              </div>
              <div className="pt-16 space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-2xl font-bold">{user?.name}</h2>
                    {getRoleBadge(role || "")}
                  </div>
                  <p className="text-muted-foreground text-sm flex items-center gap-2">
                    <Mail className="size-4" /> {user?.email}
                  </p>
                </div>
{/* 
                <div className="pt-4 border-t space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <ShieldCheck className="size-4" /> User ID
                    </span>
                    <span className="font-mono font-medium">
                      #{user?._id?.slice(-8)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Calendar className="size-4" /> Joined
                    </span>
                    <span className="font-medium">
                      {user?.createdAt
                        ? formatDate(user.createdAt)
                        : "Recently"}
                    </span>
                  </div>
                </div> */}
              </div>
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card className="border shadow-sm rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="size-5 text-primary" /> Activity Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-primary">
                  {stats.total}
                </span>
                <span className="text-[10px] font-bold uppercase text-muted-foreground">
                  Total Requests
                </span>
              </div>
              <div className="p-4 rounded-xl bg-yellow-50 border border-yellow-100 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-yellow-700">
                  {stats.pending}
                </span>
                <span className="text-[10px] font-bold uppercase text-muted-foreground">
                  Pending
                </span>
              </div>
              <div className="p-4 rounded-xl bg-green-50 border border-green-100 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-green-700">
                  {stats.completed}
                </span>
                <span className="text-[10px] font-bold uppercase text-muted-foreground">
                  Completed
                </span>
              </div>
              <div className="p-4 rounded-xl bg-red-50 border border-red-100 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-red-500">
                  {stats.rejected}
                </span>
                <span className="text-[10px] font-bold uppercase text-muted-foreground">
                  Rejected
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Recent Activity / Visit History */}
        <div className="lg:col-span-2">
          <Card className="border shadow-sm rounded-2xl h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl">
                  {isOwner ? "Incoming Tour Requests" : "Your Tour Requests"}
                </CardTitle>
                <CardDescription>
                  Recent interactions related to{" "}
                  {isOwner
                    ? "your listings"
                    : "properties you're interested in"}
                  .
                </CardDescription>
              </div>
              <Badge
                variant="outline"
                className="px-3 bg-muted/50 uppercase tracking-wider text-[10px] font-bold"
              >
                Last 10 Activities
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {visits.length === 0 ? (
                  <div className="py-20 text-center flex flex-col items-center opacity-50">
                    <Building2 className="size-12 mb-4" />
                    <p>No activity found yet.</p>
                  </div>
                ) : (
                  visits.slice(0, 10).map((visit: any) => (
                    <div
                      key={visit._id}
                      className="flex items-start gap-4 p-4 rounded-2xl border bg-card hover:bg-muted/30 transition-colors"
                    >
                      <div
                        className={`p-2 rounded-xl ${
                          visit.status === "APPROVED"
                            ? "bg-green-100 text-green-700"
                            : visit.status === "REJECTED"
                              ? "bg-red-100 text-red-700"
                              : visit.status === "SCHEDULED"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {visit.status === "APPROVED" ? (
                          <CheckCircle2 className="size-5" />
                        ) : visit.status === "REJECTED" ? (
                          <XCircle className="size-5" />
                        ) : visit.status === "SCHEDULED" ? (
                          <Clock className="size-5" />
                        ) : (
                          <AlertCircle className="size-5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-bold">
                            {isOwner
                              ? visit.tenant?.name
                              : visit.listing?.title}
                          </h4>
                          <span className="text-[10px] font-medium text-muted-foreground uppercase">
                            {formatDate(visit.updatedAt || visit.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {isOwner
                            ? `Requested a tour for ${visit.listing?.title}`
                            : `Tour request for ${visit.listing?.location}`}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge
                            variant="secondary"
                            className="text-[10px] font-bold px-2 h-5"
                          >
                            {visit.status}
                          </Badge>
                          {visit.scheduledDate && (
                            <span className="text-[10px] flex items-center gap-1 font-medium text-primary">
                              <Calendar className="size-3" /> Scheduled for{" "}
                              {formatDate(visit.scheduledDate)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
