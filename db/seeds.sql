-- Department seeds
INSERT INTO department (name)
VALUE ("Sales");
INSERT INTO department (name)
VALUE ("Engineering");
INSERT INTO department (name)
VALUE ("Finance");
INSERT INTO department (name)
VALUE ("Legal");

-- Employee role seeds -------
INSERT INTO role (title, salary, department_id)
VALUE ("Lead Engineer", 200000, 2);
INSERT INTO role (title, salary, department_id)
VALUE ("Legal Team Lead", 300000, 4);
INSERT INTO role (title, salary, department_id)
VALUE ("Accountant", 150000, 3);
INSERT INTO role (title, salary, department_id)
VALUE ("Sales Lead", 120000, 1);
INSERT INTO role (title, salary, department_id)
VALUE ("Salesperson", 100000, 1);
INSERT INTO role (title, salary, department_id)
VALUE ("Software Engineer", 150000, 2);
INSERT INTO role (title, salary, department_id)
VALUE ("Lawyer", 250000, 4);

-- Employee seeds -------
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Jessica", "Lin", null, 1);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Tom", "Brady", null, 2);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Tzu","Sun",null,3);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Bill", "Clinton", 1, 4);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Michael", "Jordan", 4, 5);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Baofeng", "Guo", 1, 6);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Kamala", "Harris", 2, 7);