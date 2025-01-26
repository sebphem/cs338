import yaml
from pathlib import Path
import os

# Load the YAML config file

def get_keys():
    """
    Function that opens the config file so you dont have to worry about paths across os
    """
    with open(Path(os.path.abspath(__file__)).parent / "keys.yaml", "r") as file:
        return yaml.safe_load(file)

if __name__ == "__main__":
    config = get_keys()
    print(config["keys"]["linkedin"])