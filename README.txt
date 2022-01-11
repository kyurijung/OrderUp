COURSE: COMP 2406A
ASSIGNMENT: 4
AUTHOR + STUDENT ID: Kyuri Jung + 101209827
NOTE: REFERENCED A4 WORKSHOP CODE AND TUTORIAL 8&9

### Instructions to run program:
- Open a terminal shell and change the current working directory to where your database folder is
- Run the mongo daemon: mongod --dbpath='YOURDATABASENAMEHERE'
- Open another terminal in your IDE and change the current working directory to 'assignment4/'
- Run: 'npm install' OR 'npm i' in your terminal 
    - (this should add package-lock.json and node_modules folder)
- Run: 'node database-initializer.js' to firstly create the 'a4' collection
- Run: 'npm start'
- Go to your browser and type in the search bar 'http://localhost:3000'
    - This is the main loaded page.
- To stop the server, enter control+C
- To stop the mongo daemon (mongod --dppath='YOURDATABASENAMEHERE'), enter control+C on terminal shell

### Design Notes:
- Made two of each pug file for most pages that had the same content with the difference of the headers
for logged in users vs not logged in users. Which pug file to render was determined in the server.js
depending on the log in status of the user
- All js files in ./models folder represent their unique schemas for each collection in the database
- All js files in ./public folder were purposefully separated to show one important function to keep code
clean and understandable
- Slightly changed the orderform.js to accomodate for adding a unique id and the orderer's username
- Did not add any extra code to the database-initializer.js