//Dependencies
const inquirer = require('inquirer');
const express = require('express');
// Import and require mysql2
const mysql = require('mysql2');
//For Figletfont spec
const figlet = require('figlet');
//For console table printing
const { printTable } = require('console-table-printer');

//Define the arrays of roles, managers, departments
const roleArr = [];
const managerArr = [];
// const departmentArr = [];
const employeeArr = [];


//initial port
const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//FIGfont spec, run 'npm install figlet' to install
figlet('EMPLOYEE TRACKER', (err, result) =>{
  console.log(err||result);
  console.log("------------------------------------- Made by Baofeng Guo ------------------------------------\n");
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
            // "View All Employees by Role",
            // "View All Emplyees by Deparment",
            //"View All Employees by Manager",
            "View Roles",
            "View Departments", 
            "Add Employee",
            "Add Role",
            "Add Department",
            "Update Employee",
            "Delete Role",
            // "Delete Employee",
            // "Delete Department",
            "Exit"
          ]
  }
]).then(function(val) {
      switch (val.choice) {
          case "View All Employees":
            viewAllEmployees();
          break;
  
          // case "View All Employees by Role":
          //   viewEmployeesByRole();
          // break;

          // case "View All Emplyees by Deparment":
          //   viewEmployeesByDepartment();
          // break;
          case "View Roles":
            viewRoles();
          break;

          case "View Departments":
            viewDepartments();
          break;

        // case "View All Employees by Managers":
        //     viewEmployeesByManager();
        //   break;

          case "Add Employee":
            addEmployee();
          break;
    
          case "Add Role":
            addRole();
          break;
    
          case "Add Department":
            addDepartment();
          break;

          case "Update Employee":
            updateEmployee();
          break;

          case "Delete Role":
            deleteRole();
          break;

          // case "Delete Employee":
          //      deleteRole();
          //   break;

          // case "Delete Department":
          //     deleteDepartment();
          //  break;
            
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
      //Run the menu prompts again
      menuPrompt();
    });
}

// //View All Employees by Role
// function viewEmployeesByRole() {
//   console.log("View All Employees By Role\n");
//   db.query(`SELECT employee.first_name AS First_Name, employee.last_name AS Last_Name, role.title AS Title
//   FROM employee
//   JOIN role
//   ON employee.role_id = role.id`, (err, res) => {
//       if (err) throw err
//       // console.table(res);
//       printTable(res);
//       menuPrompt();
//     });
// }

// //View All Employees By Department
// function viewEmployeesByDepartment() {
//   console.log("View All Employees By Department\n");
//   db.query(`SELECT employee.first_name AS First_Name, employee.last_name AS Last_Name, department.name AS Department
//   FROM employee
//   JOIN role
//   ON employee.role_id = role.id
//   JOIN department
//   ON role.department_id = department.id
//   ORDER BY employee.id`, 
//   (err, res) => {
//       if (err) throw err
//       // console.table(res);
//       printTable(res);
//       menuPrompt();
//     });
// }
//View roles

function viewRoles(){
  db.query(`SELECT id AS ID, title AS Title FROM role`, (err, res) => {
    if (err) throw err;
    printTable(res);
    menuPrompt();
  })
};

//View Departments
function viewDepartments(){
  db.query(`SELECT id AS ID, name AS Department FROM department`, (err, res) => {
    if (err) throw err;
    printTable(res);
    menuPrompt();

  })
};



//----------------------------------------------------------------------Select-----------------------------------------------------------------------------//

// Select Role Title for Add Employee prompt

function selectRole() {
  var query = `SELECT * FROM role`;
  db.query(query,  (err, res) => {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      roleArr.push(res[i].title);
    }

  })
  return roleArr;
}

// Select Manager for Add Employee prompt
function selectManager() {
  //Because the managers can't be their managers to themselves, whenever manager_id is null, the corresponding employee is a manager
  var query = `SELECT first_name, last_name FROM employee WHERE manager_id IS NULL`;
  db.query(query, (err, res) => {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      managerArr.push(res[i].last_name);
    }

  })
  return managerArr;
}


// Select Employee for Update Employee prompt
function selectEmployee(){
  var query = `SELECT first_name, last_name FROM employee`;
  db.query(query, (err, res) => {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      employeeArr.push(res[i].last_name);
    }
  })
  return employeeArr;
};

