CREATE TABLE task (
	id SERIAL PRIMARY KEY,
	name VARCHAR(80) NOT NULL,
	completed BOOLEAN NOT NULL DEFAULT FALSE
);

-- CREATE TABLE completed_tasks (
-- 	id SERIAL PRIMARY KEY,
-- 	completed_name VARCHAR(80) NOT NULL
--
-- ); // Created a completed_tasks table but it didn't work as planned
