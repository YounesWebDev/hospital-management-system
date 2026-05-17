import { useState, useMemo } from 'react';
import { Search, User, Mail, Fingerprint } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Head } from '@inertiajs/react';

type Patient = {
  code: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
};

interface Props {
  records?: Patient[];
}

export default function PatientsPage({ records = [] }: Props) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    if (term.length < 2) return records;
    return records.filter((r) =>
      r.name?.toLowerCase().includes(term) ||
      r.email?.toLowerCase().includes(term) ||
      r.code?.toLowerCase().includes(term)
    );
  }, [search, records]);

  return (
    <>
      <Head title="Patients" />

      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight">Patients</h1>
            <p className="text-muted-foreground">Manage and review all patient records in the system.</p>
          </div>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email or code..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.length > 0 ? (
            filtered.map((p) => (
              <Card key={p.code} className="group hover:border-primary/50 transition-colors">
                <CardHeader className="p-4 space-y-1">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="font-mono text-[10px]">
                      {p.code}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`text-[10px] px-1 h-4 ${
                        p.status === 'active'
                          ? 'text-green-600 border-green-200 bg-green-50'
                          : 'text-red-600 border-red-200 bg-red-50'
                      }`}
                    >
                      {p.status}
                    </Badge>
                  </div>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <User className="size-4 text-primary" />
                    {p.name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <Mail className="size-3" />
                    {p.email}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Fingerprint className="size-3" />
                    <span>Patient Code: {p.code}</span>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12 border rounded-lg bg-muted/20">
              <Search className="mx-auto size-12 text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">No patients found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
