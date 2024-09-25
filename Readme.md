# js backend project

this is a js backend project
How to set up :-
Open a root directory by creating a folder named backendProject and open in vsCode
Run npm init in terminal (i have used git bash as default terminal), this will create a package.json file in the directory or folder
Created a Readme.md file
Then connected with github repository
Then added initial files in repository using git commit and git push
Created a folder named public and a sub-folder in it named temp and created .gitkeep file (to handle third party related stuff)
Created a .env files to keep environment variables
Created a .gitignre file
Created a folder src
Added js files named app.js constants.js index.js by using terminal (first- change directory to src by using cd src, second using touch command to create files touch app.js constants.js index.js) 
Now we have above three files in src folder
Installed nodemon as a dev dependency by using command-  npm i -D nodemon, this created a package-lock.json file in the root directory
Created subfolders named controllers, db, middlewares, models, routes, utils in src folder using mkdir as described in point 10
Then installed prettier as a dev dependency- npm i -D prettier
Then added prettier config by creating two files named .prettierrc and .prettierignore manually
