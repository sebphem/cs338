import pandas as pd
import glob
import os
import json


# Function that aggregates all CSV files in current dir and checks the given name against the aggregation
# Returns a dict if name is found / not found
# returns None if an error occurs
# dict will always have a "status" where -1 is not found and 1 is found
# dict will always have a "body" where the data is either returned or there is just a message saying name is not found
def check_sex_offender(lastname, firstname):
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
            return {"status": -1, "body": "Name not found in DB"}
        else:
            row_data = json.dumps(result.iloc[0].to_dict())
            return {"status": 1, "body": row_data}

    
    except Exception as err:
        print("Exception has occurred: ", err)
        return None

"""
# basic test cases
test1 = check_sex_offender("williams", "glynn")
assert (test1["status"] == 1)
print("test1 results:", test1)
test2 = check_sex_offender("Jim", "Bobbinson")
assert (test2["status"] == -1)
print("test2 results:", test2)
"""