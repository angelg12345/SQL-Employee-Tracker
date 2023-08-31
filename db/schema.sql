DROP DATABASE IF EXISTS employeeTrackerDB;

CREATE DATABASE employeeTrackerDB;

USE employeeTrackerDB;

CREATE TABLE department (
    department_id INT,
    department_name VARCHAR(30)
);

CREATE TABLE role (
    role_id INT,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT,
    CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES department(department_id) ON DELETE CASCADE
)

CREATE TABLE employee (
    employee_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT NULL,
    CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES role(role_id) ON DELETE SET NULL
)