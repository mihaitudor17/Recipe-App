import os
import subprocess
import webbrowser

def start_server(port=8000):
    # Get the current working directory
    current_directory = os.getcwd()

    # Start the HTTP server in the background
    subprocess.Popen(["python", "-m", "http.server", str(port)], cwd=current_directory)

    # Open the browser to the specified path
    webbrowser.open("http://localhost:{}".format(port))

if __name__ == "__main__":
    start_server()
