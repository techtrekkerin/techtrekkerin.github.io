import json
from urllib.parse import urlparse

FILE_NAME = "apps.json"
TEMP_FILE_NAME = "apps_temp.json"

def write_tofile(data_to_write):

    with open(FILE_NAME, "w") as new_file:
        json.dump(data_to_write, new_file, indent=4)



def get_data_from_file(file_name):
    with open(file_name) as file_to_read:
        data = json.loads(file_to_read.read())
        return data
    
def get_connected_domains(url):
    domain = urlparse(url).hostname
    domains = [domain]
    domain = domain.split(".")

    if len(domain) > 2:
        domains.append(".".join(domain[1:]))
        if domain[0] != "www":
            domains.append("www." + ".".join(domain[1:]))
    else:
        domains.append("www." + ".".join(domain))

    return domains
    

def main():
    data = get_data_from_file(FILE_NAME)
    for key in data.keys():
        app = data[key]
        app["connected_domains"] = get_connected_domains(app["app_link"])
        data[key] = app
    
    write_tofile(data)


main()