import os

from dotenv import load_dotenv

load_dotenv()

DEBUG = True if os.getenv("DEBUG", "FALSE") == "TRUE" else False
PORT = int(os.getenv("PORT", 5000))
