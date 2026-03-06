-- PR2 - Core schema + strict RLS for Portal Web Escolar
-- Decision: we keep a single-school default model, but include `schools` for future multi-school support.

create extension if not exists "pgcrypto";

create type public.app_role as enum ('admin', 'coordination', 'teacher', 'student', 'guardian');
create type public.enrollment_status as enum ('active', 'inactive', 'transferred', 'graduated');
create type public.attendance_status as enum ('present', 'absent', 'late', 'excused');
create type public.announcement_scope as enum ('global', 'group');
create type public.file_visibility as enum ('private', 'group', 'school');
create type public.observation_category as enum ('academic', 'behavior', 'coexistence', 'wellbeing');

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.schools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  academic_year integer not null default 2026,
  grade_scale_min numeric(3,1) not null default 0.0,
  grade_scale_max numeric(3,1) not null default 5.0,
  passing_grade numeric(3,1) not null default 3.0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint schools_grade_scale_check check (grade_scale_min < grade_scale_max),
  constraint schools_passing_grade_check check (
    passing_grade >= grade_scale_min and passing_grade <= grade_scale_max
  )
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  school_id uuid references public.schools(id) on delete set null,
  full_name text not null,
  role public.app_role not null default 'student',
  doc_id text unique,
  phone text,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.grades (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  name text not null,
  level_order smallint not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint grades_school_name_unique unique (school_id, name)
);

create table if not exists public.groups (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  grade_id uuid not null references public.grades(id) on delete restrict,
  code text not null,
  name text not null,
  year integer not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint groups_school_year_code_unique unique (school_id, year, code)
);

create table if not exists public.subjects (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  code text not null,
  name text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint subjects_school_code_unique unique (school_id, code)
);

create table if not exists public.teacher_assignments (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.profiles(id) on delete cascade,
  group_id uuid not null references public.groups(id) on delete cascade,
  subject_id uuid not null references public.subjects(id) on delete cascade,
  year integer not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint teacher_assignments_unique unique (teacher_id, group_id, subject_id, year)
);

