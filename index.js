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
const company = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // MySQL password
    password: 'password',
    database: 'employee_trackerDB'
  },
  console.log(`Connected to the company_db database.`)
);

company.connect(function(err) {
  if (err) throw err
  console.log("Connected as Id" + connection.threadId)
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
            "View All Employees?", 
            "View All Employees By Roles?",
            "View All Emplyees By Deparments", 
            "Update Employee",
            "Add Employee?",
            "Add Role?",
            "Add Department?"
          ]
  }
]).then(function(val) {
      switch (val.choice) {
          case "View All Employees?":
            viewAllEmployees();
          break;
  
        case "View All Employees By Roles?":
            viewAllRoles();
          break;
        case "View All Emplyees By Deparments":
            viewAllDepartments();
          break;
        
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
  
          }
  });
}

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});