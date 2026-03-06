-- PR2 seed data for local/dev environments
-- Decision: fixed UUIDs make test fixtures deterministic.

create extension if not exists "pgcrypto";

do $$
declare
  school_uuid constant uuid := '11111111-1111-1111-1111-111111111111';
  grade_uuid constant uuid := '22222222-2222-2222-2222-222222222221';
  group_uuid constant uuid := '33333333-3333-3333-3333-333333333331';
  subject_uuid constant uuid := '44444444-4444-4444-4444-444444444441';
  period1_uuid constant uuid := '55555555-5555-5555-5555-555555555551';
  period2_uuid constant uuid := '55555555-5555-5555-5555-555555555552';
  period3_uuid constant uuid := '55555555-5555-5555-5555-555555555553';
  period4_uuid constant uuid := '55555555-5555-5555-5555-555555555554';
  activity_uuid constant uuid := '66666666-6666-6666-6666-666666666661';
  enrollment_uuid constant uuid := '77777777-7777-7777-7777-777777777771';
  assignment_uuid constant uuid := '88888888-8888-8888-8888-888888888881';
  grade_book_uuid constant uuid := '99999999-9999-9999-9999-999999999991';
  attendance_uuid constant uuid := 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1';
  announcement_global_uuid constant uuid := 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1';
  announcement_group_uuid constant uuid := 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2';
  message_uuid constant uuid := 'cccccccc-cccc-cccc-cccc-ccccccccccc1';
  file_uuid constant uuid := 'dddddddd-dddd-dddd-dddd-ddddddddddd1';

  admin_uuid constant uuid := '10000000-0000-0000-0000-000000000001';
  coordination_uuid constant uuid := '10000000-0000-0000-0000-000000000002';
  teacher_uuid constant uuid := '10000000-0000-0000-0000-000000000003';
  student_uuid constant uuid := '10000000-0000-0000-0000-000000000004';
  guardian_uuid constant uuid := '10000000-0000-0000-0000-000000000005';
