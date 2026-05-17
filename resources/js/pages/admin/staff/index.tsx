import { useState, useMemo } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import staff from '@/routes/admin/staff';

import { Input } from '@/components/ui/input';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, CheckCircle, XCircle, Search, User, Mail, ShieldCheck, Plus, Edit2 } from 'lucide-react';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';

type Staff = {
  id: number;
  name: string;
  email: string;
  username: string;
  role: string;
  status: 'active' | 'inactive';
};

export default function StaffPage({
  records,
}: {
  records: Staff[];
}) {
  const [search, setSearch] = useState('');
  const [staffList, setStaffList] = useState<Staff[]>(records);
  const [alertOpen, setAlertOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<number | null>(null);

  const filteredStaff = useMemo(() => {
    const term = search.toLowerCase();
    return staffList.filter(
      (r) =>
        r.name.toLowerCase().includes(term) ||
        r.email.toLowerCase().includes(term) ||
        r.username.toLowerCase().includes(term) ||
        r.role.toLowerCase().includes(term)
    );
  }, [search, staffList]);

  const toggleStatus = (id: number) => {
    router.post(
      staff.toggleStatus(id).url,
      {},
      {
        onSuccess: () => {
          setStaffList((prev) =>
            prev.map((member) =>
              member.id === id
                ? {
                    ...member,
                    status: member.status === 'active' ? 'inactive' : 'active',
                  }
                : member
            )
          );
        },
        onError: (errors) => {
          console.error('Failed to toggle status:', errors);
        },
      }
    );
  };

  const confirmDelete = (id: number) => {
    setSelectedStaff(id);
    setAlertOpen(true);
  };

  const removeStaff = () => {
    if (!selectedStaff) return;

    router.post(
      staff.destroy(selectedStaff).url,
      {},
      {
        onSuccess: () => {
          setStaffList((prev) => prev.filter((member) => member.id !== selectedStaff));
          setAlertOpen(false);
          setSelectedStaff(null);
        },
        onError: (errors) => {
          console.error('Failed to remove staff:', errors);
        },
      }
    );
  };

  return (
    <>
      <Head title="Staff Management" />

      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight">Staff Management</h1>
            <p className="text-muted-foreground">Manage system access and roles for hospital staff.</p>
          </div>
          <Button asChild className="w-fit">
            <Link href={staff.create.url()}>
              <Plus className="mr-2 size-4" /> Add New Staff
            </Link>
          </Button>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
          <Input
            placeholder="Search staff by name, role, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredStaff.length === 0 ? (
            <div className="col-span-full text-center py-12 border rounded-lg bg-muted/20">
              <Search className="mx-auto size-12 text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">No staff found matching your search.</p>
            </div>
          ) : (
            filteredStaff.map((s) => (
              <Card key={s.id} className="group hover:border-primary/50 transition-colors">
                <CardHeader className="p-4 space-y-1">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="font-mono text-[10px]">
                      {s.role}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`text-[10px] px-1 h-4 ${
                        s.status === 'active'
                          ? 'text-green-600 border-green-200 bg-green-50'
                          : 'text-red-600 border-red-200 bg-red-50'
                      }`}
                    >
                      {s.status}
                    </Badge>
                  </div>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <User className="size-4 text-primary" />
                    {s.name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <Mail className="size-3" />
                    {s.email}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ShieldCheck className="size-3" />
                    <span>Username: {s.username}</span>
                  </div>

                  <div className="flex items-center justify-between border-t border-border/50 pt-2">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleStatus(s.id)}
                        className="h-8 px-2 text-xs flex items-center gap-1"
                      >
                        {s.status === 'active' ? (
                          <XCircle className="size-3 text-red-600" />
                        ) : (
                          <CheckCircle className="size-3 text-green-500" />
                        )}
                        {s.status === 'active' ? 'Deactivate' : 'Activate'}
                      </Button>

                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          window.location.href = staff.edit(s.id).url;
                        }}
                        className="h-8 px-2 text-xs flex items-center gap-1"
                      >
                        <Edit2 className="size-3" />
                        Edit
                      </Button>
                    </div>

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => confirmDelete(s.id)}
                      className="h-8 px-2 text-xs flex items-center gap-1"
                    >
                      <Trash2 className="size-3" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      <AlertDialog
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
        onConfirm={removeStaff}
        title="Confirm Deletion"
        description="Are you sure you want to delete this staff account?"
      />
    </>
  );
}


