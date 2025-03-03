import os

os.system("rmdir .\dist\ /s")
os.system("npm run build")
os.system("node ./index.js")

