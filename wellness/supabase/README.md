# הפעלת סנכרון ענן (Supabase) — אופציונלי

האפליקציה עובדת במלואה **בלי** סנכרון — כל הנתונים נשמרים מקומית במכשיר.
כדי לסנכרן בין הטלפון למחשב, בצע פעם אחת:

1. היכנס ל-https://supabase.com וצור פרויקט חינמי חדש.
2. ב-Dashboard → **SQL Editor** → New query → הדבק את התוכן של
   `supabase/migrations/0001_init.sql` → **Run**. זה יוצר את הטבלאות + הרשאות פרטיות (RLS).
3. ב-Dashboard → **Project Settings → API** העתק את:
   - **Project URL**
   - **anon public key**
4. בתיקיית `wellness/` צור קובץ בשם `.env.local` (אפשר להעתיק מ-`.env.local.example`) והזן:
   ```
   VITE_SUPABASE_URL=ה-Project-URL-שלך
   VITE_SUPABASE_ANON_KEY=ה-anon-key-שלך
   ```
5. ב-Dashboard → **Authentication → Providers** הפעל **Email** (קישור קסם / סיסמה).
6. הפעל מחדש את האפליקציה (`npm run dev`). מעתה ניתן להתחבר ולסנכרן.

> אבטחה: ה-anon key מיועד לצד-לקוח. ה-RLS מבטיח שכל משתמש רואה רק את הנתונים שלו.

הערה: שכבת הסנכרון (העלאה/הורדה) מתוכננת כשלב הבא — כרגע התשתית והסכמה מוכנות,
והאפליקציה פועלת מקומית-תחילה (local-first) על IndexedDB.
