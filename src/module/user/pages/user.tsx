import MainLayout from "@/components/main-layout";
import { useUsers } from "../hooks/user-hook";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { User, ShieldCheck, UserCog, Ghost } from "lucide-react";
import { useState, useMemo } from "react";
import { useSearchParams } from "react-router";
import SEO from "@/components/seo";

export default function UserPage() {
  const { data, isLoading, isError } = useUsers();
  const [searchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const users = data?.data || [];

  const filteredUsers = useMemo(() => {
    const search = searchParams.get("search")?.toLowerCase() || "";
    if (!search) return users;
    return users.filter(
      (u: any) =>
        u.name?.toLowerCase().includes(search) ||
        u.email?.toLowerCase().includes(search) ||
        u.role?.toLowerCase().includes(search),
    );
  }, [users, searchParams]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = useMemo(() => {
    return filteredUsers.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    );
  }, [filteredUsers, currentPage]);

  if (isLoading) return <MainLayout.Loading />;
  if (isError) return <MainLayout.Error />;

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "BIGBOSS":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-none flex items-center gap-1 w-fit">
            <ShieldCheck className="size-3" /> BIGBOSS
          </Badge>
        );
      case "OWNER":
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none flex items-center gap-1 w-fit">
            <UserCog className="size-3" /> OWNER
          </Badge>
        );
      case "TENANT":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-none flex items-center gap-1 w-fit">
            <User className="size-3" /> TENANT
          </Badge>
        );
      default:
        return <Badge variant="secondary">{role}</Badge>;
    }
  };

  return (
    <MainLayout>
      <SEO
        title="Account Central"
        description="Monitor platform users, manage permissions and track new registrations."
      />

      <MainLayout.Title
        title="User Management"
        description={`Found ${filteredUsers.length} total active accounts on the platform.`}
      />

      <MainLayout.Header className="mt-4">
        <MainLayout.Search placeholder="Filter by name, email or role..." />
        <MainLayout.Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </MainLayout.Header>

      <Card className="border shadow-sm rounded-xl overflow-hidden mt-2 bg-card">
        <CardContent className="p-0">
          <div className="w-full overflow-x-auto">
            <Table className="table-fixed w-full">
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="px-6 font-bold py-4 text-muted-foreground w-[300px]">
                    User Identity
                  </TableHead>
                  <TableHead className="font-bold py-4 text-muted-foreground w-[250px]">
                    Email Address
                  </TableHead>
                  <TableHead className="font-bold py-4 text-muted-foreground w-[150px]">
                    Access Level
                  </TableHead>
                  <TableHead className="px-6 text-right font-bold py-4 text-muted-foreground w-[180px]">
                    Registration Date
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground">
                        <Ghost className="size-12 opacity-10 animate-bounce" />
                        <h3 className="text-lg font-semibold text-foreground">
                          No Users Detected
                        </h3>
                        <p className="max-w-[200px] text-sm">
                          We couldn't find any users matching your current
                          criteria.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedUsers.map((user: any) => (
                    <TableRow
                      key={user._id}
                      className="group transition-colors hover:bg-muted/50"
                    >
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="size-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-sm shadow-sm">
                            {user.name?.charAt(0).toUpperCase() || "U"}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-foreground leading-tight">
                              {user.name}
                            </span>
                            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-black mt-0.5">
                              ID: {user._id?.slice(-8)}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 font-medium text-muted-foreground">
                        {user.email}
                      </TableCell>
                      <TableCell className="py-4">
                        {getRoleBadge(user.role)}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right text-muted-foreground tabular-nums font-medium">
                        {user.createdAt
                          ? format(new Date(user.createdAt), "MMM d, yyyy")
                          : "Legacy Account"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </MainLayout>
  );
}
