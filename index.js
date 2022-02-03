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
    password: '',
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
            "Add Employee",
            "Add Role",
            "Add Department",
            "Update Employee",
            "Exit"
          ]
  }
]).then(function(val) {
      switch (val.choice) {
          case "View All Employees":
            viewAllEmployees();
          break;
  
        case "View All Employees by Role":
          viewEmployeesByRole();
          break;
        case "View All Emplyees by Deparment":
          viewEmployeesByDepartment();
          break;
        // case "View All Employees by Managers":
        //     viewAllManagers();
        //   break;
        case "Add Employee":
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
//----------------------------------------------------------------------View-----------------------------------------------------------------------------//
//1. View All Employees
function viewAllEmployees() {
  console.log("View all employees\n");
  var query =
  `SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name, CONCAT(employee.first_name, ' ' , employee.last_name) AS Manager 
  FROM employee 
  INNER JOIN role
  ON role.id = employee.role_id
  INNER JOIN department
  ON department.id = role.department_id
  LEFT JOIN employee
  ON employee.manager_id = employee.id`

  db.query(query, 
    function(err, res) {
      if (err) throw err
      console.table(res)
      introPrompt();
    });
}

//2. View All Employees by Roles
function viewEmployeesByRole() {
  console.log("View All Employees By Roles\n");
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
function viewEmployeesByDepartment() {
  console.log("View All Employees By Departments\n");
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



//----------------------------------------------------------------------Add-----------------------------------------------------------------------------//

//----------------------------------------------------------------------Update-----------------------------------------------------------------------------//
//4. Update Employee

function updateEmployee() {
  console.log("Update Employee\n");
  var query =
  `SELECT employee.last_name, role.title
  FROM employee
  JOIN role
  ON employee.role_id = role.id`

  db.query(query, function(err, res) {
  // console.log(res)
   if (err) throw err
   console.log(res)
  inquirer.prompt([
        {
          
      function(err){
          if (err) throw err
          console.table(val)
          introPrompt();
      })

  });
});

}
