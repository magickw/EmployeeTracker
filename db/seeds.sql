-- Department seeds --
INSERT INTO department (name)
VALUES ("Sales"),
      ("Engineering"),
      ("Finance"),
      ("Legal");

-- Employee role seeds --
INSERT INTO role (title, salary, department_id)
VALUES ("Lead Engineer", 200000, 2),
      ("Account Manager", 150000, 4),
      ("Accountant", 150000, 3),
      ("Sales Lead", 120000, 1),
      ("Salesperson", 100000, 1),
      ("Software Engineer", 150000, 2),
      ("Lawyer", 250000, 4);

-- Employee seeds --
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUES ("Jessica", "Lin", null, 1),
      ("Tom", "Brady", null, 2),
      ("Tzu","Sun", null, 3),
      ("Bill", "Clinton", 1, 4),
      ("Michael", "Jordan", 4, 5),
      ("Baofeng", "Guo", 1, 6),
      ("Kamala", "Harris", 2, 7);