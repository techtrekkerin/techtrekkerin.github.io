import json
from urllib.parse import urlparse

FILE_NAME_APPS = "allinone_json/apps.json"
FILE_NAME_CATEGORIES = "allinone_json/categories.json"
FILE_NAME_TEMP = "apps_temp.json"

def write_tofile(data_to_write):

    with open(FILE_NAME_APPS, "w") as new_file:
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
    

def get_icon_link_night(icon_link):
    return icon_link.replace("/category_icons/", "/category_icons_night/")

def main():
    data = get_data_from_file(FILE_NAME_APPS)
    for key in data.keys():
        app = data[key]
        app["india_only"] = False
        data[key] = app
    
    write_tofile(data)


main()