// function selectDepartment(){
//   var query = `SELECT * FROM department`;
//   db.query(query, (err, res) => {
//     if (err) throw err;
//     for (var i = 0; i < res.length; i++) {
//       department.push(res[i]);
//     }
//   })
//   return departmentArr;
// };

//----------------------------------------------------------------------Add-----------------------------------------------------------------------------//
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
      },
      {
        name: "manager",
        type: "list",
        message: "Who is the employee's manager? ",
        choices: selectManager()
      }
  ]).then(function (res) {
    var firstName = res.firstname;
    var lastName = res.lastname;
    //Index starting from 0
    var roleId = selectRole().indexOf(res.role) + 1;
    var managerId = selectManager().indexOf(res.manager) + 1;
    var query =`INSERT INTO employee (first_name, last_name, manager_id, role_id) VALUES ("${firstName}", "${lastName}", "${managerId}", "${roleId}")`;
    db.query(query, (err, res) => {
        if (err) throw err
        // console.table(res);
        console.log( `${firstName} ${lastName}, a new employee, is added successfully! See the updated employee list below.\n`);
        viewAllEmployees(); 
    })
});
}

//Add a role
function addRole() {
    inquirer.prompt([
        {
          name: "title",
          type: "input",
          message: "What is the role's title?",
          default: "Senior Software Engineer",
        },
        {
          name: "salary",
          type: "input",
          message: "What is the role's salary?",
          default: 1800000,

        },
        {
          type: "input",
          message: "What is the department ID for this role?",
          name: "departmentId",
          validate: addDepartmentId => {
            if (addDepartmentId) {
                return true;
            } else {
                console.log("Please enter a deparment ID.");
                return false;
              }
            }
        } 
    ]).then(function(res) {
        // console.log(res);
        var title = res.title;
        var salary = res.salary;
        var departmentId = res.departmentId;
        var query = `INSERT INTO role (title, salary, department_id) VALUES ("${title}", "${salary}", "${departmentId}")`;
        db.query(query, (err, res) => {
                if (err) throw err
                //console.table(res);
                console.log(`${title}, a new role, is added successfully! See the updated role list below.\n`);
                viewRoles(); 
            })
    });
  }

  //Add Department
function addDepartment() {
  inquirer.prompt([
      {
        name: "department",
        type: "input",
        message: "What dpartment would you like to add?",
        default: "Marketing",
      }
  ]).then(function(res) {
    var department = res.department;
    var query = `INSERT INTO department (name) VALUES ("${department}")`;
    db.query(query, (err, res) =>{
            if (err) throw err
            // console.table(res);
            console.log(`${department} Department, a new department, is added successfully! See the updated department list below.\n`);
            viewDepartments();

          })
  })
}

//----------------------------------------------------------------------Update-----------------------------------------------------------------------------//
// Update Employee

function updateEmployee() {
    inquirer.prompt([
          {
            name: "lastName",
            type: "list",
            message: "What's the last name of the employee you want to update with?",
            choices: selectEmployee()
          },
          {
            name: "newRole",
            type: "list",
            message: "What is the employee's new role? ",
            choices: selectRole()
          },
      ]).then(function(res) {
        var roleId = selectRole().indexOf(res.newRole) + 1
        db.query(`UPDATE employee SET employee.role_id = ${roleId} WHERE employee.last_name = ${res.lastName}`, (err, res) => {
            if (err) throw err
            //console.table(res);
            console.log( "The employee is updated successfully!\n");
            //Run the function to view the employee list after an employee is updated.
            viewAllEmployees();

          })
          
        });
  }
    

//----------------------------------------------------------------------Delete-----------------------------------------------------------------------------//
// "Delete Employee",

// "Delete Role",
function deleteRole() {
    inquirer.prompt([
      {
      name: "deleteRole",
      type: "list",
      message: "Select the role you want to delete",
      choices: selectRole()
      }
    ]).then((res) => {
      var role_Id = selectRole().indexOf(res.deleteRole) + 1;
      var query = `DELETE FROM role WHERE id=${role_Id}`;
      db.query(query, (err, res) => {
        if (err) throw err
        console.log('----------------\n');
        console.log("A role is deleted");
        //view the role list after a role is deleted.
        viewRoles();
        });
        
    });
};

// "Delete Department",