create table if not exists public.students (
  student_id uuid primary key references public.profiles(id) on delete cascade,
  school_id uuid not null references public.schools(id) on delete cascade,
  admission_code text unique,
  status public.enrollment_status not null default 'active',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.guardians (
  guardian_id uuid primary key references public.profiles(id) on delete cascade,
  school_id uuid not null references public.schools(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.guardian_students (
  guardian_id uuid not null references public.guardians(guardian_id) on delete cascade,
  student_id uuid not null references public.students(student_id) on delete cascade,
  relationship text not null default 'parent',
  created_at timestamptz not null default timezone('utc', now()),
  primary key (guardian_id, student_id)
);

create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(student_id) on delete cascade,
  group_id uuid not null references public.groups(id) on delete cascade,
  year integer not null,
  status public.enrollment_status not null default 'active',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint enrollments_unique unique (student_id, group_id, year)
);

create table if not exists public.periods (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  year integer not null,
  name text not null,
  start_date date not null,
  end_date date not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint periods_date_check check (start_date <= end_date),
  constraint periods_school_year_name_unique unique (school_id, year, name)
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references public.subjects(id) on delete cascade,
  group_id uuid not null references public.groups(id) on delete cascade,
  period_id uuid not null references public.periods(id) on delete cascade,
  title text not null,
  description text,
  max_score numeric(3,2) not null default 5.00,
  weight numeric(5,2) not null,
  due_date date,
  created_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint activities_max_score_check check (max_score > 0 and max_score <= 5.00),
  constraint activities_weight_check check (weight > 0 and weight <= 100.00)
);

create table if not exists public.grades_book (
  id uuid primary key default gen_random_uuid(),
  activity_id uuid not null references public.activities(id) on delete cascade,
  student_id uuid not null references public.students(student_id) on delete cascade,
  score numeric(3,2) not null,
  feedback text,
  created_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint grades_book_score_check check (score >= 0 and score <= 5.00),
  constraint grades_book_unique unique (activity_id, student_id)
);

create table if not exists public.attendance (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups(id) on delete cascade,
  student_id uuid not null references public.students(student_id) on delete cascade,
  attendance_date date not null,
  status public.attendance_status not null,
  recorded_by uuid not null references public.profiles(id) on delete restrict,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint attendance_unique unique (group_id, student_id, attendance_date)
);

create table if not exists public.observations (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(student_id) on delete cascade,
  group_id uuid references public.groups(id) on delete set null,
  created_by uuid not null references public.profiles(id) on delete restrict,
  category public.observation_category not null,
  details text not null,
  happened_at date not null default current_date,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  scope public.announcement_scope not null,
  group_id uuid references public.groups(id) on delete cascade,
  title text not null,
  body text not null,
  created_by uuid not null references public.profiles(id) on delete restrict,
  published_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint announcements_scope_group_check check (
    (scope = 'global' and group_id is null) or
    (scope = 'group' and group_id is not null)
  )
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.profiles(id) on delete cascade,
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  subject text,
  body text not null,
  read_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint messages_sender_recipient_check check (sender_id <> recipient_id)
);

create table if not exists public.files (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  bucket text not null default 'school-files',
  path text not null unique,
  meta jsonb not null default '{}'::jsonb,
  visibility public.file_visibility not null default 'private',
  related_entity text,
  related_id uuid,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_profiles_school_id on public.profiles(school_id);
create index if not exists idx_groups_grade_year on public.groups(grade_id, year);
create index if not exists idx_teacher_assignments_teacher_year on public.teacher_assignments(teacher_id, year);
create index if not exists idx_teacher_assignments_group_subject on public.teacher_assignments(group_id, subject_id);
create index if not exists idx_guardian_students_guardian on public.guardian_students(guardian_id);
create index if not exists idx_guardian_students_student on public.guardian_students(student_id);
create index if not exists idx_enrollments_student_year on public.enrollments(student_id, year);
create index if not exists idx_enrollments_group_year on public.enrollments(group_id, year);
create index if not exists idx_activities_group_subject_period on public.activities(group_id, subject_id, period_id);
create index if not exists idx_grades_book_student on public.grades_book(student_id);
create index if not exists idx_grades_book_activity on public.grades_book(activity_id);
create index if not exists idx_attendance_group_date on public.attendance(group_id, attendance_date);
create index if not exists idx_attendance_student_date on public.attendance(student_id, attendance_date);
create index if not exists idx_observations_student_date on public.observations(student_id, happened_at);
create index if not exists idx_announcements_scope_published on public.announcements(scope, published_at desc);
create index if not exists idx_announcements_group_published on public.announcements(group_id, published_at desc);
create index if not exists idx_messages_recipient_created on public.messages(recipient_id, created_at desc);
create index if not exists idx_files_owner on public.files(owner_id);
create index if not exists idx_files_related on public.files(related_entity, related_id);

create trigger schools_set_updated_at before update on public.schools
for each row execute function public.set_updated_at();
create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
create trigger grades_set_updated_at before update on public.grades
for each row execute function public.set_updated_at();
create trigger groups_set_updated_at before update on public.groups
for each row execute function public.set_updated_at();
create trigger subjects_set_updated_at before update on public.subjects
for each row execute function public.set_updated_at();
create trigger teacher_assignments_set_updated_at before update on public.teacher_assignments
for each row execute function public.set_updated_at();
create trigger students_set_updated_at before update on public.students
for each row execute function public.set_updated_at();
create trigger guardians_set_updated_at before update on public.guardians
for each row execute function public.set_updated_at();
create trigger enrollments_set_updated_at before update on public.enrollments
for each row execute function public.set_updated_at();
create trigger periods_set_updated_at before update on public.periods
for each row execute function public.set_updated_at();
create trigger activities_set_updated_at before update on public.activities
for each row execute function public.set_updated_at();
create trigger grades_book_set_updated_at before update on public.grades_book
for each row execute function public.set_updated_at();
create trigger attendance_set_updated_at before update on public.attendance
for each row execute function public.set_updated_at();
create trigger observations_set_updated_at before update on public.observations
for each row execute function public.set_updated_at();
create trigger announcements_set_updated_at before update on public.announcements
for each row execute function public.set_updated_at();
create trigger messages_set_updated_at before update on public.messages
for each row execute function public.set_updated_at();
create trigger files_set_updated_at before update on public.files
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested_role text;
  role_value public.app_role;
begin
  requested_role := lower(coalesce(new.raw_user_meta_data ->> 'role', 'student'));
  role_value := case
    when requested_role in ('admin', 'coordination', 'teacher', 'student', 'guardian')
      then requested_role::public.app_role
    else 'student'::public.app_role
  end;

  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    role_value
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.current_profile_role()
returns public.app_role
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((select p.role from public.profiles p where p.id = auth.uid()), 'student'::public.app_role);
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_profile_role() = 'admin'::public.app_role;
$$;

create or replace function public.is_admin_or_coordination()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_profile_role() in ('admin'::public.app_role, 'coordination'::public.app_role);
$$;

create or replace function public.is_guardian_of(student_uuid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.guardian_students gs
    where gs.guardian_id = auth.uid()
      and gs.student_id = student_uuid
  );
$$;

create or replace function public.is_teacher_of_group(group_uuid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.teacher_assignments ta
    where ta.teacher_id = auth.uid()
      and ta.group_id = group_uuid
  );
$$;

create or replace function public.is_teacher_of_student(student_uuid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.enrollments e
    join public.teacher_assignments ta
      on ta.group_id = e.group_id
      and ta.year = e.year
    where e.student_id = student_uuid
      and e.status = 'active'
      and ta.teacher_id = auth.uid()
  );
$$;

create or replace function public.can_access_student(student_uuid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    public.is_admin_or_coordination()
    or student_uuid = auth.uid()
    or public.is_guardian_of(student_uuid)
    or public.is_teacher_of_student(student_uuid);
$$;

create or replace function public.teacher_can_manage_activity(activity_uuid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.activities a
    join public.periods p on p.id = a.period_id
    join public.teacher_assignments ta
      on ta.group_id = a.group_id
      and ta.subject_id = a.subject_id
      and ta.year = p.year
    where a.id = activity_uuid
      and ta.teacher_id = auth.uid()
  );
$$;

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant usage, select on all sequences in schema public to authenticated;

alter table public.schools enable row level security;
alter table public.profiles enable row level security;
alter table public.grades enable row level security;
alter table public.groups enable row level security;
alter table public.subjects enable row level security;
alter table public.teacher_assignments enable row level security;
alter table public.students enable row level security;
alter table public.guardians enable row level security;
alter table public.guardian_students enable row level security;
alter table public.enrollments enable row level security;
alter table public.periods enable row level security;
alter table public.activities enable row level security;
alter table public.grades_book enable row level security;
alter table public.attendance enable row level security;
alter table public.observations enable row level security;
alter table public.announcements enable row level security;
alter table public.messages enable row level security;
alter table public.files enable row level security;

-- Profiles
create policy profiles_select_self on public.profiles
for select to authenticated
using (auth.uid() = id);

create policy profiles_select_admin_coord on public.profiles
for select to authenticated
using (public.is_admin_or_coordination());

create policy profiles_insert_self on public.profiles
for insert to authenticated
with check (
  auth.uid() = id
  and role = 'student'::public.app_role
);

create policy profiles_update_self on public.profiles
for update to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

create policy profiles_manage_admin on public.profiles
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Catalog tables
create policy schools_read_authenticated on public.schools
for select to authenticated
using (true);

create policy schools_manage_admin on public.schools
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy grades_read_relevant on public.grades
for select to authenticated
using (
  public.is_admin_or_coordination()
  or exists (
    select 1
    from public.groups g
    where g.grade_id = grades.id
      and (
        public.is_teacher_of_group(g.id)
        or exists (
          select 1 from public.enrollments e
          where e.group_id = g.id
            and e.student_id = auth.uid()
        )
        or exists (
          select 1
          from public.enrollments e
          join public.guardian_students gs on gs.student_id = e.student_id
          where e.group_id = g.id
            and gs.guardian_id = auth.uid()
        )
      )
  )
);

create policy grades_manage_admin_coord on public.grades
for all to authenticated
using (public.is_admin_or_coordination())
with check (public.is_admin_or_coordination());

create policy groups_read_relevant on public.groups
for select to authenticated
using (
  public.is_admin_or_coordination()
  or public.is_teacher_of_group(id)
  or exists (
    select 1
    from public.enrollments e
    where e.group_id = groups.id
      and (e.student_id = auth.uid() or public.is_guardian_of(e.student_id))
  )
);

create policy groups_manage_admin_coord on public.groups
for all to authenticated
using (public.is_admin_or_coordination())
with check (public.is_admin_or_coordination());

create policy subjects_read_relevant on public.subjects
for select to authenticated
using (
  public.is_admin_or_coordination()
  or exists (
    select 1
    from public.teacher_assignments ta
    where ta.subject_id = subjects.id
      and ta.teacher_id = auth.uid()
  )
  or exists (
    select 1
    from public.activities a
    join public.enrollments e on e.group_id = a.group_id
    where a.subject_id = subjects.id
      and (e.student_id = auth.uid() or public.is_guardian_of(e.student_id))
  )
);

create policy subjects_manage_admin_coord on public.subjects
for all to authenticated
using (public.is_admin_or_coordination())
with check (public.is_admin_or_coordination());

create policy periods_read_relevant on public.periods
for select to authenticated
using (
  public.is_admin_or_coordination()
  or exists (
    select 1
    from public.activities a
    join public.enrollments e on e.group_id = a.group_id
    where a.period_id = periods.id
      and (e.student_id = auth.uid() or public.is_guardian_of(e.student_id))
  )
  or exists (
    select 1
    from public.activities a
    where a.period_id = periods.id
      and public.is_teacher_of_group(a.group_id)
  )
);

create policy periods_manage_admin_coord on public.periods
for all to authenticated
using (public.is_admin_or_coordination())
with check (public.is_admin_or_coordination());

-- Assignments and enrollments
create policy teacher_assignments_select on public.teacher_assignments
for select to authenticated
using (
  public.is_admin_or_coordination()
  or teacher_id = auth.uid()
);

create policy teacher_assignments_manage_admin_coord on public.teacher_assignments
for all to authenticated
using (public.is_admin_or_coordination())
with check (public.is_admin_or_coordination());

create policy students_select on public.students
for select to authenticated
using (public.can_access_student(student_id));

create policy students_manage_admin_coord on public.students
for all to authenticated
using (public.is_admin_or_coordination())
with check (public.is_admin_or_coordination());

create policy guardians_select on public.guardians
for select to authenticated
using (
  public.is_admin_or_coordination()
  or guardian_id = auth.uid()
);

create policy guardians_manage_admin_coord on public.guardians
for all to authenticated
using (public.is_admin_or_coordination())
with check (public.is_admin_or_coordination());

create policy guardian_students_select on public.guardian_students
for select to authenticated
using (
  public.is_admin_or_coordination()
  or guardian_id = auth.uid()
);

create policy guardian_students_manage_admin_coord on public.guardian_students
for all to authenticated
using (public.is_admin_or_coordination())
with check (public.is_admin_or_coordination());

create policy enrollments_select on public.enrollments
for select to authenticated
using (
  public.can_access_student(student_id)
  or public.is_teacher_of_group(group_id)
);

create policy enrollments_manage_admin_coord on public.enrollments
for all to authenticated
using (public.is_admin_or_coordination())
with check (public.is_admin_or_coordination());

-- Academic operation
create policy activities_select on public.activities
for select to authenticated
using (
  public.is_admin_or_coordination()
  or public.is_teacher_of_group(group_id)
  or exists (
    select 1
    from public.enrollments e
    where e.group_id = activities.group_id
      and (e.student_id = auth.uid() or public.is_guardian_of(e.student_id))
  )
);

create policy activities_insert_teacher on public.activities
for insert to authenticated
with check (
  public.is_admin_or_coordination()
  or (
    public.current_profile_role() = 'teacher'::public.app_role
    and public.is_teacher_of_group(group_id)
    and created_by = auth.uid()
  )
);

create policy activities_update_teacher on public.activities
for update to authenticated
using (
  public.is_admin_or_coordination()
  or (public.teacher_can_manage_activity(id) and created_by = auth.uid())
)
with check (
  public.is_admin_or_coordination()
  or (public.teacher_can_manage_activity(id) and created_by = auth.uid())
);

create policy activities_delete_teacher on public.activities
for delete to authenticated
using (
  public.is_admin_or_coordination()
  or (public.teacher_can_manage_activity(id) and created_by = auth.uid())
);

create policy grades_book_select on public.grades_book
for select to authenticated
using (
  public.is_admin_or_coordination()
  or student_id = auth.uid()
  or public.is_guardian_of(student_id)
  or public.teacher_can_manage_activity(activity_id)
);

create policy grades_book_insert on public.grades_book
for insert to authenticated
with check (
  public.is_admin_or_coordination()
  or (
    public.current_profile_role() = 'teacher'::public.app_role
    and public.teacher_can_manage_activity(activity_id)
    and created_by = auth.uid()
  )
);

create policy grades_book_update on public.grades_book
for update to authenticated
using (
  public.is_admin_or_coordination()
  or (public.teacher_can_manage_activity(activity_id) and created_by = auth.uid())
)
with check (
  public.is_admin_or_coordination()
  or (public.teacher_can_manage_activity(activity_id) and created_by = auth.uid())
);

create policy grades_book_delete on public.grades_book
for delete to authenticated
using (
  public.is_admin_or_coordination()
  or (public.teacher_can_manage_activity(activity_id) and created_by = auth.uid())
);

create policy attendance_select on public.attendance
for select to authenticated
using (
  public.is_admin_or_coordination()
  or public.is_teacher_of_group(group_id)
  or public.can_access_student(student_id)
);

create policy attendance_manage on public.attendance
for all to authenticated
using (
  public.is_admin_or_coordination()
  or public.is_teacher_of_group(group_id)
)
with check (
  public.is_admin_or_coordination()
  or (
    public.current_profile_role() = 'teacher'::public.app_role
    and public.is_teacher_of_group(group_id)
    and recorded_by = auth.uid()
  )
);

create policy observations_select on public.observations
for select to authenticated
using (
  public.is_admin_or_coordination()
  or public.can_access_student(student_id)
);

create policy observations_insert on public.observations
for insert to authenticated
with check (
  public.is_admin_or_coordination()
  or (
    public.current_profile_role() = 'teacher'::public.app_role
    and public.is_teacher_of_student(student_id)
    and created_by = auth.uid()
  )
);

create policy observations_update on public.observations
for update to authenticated
using (
  public.is_admin_or_coordination()
  or created_by = auth.uid()
)
with check (
  public.is_admin_or_coordination()
  or created_by = auth.uid()
);

create policy observations_delete on public.observations
for delete to authenticated
using (
  public.is_admin_or_coordination()
  or created_by = auth.uid()
);

create policy announcements_select on public.announcements
for select to authenticated
using (
  scope = 'global'
  or public.is_admin_or_coordination()
  or (
    scope = 'group'
    and (
      public.is_teacher_of_group(group_id)
      or exists (
        select 1
        from public.enrollments e
        where e.group_id = announcements.group_id
          and (e.student_id = auth.uid() or public.is_guardian_of(e.student_id))
      )
    )
  )
);

create policy announcements_insert on public.announcements
for insert to authenticated
with check (
  public.is_admin_or_coordination()
  or (
    public.current_profile_role() = 'teacher'::public.app_role
    and scope = 'group'
    and public.is_teacher_of_group(group_id)
    and created_by = auth.uid()
  )
);

create policy announcements_update on public.announcements
for update to authenticated
using (
  public.is_admin_or_coordination()
  or created_by = auth.uid()
)
with check (
  public.is_admin_or_coordination()
  or created_by = auth.uid()
);

create policy announcements_delete on public.announcements
for delete to authenticated
using (
  public.is_admin_or_coordination()
  or created_by = auth.uid()
);

create policy messages_select on public.messages
for select to authenticated
using (
  public.is_admin_or_coordination()
  or sender_id = auth.uid()
  or recipient_id = auth.uid()
);

create policy messages_insert on public.messages
for insert to authenticated
with check (
  sender_id = auth.uid()
  and exists (select 1 from public.profiles p where p.id = recipient_id)
);

create policy messages_update on public.messages
for update to authenticated
using (
  recipient_id = auth.uid()
  or sender_id = auth.uid()
  or public.is_admin_or_coordination()
)
with check (
  recipient_id = auth.uid()
  or sender_id = auth.uid()
  or public.is_admin_or_coordination()
);

create policy files_select on public.files
for select to authenticated
using (
  public.is_admin_or_coordination()
  or owner_id = auth.uid()
  or visibility = 'school'
  or (
    visibility = 'group'
    and related_entity = 'group'
    and (
      public.is_teacher_of_group(related_id)
      or exists (
        select 1
        from public.enrollments e
        where e.group_id = related_id
          and (e.student_id = auth.uid() or public.is_guardian_of(e.student_id))
      )
    )
  )
  or (related_entity = 'student' and public.can_access_student(related_id))
);

create policy files_insert on public.files
for insert to authenticated
with check (
  public.is_admin_or_coordination()
  or owner_id = auth.uid()
);

create policy files_update on public.files
for update to authenticated
using (
  public.is_admin_or_coordination()
  or owner_id = auth.uid()
)
with check (
  public.is_admin_or_coordination()
  or owner_id = auth.uid()
);

create policy files_delete on public.files
for delete to authenticated
using (
  public.is_admin_or_coordination()
  or owner_id = auth.uid()
);