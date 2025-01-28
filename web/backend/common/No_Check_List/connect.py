import sqlite3
# file I used to create DB and make the table, also doubles to show you the schema of DB

def db_setup():
    try:
        with sqlite3.connect("blacklist.db") as conn:
            print("opened DB with version:", sqlite3.sqlite_version)

    except Exception as e:
        print("ERR:",e)
        raise Exception(e)



def create_tables():
    setup_sql = """
    CREATE TABLE IF NOT EXISTS`NoCheck` (
	`last_name` TEXT NOT NULL DEFAULT NULL,
	`first_name` TEXT DEFAULT NULL
    );"""
    conn = sqlite3.connect("blacklist.db")
    cursor = conn.cursor()
    cursor.execute(setup_sql)
    conn.commit()
    # done
    conn.close()

#create_tables()

