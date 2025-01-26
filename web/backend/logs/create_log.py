import logging
from pathlib import Path
import sys

def build_logger(path: str|Path) -> logging.Logger:
    log = logging.Logger("Api debugger")
    log.info(f"{"="*15}\nRUNNING BACKEND API\n{"="*15}\n")

    deep_log = logging.FileHandler(path)
    deep_log.setLevel(logging.DEBUG)
    deep_log_formatter = logging.Formatter(" %(asctime)s %(levelname)s [%(filename)s] (%(funcName)s) %(lineno)d - %(message)s",
                                           datefmt='%Y-%m-%dT%H:%M:%S')
    deep_log.setFormatter(deep_log_formatter)

    console_log = logging.StreamHandler(sys.stdout)
    console_log.setLevel(logging.INFO)
    console_log_formatter = logging.Formatter(" %(levelname)s %(message)s")
    console_log.setFormatter(console_log_formatter)

    log.addHandler(deep_log)
    log.addHandler(console_log)

    return log