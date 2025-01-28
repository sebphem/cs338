# module to check if name is in DB and or add name to DB
import sqlite3
import unittest

# call to add a name into the blacklist DB
# returns nothing and raises exception if an error occurs
def add_name(last, first):
    try:
        conn = sqlite3.connect("blacklist.db")
        cursor = conn.cursor()

        sql = """INSERT INTO NoCheck(last_name, first_name) VALUES (?,?)"""

        cursor.execute(sql,[last, first])
        conn.commit()
    except Exception as e:
        print("encountered error:",e)
        raise Exception(e)


# checks to see if name is in blacklist.db
# returns: True if any result is found matching the given last name and first name
# returns False if no results are found
def is_in_blacklist(last, first):
    try:
        conn = sqlite3.connect("blacklist.db")
        cursor = conn.cursor()
        sql = """SELECT * FROM NoCheck WHERE last_name = ? AND first_name = ?;"""
        
        cursor.execute(sql, [last, first])
        results = cursor.fetchall()

        if len(results) > 0:
            return True # we found a match
        
        return False
    except Exception as e:
        print("encountered error:",e)
        raise Exception(e)
    
def remove_name(last, first):
    try:
        conn = sqlite3.connect("blacklist.db")
        cursor = conn.cursor()
        sql = """DELETE FROM NoCheck WHERE last_name = ? AND first_name = ?;"""

        
        cursor.execute(sql, [last, first])
        conn.commit()
    except Exception as e:
        print("encountered error:",e)
        raise Exception(e)

def get_all_names():
    try:
        conn = sqlite3.connect("blacklist.db")
        cursor = conn.cursor()
        sql = """SELECT * from NoCheck;"""

        
        cursor.execute(sql)

        return (cursor.fetchall())
    except Exception as e:
        print("encountered error:",e)
        raise Exception(e)

class BlacklistUnittests(unittest.TestCase):
    def test_DB_ops(self):
        last = "jimmerson"
        first = "jimothy"
        self.assertEqual(is_in_blacklist(last, first), False)
        add_name(last, first)
        self.assertEqual(is_in_blacklist(last, first), True)
        remove_name(last, first)
        self.assertEqual(is_in_blacklist(last, first), False)

    def test_duplicate_names(self):
        last = "bob"
        first = "jon"
        add_name(last, first)
        add_name(last, first)
        self.assertEqual(is_in_blacklist(last, first), True)
        remove_name(last, first)
        self.assertEqual(is_in_blacklist(last, first), False)
    
    def test_show_db(self):
        last = "bob"
        first = "jon"
        add_name(last, first)
        add_name(last, first)
        self.assertEqual(is_in_blacklist(last, first), True)
        print("test:",get_all_names())
        self.assertEqual([("bob","jon"), ("bob","jon")], get_all_names())
        remove_name(last, first)
        self.assertEqual(is_in_blacklist(last, first), False)

if __name__ == '__main__':
    unittest.main()