begin
  insert into auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  )
  values
  (
    '00000000-0000-0000-0000-000000000000',
    admin_uuid,
    'authenticated',
    'authenticated',
    'admin@colegio.local',
    crypt('Password123*', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"admin"}',
    '{"full_name":"Admin Colegio","role":"admin"}',
    now(), now(), '', '', '', ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    coordination_uuid,
    'authenticated',
    'authenticated',
    'coordinacion@colegio.local',
    crypt('Password123*', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"coordination"}',
    '{"full_name":"Coordinacion Colegio","role":"coordination"}',
    now(), now(), '', '', '', ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    teacher_uuid,
    'authenticated',
    'authenticated',
    'docente@colegio.local',
    crypt('Password123*', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"teacher"}',
    '{"full_name":"Docente Demo","role":"teacher"}',
    now(), now(), '', '', '', ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    student_uuid,
    'authenticated',
    'authenticated',
    'estudiante@colegio.local',
    crypt('Password123*', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"student"}',
    '{"full_name":"Estudiante Demo","role":"student"}',
    now(), now(), '', '', '', ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    guardian_uuid,
    'authenticated',
    'authenticated',
    'acudiente@colegio.local',
    crypt('Password123*', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"],"role":"guardian"}',
    '{"full_name":"Acudiente Demo","role":"guardian"}',
    now(), now(), '', '', '', ''
  )
  on conflict (id) do nothing;

  insert into auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
  values
    (gen_random_uuid(), admin_uuid, '{"sub":"10000000-0000-0000-0000-000000000001","email":"admin@colegio.local"}', 'email', 'admin@colegio.local', now(), now(), now()),
    (gen_random_uuid(), coordination_uuid, '{"sub":"10000000-0000-0000-0000-000000000002","email":"coordinacion@colegio.local"}', 'email', 'coordinacion@colegio.local', now(), now(), now()),
    (gen_random_uuid(), teacher_uuid, '{"sub":"10000000-0000-0000-0000-000000000003","email":"docente@colegio.local"}', 'email', 'docente@colegio.local', now(), now(), now()),
    (gen_random_uuid(), student_uuid, '{"sub":"10000000-0000-0000-0000-000000000004","email":"estudiante@colegio.local"}', 'email', 'estudiante@colegio.local', now(), now(), now()),
    (gen_random_uuid(), guardian_uuid, '{"sub":"10000000-0000-0000-0000-000000000005","email":"acudiente@colegio.local"}', 'email', 'acudiente@colegio.local', now(), now(), now())
  on conflict (provider_id, provider) do nothing;

  insert into public.schools (id, name, academic_year, grade_scale_min, grade_scale_max, passing_grade)
  values (school_uuid, '[COLEGIO]', 2026, 0.0, 5.0, 3.0)
  on conflict (id) do update set name = excluded.name;

  update public.profiles
  set school_id = school_uuid
  where id in (admin_uuid, coordination_uuid, teacher_uuid, student_uuid, guardian_uuid);

  insert into public.grades (id, school_id, name, level_order)
  values (grade_uuid, school_uuid, 'Grado 10', 10)
  on conflict (id) do nothing;

  insert into public.groups (id, school_id, grade_id, code, name, year)
  values (group_uuid, school_uuid, grade_uuid, '10A', 'Decimo A', 2026)
  on conflict (id) do nothing;

  insert into public.subjects (id, school_id, code, name)
  values (subject_uuid, school_uuid, 'MAT', 'Matematicas')
  on conflict (id) do nothing;

  insert into public.students (student_id, school_id, admission_code, status)
  values (student_uuid, school_uuid, 'ADM-2026-001', 'active')
  on conflict (student_id) do nothing;

  insert into public.guardians (guardian_id, school_id)
  values (guardian_uuid, school_uuid)
  on conflict (guardian_id) do nothing;

  insert into public.guardian_students (guardian_id, student_id, relationship)
  values (guardian_uuid, student_uuid, 'parent')
  on conflict (guardian_id, student_id) do nothing;

  insert into public.teacher_assignments (id, teacher_id, group_id, subject_id, year)
  values (assignment_uuid, teacher_uuid, group_uuid, subject_uuid, 2026)
  on conflict (id) do nothing;

  insert into public.enrollments (id, student_id, group_id, year, status)
  values (enrollment_uuid, student_uuid, group_uuid, 2026, 'active')
  on conflict (id) do nothing;

  insert into public.periods (id, school_id, year, name, start_date, end_date)
  values
    (period1_uuid, school_uuid, 2026, 'P1', '2026-01-20', '2026-03-20'),
    (period2_uuid, school_uuid, 2026, 'P2', '2026-03-23', '2026-06-05'),
    (period3_uuid, school_uuid, 2026, 'P3', '2026-06-29', '2026-09-11'),
    (period4_uuid, school_uuid, 2026, 'P4', '2026-09-14', '2026-11-27')
  on conflict (id) do nothing;

  insert into public.activities (id, subject_id, group_id, period_id, title, description, max_score, weight, due_date, created_by)
  values (
    activity_uuid,
    subject_uuid,
    group_uuid,
    period1_uuid,
    'Quiz Algebra 1',
    'Actividad inicial de algebra para diagnostico.',
    5.00,
    20.00,
    '2026-02-14',
    teacher_uuid
  )
  on conflict (id) do nothing;

  insert into public.grades_book (id, activity_id, student_id, score, feedback, created_by)
  values (grade_book_uuid, activity_uuid, student_uuid, 4.30, 'Buen inicio de periodo.', teacher_uuid)
  on conflict (id) do nothing;

  insert into public.attendance (id, group_id, student_id, attendance_date, status, recorded_by, notes)
  values (attendance_uuid, group_uuid, student_uuid, '2026-02-10', 'present', teacher_uuid, 'Asistencia normal')
  on conflict (id) do nothing;

  insert into public.announcements (id, school_id, scope, group_id, title, body, created_by)
  values
    (
      announcement_global_uuid,
      school_uuid,
      'global',
      null,
      'Inicio de ano escolar 2026',
      'Bienvenidos al ano escolar 2026. Revisar cronograma institucional.',
      coordination_uuid
    ),
    (
      announcement_group_uuid,
      school_uuid,
      'group',
      group_uuid,
      'Reunion acudientes 10A',
      'La reunion sera el viernes a las 7:00 AM en el auditorio.',
      teacher_uuid
    )
  on conflict (id) do nothing;

  insert into public.messages (id, sender_id, recipient_id, subject, body)
  values (
    message_uuid,
    teacher_uuid,
    guardian_uuid,
    'Seguimiento academico',
    'El estudiante tuvo buen desempeno en la primera actividad.'
  )
  on conflict (id) do nothing;

  insert into public.files (id, owner_id, bucket, path, meta, visibility, related_entity, related_id)
  values (
    file_uuid,
    teacher_uuid,
    'school-files',
    'groups/10a/syllabus-mat-2026.pdf',
    '{"mime_type":"application/pdf","size":102400}',
    'group',
    'group',
    group_uuid
  )
  on conflict (id) do nothing;
end $$;