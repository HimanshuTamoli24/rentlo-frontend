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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LoadingPage from "@/components/loading";
import ErrorPage from "@/components/error-page";
import { format } from "date-fns";
import { User, ShieldCheck, UserCog, Ghost } from "lucide-react";

export default function UserPage() {
  const { data, isLoading, isError } = useUsers();

  if (isLoading) return <LoadingPage />;
  if (isError) return <ErrorPage />;

  const users = data?.data || [];

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
    <MainLayout
      title="User Management"
      description="View and manage all registered users in the platform."
    >
      <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm overflow-hidden">
        <CardHeader className="border-b bg-muted/30">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl flex items-center gap-2">
              <User className="size-5 text-primary" />
              Users ({users.length})
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/20 hover:bg-muted/20">
                <TableHead className="px-6 h-12 font-bold text-foreground">
                  Name
                </TableHead>
                <TableHead className="h-12 font-bold text-foreground">
                  Email
                </TableHead>
                <TableHead className="h-12 font-bold text-foreground">
                  Role
                </TableHead>
                <TableHead className="h-12 font-bold text-foreground">
                  Joined On
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-48 text-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Ghost className="size-10 opacity-20" />
                      <p>No users found.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user: any) => (
                  <TableRow
                    key={user._id}
                    className="group transition-colors hover:bg-muted/30"
                  >
                    <TableCell className="px-6 py-4 font-medium">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                          {user.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        {user.name}
                      </div>
                    </TableCell>
                    <TableCell className="py-4 text-muted-foreground">
                      {user.email}
                    </TableCell>
                    <TableCell className="py-4">
                      {getRoleBadge(user.role)}
                    </TableCell>
                    <TableCell className="py-4 text-muted-foreground text-sm">
                      {user.createdAt
                        ? format(new Date(user.createdAt), "PPP")
                        : "N/A"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </MainLayout>
  );
}
