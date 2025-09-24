from flask import jsonify, request
import json
import os
import pandas as pd


print(os.getcwd())

with open('free_libraries/src/markerPopup.json', 'r', encoding='utf-8') as f:
    libraries_data = json.load(f)
    
with open('free_libraries/src/newData.json', 'r', encoding='utf-8') as f:
    old_libraries_data = json.load(f)
    
print(old_libraries_data)
    
for library in libraries_data:
    address = library['address']
    address = address[:address.find('<a')]
    address = address[:address.find('</span>')]
    library['address'] = address
    library['type'] = "default"
    
# df = pd.DataFrame(libraries_data)

# df.to_csv('final_data.csv', index=False)

for library in libraries_data:
    for old_library in old_libraries_data:
        # new_lib_title = library['title']
        # new_lib_title
        if library['title'].lower() == old_library['title'].lower():
            library['contact_person'] = old_library['contact_person']
            library['contact_email'] = old_library['contact_email']
            # library['contact_phone'] = old_library['contact_phone']
print(libraries_data)
df = pd.DataFrame(libraries_data)
df.columns = df.columns.str.replace(r'[\$#\[\]\./]', '_', regex=True)

df.to_json('libraries_data.json', index=False, orient='records')