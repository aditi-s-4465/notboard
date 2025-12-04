#pip install pandas kagglehub pymongo
import kagglehub
import os
import pandas as pd
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()
MONGO_URI = os.getenv("MONGODB_URI")

client = MongoClient(MONGO_URI)
db = client["notboard"]
games_collection = db["games"]
path = kagglehub.dataset_download("threnjen/board-games-database-from-boardgamegeek")
csv_path = os.path.join(path, "games.csv")
games_df = pd.read_csv(csv_path)
games_df = games_df.sort_values(by="AvgRating", ascending=False).head(100)
games = games_df.to_dict(orient="records")
games_collection.delete_many({})
games_collection.insert_many(games)

print("Inserted top 100 board games successfully!")
