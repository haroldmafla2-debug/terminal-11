CREATE TYPE role_enum AS ENUM ('admin', 'profesor', 'estudiante');
CREATE TYPE activity_status_enum AS ENUM ('draft', 'published', 'closed');
CREATE TYPE version_event_enum AS ENUM ('autosave', 'run', 'submit');

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(120) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role role_enum NOT NULL,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(120) UNIQUE NOT NULL,
    grade VARCHAR(20) NOT NULL,
    created_by INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enrollments (
    id SERIAL PRIMARY KEY,
    course_id INTEGER NOT NULL REFERENCES courses(id),
    student_id INTEGER NOT NULL REFERENCES users(id),
    UNIQUE(course_id, student_id)
);

CREATE TABLE activities (
    id SERIAL PRIMARY KEY,
    course_id INTEGER NOT NULL REFERENCES courses(id),
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    due_date TIMESTAMPTZ,
    status activity_status_enum NOT NULL DEFAULT 'published',
    lock_after_submit BOOLEAN NOT NULL DEFAULT TRUE,
    exam_mode BOOLEAN NOT NULL DEFAULT FALSE,
    exam_minutes INTEGER,
    disable_copy_paste BOOLEAN NOT NULL DEFAULT FALSE,
    fullscreen_required BOOLEAN NOT NULL DEFAULT FALSE,
    created_by INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE submissions (
    id SERIAL PRIMARY KEY,
    activity_id INTEGER NOT NULL REFERENCES activities(id),
    student_id INTEGER NOT NULL REFERENCES users(id),
    code TEXT NOT NULL DEFAULT '',
    latest_output TEXT NOT NULL DEFAULT '',
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_saved_at TIMESTAMPTZ,
    last_run_at TIMESTAMPTZ,
    run_count INTEGER NOT NULL DEFAULT 0,
    is_submitted BOOLEAN NOT NULL DEFAULT FALSE,
    submitted_at TIMESTAMPTZ,
    editing_locked BOOLEAN NOT NULL DEFAULT FALSE,
    UNIQUE(activity_id, student_id)
);

CREATE TABLE code_versions (
    id SERIAL PRIMARY KEY,
    submission_id INTEGER NOT NULL REFERENCES submissions(id),
    event_type version_event_enum NOT NULL,
    code TEXT NOT NULL,
    output TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action VARCHAR(120) NOT NULL,
    entity VARCHAR(80) NOT NULL,
    entity_id VARCHAR(80) NOT NULL,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

