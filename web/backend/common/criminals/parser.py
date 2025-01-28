import pandas as pd
import glob
import os
import json
import unittest

# PLAN FOR THIS IS TO MAKE IT AS MODULAR AS POSSIBLE
# FUNCTIONAL PROGRAMMING THAT IS PLANNING TO ACHEIVE ONE THING








# Function that aggregates all CSV files in current dir and checks the given name against the aggregation
# Returns a dict if name is found / not found
# returns None if an error occurs
# dict will always have a "status" where -1 is not found and 1 is found
# dict will always have a "body" where the data is either returned or there is just a message saying name is not found
def check_sex_offender(lastname : str, firstname :str, **kwargs) -> dict[str,str|int]:
    try:
        # queue up all Sex offender CSV files in dir
        sex_offender_list = glob.glob(os.path.join(os.getcwd(),f"{"SO_"}*.csv"))
        #print("found files:", sex_offender_list)
        # aggregate dataframes
        dataframes = []
        for each in sex_offender_list:
            dataframe = pd.read_csv(each)
            dataframes.append(dataframe)
        sex_offender_df = pd.concat(dataframes, ignore_index=True)

        # check to see if name is in data
        result = sex_offender_df[(sex_offender_df["LAST"] == lastname.upper()) & (sex_offender_df["FIRST"] == firstname.upper())]

        # return results
        if result.empty:
            return None
        else:
            row_data = result.to_dict(orient = "records")
            return row_data

    except Exception as err:
        print("\tException has occurred in sex offender database:\n", err)
        raise Exception(err)

class Sex_offender_unittests(unittest.TestCase):
    def testExists(self):
        sex_offenders = {"glynn":"williams"}
        for first, last in sex_offenders.items():
            res = check_sex_offender(last, first)
            self.assertEqual(res["status"],1)

    def testNotExists(self):
        not_so = {"Jim": "Bobbinson"}
        for first, last in not_so.items():
            res = check_sex_offender(last, first)
            self.assertEqual(res["status"],-1)

    def testCapsIters(self):
        sex_offenders = {"TIMOTHY":"DUKES", "timothy":"dukes", "tImoThY":"dUkEs"}
        for first, last in sex_offenders.items():
            res = check_sex_offender(last, first)
            self.assertEqual(res["status"],1)

if __name__ == '__main__':
    unittest.main()