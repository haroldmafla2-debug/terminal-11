# Supabase notes

## Migration order

1. `supabase/migrations/20260305220000_pr2_core_schema.sql`

## What is included

- Domain tables for school portal modules.
- Constraints, unique keys, indexes.
- Triggers for `updated_at`.
- Auth trigger (`handle_new_user`) for profile bootstrap.
- Strict RLS policies by role.
- Helper SQL functions for authorization checks.

## Seed scope

- Base school setup for 2026.
- Roles and sample users.
- One grade, one group, one subject.
- One assignment, one enrollment, one activity.
- Example grade, attendance, announcements, message, and file metadata.