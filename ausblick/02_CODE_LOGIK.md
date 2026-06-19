# Next.js Logik: Admin vs. User

Hier steht, wie du im Code unterscheidest, ob ein Admin (Du/Kollege) oder ein User (Kunde) eingeloggt ist.

## 1. Die Rolle im Server abfragen
In deinen Server Components (z.B. `dashboard/page.tsx`) kannst du die Rolle prüfen:

```typescript
const supabase = createClient();
const { data: { user } } = await supabase.auth.getUser();

// Rolle aus der neuen Tabelle holen
const { data: roleData } = await supabase
  .from('user_roles')
  .select('role')
  .eq('user_id', user.id)
  .single();

const isAdmin = roleData?.role === 'ADMIN';
```

## 2. UI-Elemente bedingt anzeigen
Im Dashboard kannst du `isAdmin` nutzen, um Admin-Features ein/auszublenden:

```tsx
{isAdmin && (
  <Button variant="outline">Spalten-Konfiguration</Button>
)}

{/* Kunden sehen nur ihre Leads (wird durch RLS in DB automatisch gefiltert) */}
<LeadTable leads={leads} isAdmin={isAdmin} />
```

## 3. Middleware Schutz
Du kannst die `middleware.ts` so erweitern, dass bestimmte Routen (z.B. `/admin`) nur für die Rolle 'ADMIN' zugänglich sind.
