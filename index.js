const express = require('express');
// Import and require mysql2
const mysql = require('mysql2');

//initial port
const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // MySQL password
    password: 'password',
    database: 'company_db'
  },
  console.log(`Connected to the company_db database.`)
);

db.connect(function(err) {
  if (err) throw err
  introPrompt();
});

//Introducing prompts//
function introPrompt() {
  inquirer.prompt([
  {
  type: "list",
  message: "What would you like to do?",
  name: "choice",
  choices: [
            "View All Employees", 
            "View All Employees by Roles",
            "View All Emplyees by Deparments",
            //"View All Employees by Manager" 
            "Update Employee",
            "Add Employee",
            "Add Role",
            "Add Department",
            "Exit"
          ]
  }
]).then(function(val) {
      switch (val.choice) {
          case "View All Employees":
            viewAllEmployees();
          break;
  
        case "View All Employees by Roles":
            viewAllRoles();
          break;
        case "View All Emplyees by Deparments":
            viewAllDepartments();
          break;
        // case "View All Employees by Managers":
        //     viewAllManagers();
        //   break;
        case "Add Employee?":
              addEmployee();
            break;

        case "Update Employee":
              updateEmployee();
            break;
    
          case "Add Role?":
              addRole();
            break;
    
          case "Add Department?":
              addDepartment();
            break;
          case "Exit":
            db.end();
            break;
  
          }
  });
}

//1. View All Employees
function viewAllEmployees() {
  console.log("View all employees\n");
  var query =
  `SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name, CONCAT(employee.first_name, ' ' , employee.last_name) AS Manager 
  FROM employee 
  INNER JOIN role ON role.id = employee.role_id
  INNER JOIN department ON department.id = role.department_id
  LEFT JOIN employee e ON employee.manager_id = e.id`

  db.query(query, 
    function(err, res) {
      if (err) throw err
      console.table(res)
      introPrompt();
    });
}

//2. View All Roles
function viewAllRoles() {
  var query =
  `SELECT employee.first_name, employee.last_name, role.title AS Title
  FROM employee
  JOIN role
  ON employee.role_id = role.id`

  db.query(query, 
    function(err, res) {
      if (err) throw err
      console.table(res)
      introPrompt();
    });
}

//3. View All Employees By Departments
function viewAllDepartments() {
  var query =
  `SELECT employee.first_name, employee.last_name, department.name AS Department
  FROM employee
  JOIN role
  ON employee.role_id = role.id
  JOIN department
  ON role.department_id = department.id
  ORDER BY employee.id`

  db.query(query, 
    function(err, res) {
      if (err) throw err
      console.table(res)
      introPrompt();
    });
}
