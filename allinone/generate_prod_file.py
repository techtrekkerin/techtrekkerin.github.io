import json, os

FILES_DIR = "allinone_json"
PROD_FILE_NAME = "apps_list.json"

def get_file_path(file_name):
    return FILES_DIR + "/" + file_name

def write_to_prod_file(data_to_write):

    with open(PROD_FILE_NAME, "w") as new_file:
        json.dump(data_to_write, new_file, indent=4)
    

def get_data_from_file(file_name):
    with open(file_name) as file_to_read:
        data = json.loads(file_to_read.read())
        return data



def main():
    files_list = os.listdir(FILES_DIR)
    prod_dict = {}

    for file_name in files_list:
        key_name = file_name.split(".")[0]
       
        data = get_data_from_file(get_file_path(file_name))
        
        prod_dict[key_name] = data

    write_to_prod_file(prod_dict)


main()