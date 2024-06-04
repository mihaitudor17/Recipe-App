import os
import subprocess
import webbrowser

def start_server(port=8000):
    # Change directory to where your files are located
    os.chdir("/path/to/your/files")

    # Start the HTTP server in the background
    subprocess.Popen(["python", "-m", "http.server", str(port)])

    # Open the browser to the specified path
    webbrowser.open("http://localhost:{}".format(port))

if __name__ == "__main__":
    start_server()