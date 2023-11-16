import subprocess

# Run Flask Backend
flask_command = "python3 explore.py"
flask_process = subprocess.Popen(flask_command, shell=True)

# Run React Frontend
react_command = "cd interface && npm start"
react_process = subprocess.Popen(react_command, shell=True)

# Wait for both processes to finish
flask_process.wait()
react_process.wait()