INSERT INTO department (department_name)
VALUES ('Sales'),
       ('Engineering'),
       ('Finance'),
       ('Legal');

INSERT INTO role (title, salary, department_id, department_name)
VALUES
    ('Sales Lead', 100000, 1, 'Sales'),
    ('Salesperson', 80000, 1, 'Sales'),
    ('Lead Engineer', 150000, 2, 'Engineering'),
    ('Software Engineer', 120000, 2, 'Engineering'),
    ('Account Manager', 160000, 3, 'Finance'),
    ('Accountant', 125000, 3, 'Finance'),
    ('Legal Team Lead', 250000, 4, 'Legal'),
    ('Lawyer', 190000, 4, 'Legal');


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('John', 'Doe', 1, NULL),
       ('Mike', 'Chan', 2, 1),
       ('Angel', 'Garcia', 3, NULL),
       ('Kevin', 'Tupik', 4, 3),
       ('Kunal', 'Singh', 5, NULL),
       ('Malia', 'Brown', 6, 5),
       ('Sarah', 'Lourd', 7, NULL),
       ('Tom', 'Allen', 8, 7);
