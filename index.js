//Dependencies
const inquirer = require('inquirer');
const express = require('express');
// Import and require mysql2
const mysql = require('mysql2');
const figlet = require('figlet');
const { printTable } = require('console-table-printer');

// let roles;
// let departments;
// let managers;
// let employees;

//initial port
const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//FIGfont spec, run 'npm install figlet' to install
figlet('EMPLOYEE TRACKER', (err, result) =>{
  console.log(err||result);
});

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
  //runs menu prompts
  menuPrompt();
});

//Menue prompts//
function menuPrompt() {
  inquirer.prompt([
  {
  type: "list",
  message: "What would you like to do?",
  name: "choice",
  choices: [
            "View All Employees", 
            "View All Employees by Role",
            "View All Emplyees by Deparment",
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
        //     viewEmployeesByManager();
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
//View All Employees
function viewAllEmployees() {
  console.log("View all employees\n");
  db.query(`SELECT employee.id AS ID, employee.first_name AS First_Name, employee.last_name AS Last_Name, role.title AS Title, role.salary AS Salary, department.name AS Department, CONCAT(e.first_name, ' ' , e.last_name) AS Manager 
  FROM employee 
  INNER JOIN role ON role.id = employee.role_id
  INNER JOIN department ON department.id = role.department_id
  LEFT JOIN employee e ON employee.manager_id = e.id
  ORDER BY employee.id`, (err, res) => {
      if (err) throw err
      // console.table(res);
      printTable(res);
      //Run the introducing prompts again
      menuPrompt();
    });
}

//View All Employees by Role
function viewEmployeesByRole() {
  console.log("View All Employees By Role\n");
  db.query(`SELECT employee.first_name AS First_Name, employee.last_name AS Last_Name, role.title AS Title
  FROM employee
  JOIN role
  ON employee.role_id = role.id`, (err, res) => {
      if (err) throw err
      // console.table(res);
      printTable(res);
      menuPrompt();
    });
}

//View All Employees By Department
function viewEmployeesByDepartment() {
  console.log("View All Employees By Department\n");
  db.query(`SELECT employee.first_name AS First_Name, employee.last_name AS Last_Name, department.name AS Department
  FROM employee
  JOIN role
  ON employee.role_id = role.id
  JOIN department
  ON role.department_id = department.id
  ORDER BY employee.id`, 
  (err, res) => {
      if (err) throw err
      // console.table(res);
      printTable(res);
      menuPrompt();
    });
}

//----------------------------------------------------------------------Add-----------------------------------------------------------------------------//
// Select Role Title for Add Employee prompt

function selectRole() {
  var roleArr = [];
  db.query(`SELECT * FROM role`,  (err, res) => {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      roleArr.push(res[i].title);
    }

  })
  return roleArr;
}

// Select Manager for Add Employee prompt
function selectManager() {
  var managersArr = [];
  db.query(`SELECT first_name, last_name FROM employee WHERE manager_id IS NULL`,  (err, res) => {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      managersArr.push(res[i].first_name);
    }

  })
  return managersArr;
}

//Add an Employee
function addEmployee() { 
  inquirer.prompt([
      {
        name: "firstname",
        type: "input",
        message: "What is the employee's first name?",
        default: "John",
        validate: addFirstName => {
          if (addFirstName) {
              return true;
          } else {
              console.log("Please enter a first name");
              return false;
          }
        }
      },
      {
        name: "lastname",
        type: "input",
        message: "What is the employee's last name?",
        default: "Smith",
        validate: addLastName => {
        if (addLastName) {
            return true;
        } else {
            console.log("Please enter a last name");
            return false;
          }
        }
      },
      {
        name: "role",
        type: "list",
        message: "What is the employee's role? ",
        choices: selectRole()
      }
  ]).then(function (res) {
    //Index starting from 0
    var roleId = selectRole().indexOf(res.role) + 1
    var managerId = selectManager().indexOf(res.choice) + 1
    db.query(`INSERT INTO employee SET ?`, 
    {
        first_name: res.firstName,
        last_name: res.lastName,
        manager_id: managerId,
        role_id: roleId
        
    }, (err, res) => {
        if (err) throw err
        // console.table(res);
        console.log( `1 new employeed is added successfully: ${res.firstName} ${res.lastName}!\n`);
        menuPrompt();
    })

})
}

//Add Role
function addRole() {
  console.log("Add Role\n");
  db.query(`SELECT role.title AS Title, role.salary AS Salary FROM role`, (err, res) => {
    inquirer.prompt([
        {
          name: "Title",
          type: "input",
          message: "What is the role's title?",
          default: "CTO",
        },
        {
          name: "Salary",
          type: "input",
          message: "What is the role's salary?",
          default: "250000",

        } 
    ]).then(function(res) {
        var query = `INSERT INTO employee SET ?`;
        db.query(query, 
            {
              title: res.Title,
              salary: res.Salary,
            },
            function(err) {
                if (err) throw err
                console.table(res);
                console.log( "1 new role is added successfully!\n");
                menuPrompt();
            }
        )

    });
  });
  }

  //Add Department
function addDepartment() {
  console.log("Add Department\n");
  inquirer.prompt([
      {
        name: "name",
        type: "input",
        message: "What dpartment would you like to add?"
      }
  ]).then(function(res) {
    db.query(`INSERT INTO department (name) VALUES('${res.department}')`, (err,res) =>{
            if (err) throw err
            console.table(res);
            console.log( "One new department is added successfully!\n");
            menuPrompt();
          }
      )
  })
}

//----------------------------------------------------------------------Update-----------------------------------------------------------------------------//
//7. Update Employee

function updateEmployee() {
    db.query(`
    SELECT id, first_name, last_name
    FROM employee`, (err, res) => {
    // console.log(res)
     if (err) throw err
     console.log(res)
    inquirer.prompt([
          {
            name: "lastName",
            type: "rawlist",
            choices: function() {
              var lastName = [];
              for (var i = 0; i < res.length; i++) {
                lastName.push(res[i].last_name);
              }
              return lastName;
            },
            message: "What is the Employee's last name? ",
          },
          {
            name: "role",
            type: "rawlist",
            message: "What is the Employees new title? ",
            choices: selectRole()
          },
      ]).then(function(res) {
        var roleId = selectRole().indexOf(res.role) + 1
        db.query(`UPDATE employee SET WHERE ?`, 
        {
          last_name: res.lastName
           
        }, 
        {
          role_id: roleId
           
        }, 
        function(err){
            if (err) throw err
            console.table(res)
            console.log( "The Employee is updated successfully!\n");
            menuPrompt();

          })
  
        });
      });
    
      }