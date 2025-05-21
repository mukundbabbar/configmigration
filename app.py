import logging
import json
from flask import jsonify
import configparser
import io
import os
import requests
from sys import exc_info
from flask import Flask, render_template, request, redirect


# Load the configuration file
config = configparser.ConfigParser()
config.read('config.ini')

# Setup logging mechanism
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
)


# Setup up a Flask instance
app = Flask(__name__)

def getDomain(REALM):
    if REALM == "us0" :
    	return "signalfx.com"
    else:
        return REALM+".signalfx.com"
    

# Obtain time from public api
def get_org_details(TOKEN, REALM):
    headers = {"Content-Type": "application/json", "X-SF-TOKEN": TOKEN}
    try:
        response = requests.get(
            url="https://api."+getDomain(REALM)+"/v2/organization",
            timeout=5, 
	    headers=headers
        )

        if response.status_code == 200:
            org_json = (json.loads(response.text))
            print(org_json)
            return org_json

        elif response.status_code != 200:
            #return response.reason
            return json.loads('{"organizationName":"Error Connecting","id":"Error Connecting, check configuration"}')
    except Exception:
        #return response.reason
        return json.loads('{"organizationName":"Error Connecting","id":"Error Connecting, check configuration"}')

def get_object(PATH, TOKEN, REALM):
    headers = {"Content-Type": "application/json", "X-SF-TOKEN": TOKEN}
    #print("URL: " + "https://api."+REALM+".signalfx.com/v2"+PATH)
    try:
        response = requests.get(
            url="https://api."+getDomain(REALM)+"/v2"+PATH+"?limit=200",
            timeout=5,
            headers=headers
        )

        if response.status_code == 200:
            src_object_json = (json.loads(response.text))
            return src_object_json
        elif response.status_code != 200:
            return response

    except Exception:
        return "Exception in getting object "+PATH



def create_tests(data, DREALM,DTOKEN, DESSION, SREALM, STOKEN):
    ret = ""
    headers = {"Content-Type": "application/json", "X-SF-TOKEN": DTOKEN}
    print("creating tests..")
    for x in range(len(data)):
        endpoint = data[x].split('/', 1)[0]
        src_test = get_object('/synthetics/tests/'+data[x],STOKEN,SREALM)
        src_test["test"].pop('createdAt', None)
        src_test["test"].pop('updatedAt', None)
        src_test["test"].pop('id', None)
        if endpoint != 'port':
            deviceId = src_test["test"]["device"]["id"]
            src_test["test"]["deviceId"] = deviceId
            src_test["test"].pop('device', None)

        #This is only for browser, check the data[x] value to identify if its api, port, http or browser endpoint
        try:
            response = requests.post(
                url="https://api."+getDomain(DREALM)+"/v2/synthetics/tests/"+endpoint,
                timeout=5,
                json=src_test,
                headers=headers
            )
            print(response)
            if response.ok:
                ret += "\n>> Test Created Successfully "+data[x]
            else:
                print(response)
                ret += "\n>> Error in creating Test "+data[x]+" "+response.text
        except Exception:
            print(response)
            ret += "\nException in creating Test "+data[x]+" "+response.text
    return ret

def create_dashboardgroups(data, DREALM,DTOKEN, DSESSION, SREALM, STOKEN):
    ret = ""
    headers = {"Content-Type": "application/json", "X-SF-TOKEN": DTOKEN}
    print("creating dashboard groups and dashboards..")
    print(data)
    for x in range(len(data)):
        print(data[x])
        exported_dashboardgroup = get_object('/dashboardgroup/'+data[x]+'/export',STOKEN,SREALM)
        # print(exported_dashboardgroup)
        try:
            response = requests.post(
                url="https://api."+getDomain(DREALM)+"/v2/dashboardgroup/import",
                #url=DEST_URL+"/v2/dashboardgroup/import",
                timeout=20,
                json=exported_dashboardgroup,
                headers=headers
            )
            print(response)
            # print(exported_dashboardgroup)
            if response.ok:
                ret += "\n>>Dashboard group Created Successfully "+data[x]
            else:
                ret += "\n>> Error in creating dashboard groups " +data[x]+" "+response.text
        except Exception:
            ret += "\nException in creating dashboard group "+data[x]+" "
    return ret


def create_detectors(data, DREALM,DTOKEN, DSESSION, SREALM, STOKEN):
    ret = ""
    headers = {"Content-Type": "application/json", "X-SF-TOKEN": DTOKEN}
    print("creating detectors..")
    #For each detector id, export (data already exist)
    for x in range(len(data)):
        print(data[x])
        src_det = get_object('/detector/'+data[x],STOKEN,SREALM)
        src_det.pop('created', None)
        src_det.pop('creator', None)
        src_det.pop('lastUpdatedBy', None)
        src_det.pop('lastUpdated', None)
        src_det.pop('overMTSLimit', None)
        src_det.pop('id', None)
        try:
            response = requests.post(
                url="https://api."+getDomain(DREALM)+"/v2/detector",
                timeout=10,
                json=src_det,
                headers=headers
            )
            print(response)
            if response.ok:
                ret += "\n>>Detector Created Successfully " +data[x]
            else:
                ret += "\n>> Error in creating detector " +data[x]+" "+response.text
        except Exception:
            ret += "\nException in creating Test "+data[x]+" "+response.text
    return ret

# TO-DO TEAMS REVIEW json blob, response not printing on debug
def create_team(data, DREALM,DTOKEN, DSESSION, SREALM, STOKEN):
    ret = ""
    headers = {"Content-Type": "application/json", "X-SF-TOKEN": DSESSION}
    print("creating teams..")
    for x in range(len(data)):
        print(data[x])
        src_team = get_object('/team/'+data[x],STOKEN,SREALM)
        src_team.pop('created', None)
        src_team.pop('creator', None)
        src_team.pop('lastUpdatedBy', None)
        src_team.pop('lastUpdated', None)
        src_team.pop('id', None)
        src_team.pop('members', None)
        # TO-DO Find org to test notificationLists and see if credentialIDs can be ported over 
        # src_team.pop('notificationLists', None)
        try:
            response = requests.post(
                url="https://api."+getDomain(DREALM)+"/v2/team",
                timeout=10,
                json=src_team,
                headers=headers
            )
            print(response)
            print(src_team)
            if response.ok:
                ret += "\n>>Team Created Successfully " +data[x]
            else:
                ret += "\n>> Error in creating team " +data[x]+" "+response.text
        except Exception:
            ret += "\nException in creating team "+data[x]+" "+response.text
    return ret

def create_crosslink(data, DREALM,DTOKEN, DSESSION, SREALM, STOKEN):
    ret = ""
    headers = {"Content-Type": "application/json", "X-SF-TOKEN": DSESSION}
    print("creating data links..")
    for x in range(len(data)):
        print(data[x])
        src_cl = get_object('/crosslink/'+data[x],STOKEN,SREALM)
        src_cl.pop('id', None)
        try:
            response = requests.post(
                url="https://api."+getDomain(DREALM)+"/v2/crosslink",
                timeout=5,
                json=src_cl,
                headers=headers
            )
            print(response)
            if response.ok:
                ret += "\n>>Data Link Created Successfully " +data[x]
            else:
                ret += "\n>> Error in creating data link " +data[x]+" "+response.text
        except Exception:
            ret += "\nException in creating Data Link "+data[x]+" "+response.text
    return ret

def create_sendMetric(data, TOKEN, REALM):
    print(data)
    ret = ""
    headers = {"Content-Type": "application/json", "X-SF-TOKEN": TOKEN}
    print("sending metric..")
    try:
        response = requests.post(
            url="https://ingest."+getDomain(REALM)+"/v2/datapoint",
            timeout=5,
            json=data,
            headers=headers
        )
        print(response)
        if response.ok:
            ret += "\n>>Metric Created Successfully "
        else:
            ret += "\n>> Error in sending metric" + response.text
    except Exception:
        ret += "\nException in sending metric " + response.text
    return ret

def create_sendEvent(data, TOKEN, REALM):
    print(data)
    ret = ""
    headers = {"Content-Type": "application/json", "X-SF-TOKEN": TOKEN}
    print("sending event..")
    try:
        response = requests.post(
            url="https://ingest."+getDomain(REALM)+"/v2/event",
            timeout=5,
            json=data,
            headers=headers
        )
        print(response)
        print(response.text)
        if response.ok:
            ret += "\n>>Event Created Successfully "
        else:
            ret += "\n>> Error in creating event" + response.text
    except Exception:
        ret += "\nException in creating event " + response.text
    return ret

# Render the template
@app.route("/", methods=['GET', 'POST'])
def index():
  print("START")
#  return render_template('index.html')
#    src_org_json = get_org_details(config["source"]["access_token"],config["source"]["realm"])
#    dest_org_json = get_org_details(config["destination"]["access_token"],config["destination"]["realm"])
#    src_dash_json = get_object('/dashboard',config["source"]["access_token"],config["source"]["realm"])
#    src_dashgroup_json = get_object('/dashboardgroup',config["source"]["access_token"],config["source"]["realm"])
#    src_detectors_json = get_object('/detector',config["source"]["access_token"],config["source"]["realm"])
#    src_tests_json = get_object('/synthetics/tests',config["source"]["access_token"],config["source"]["realm"])
#    src_crosslink_json = get_object('/crosslink',config["source"]["access_token"],config["source"]["realm"])
  return render_template('index.html', 
    src_org_name="", 
    src_org_id="", 
    src_org_realm="",
    dest_org_name="", 
    dest_org_id="", 
    dest_org_realm="",
    src_dash_json={},
    src_dashgroup_json={},
    src_detectors_json={},
    src_tests_json={},
    src_crosslink_json={},
    # TO-DO TEAMS REVIEW Render to ui
    src_team_json={},
  )

# Connect and load objects on UI
@app.route('/load', methods=['POST','GET'])
def load():
  print("in load")
  src_conn = request.get_json()
  print(src_conn)
  return render_template('index.html'
    ,src_org_json = get_org_details(config["source"]["access_token"],config["source"]["realm"])
    ,dest_org_json = get_org_details(config["destination"]["access_token"],config["destination"]["realm"])
    ,src_dash_json = get_object('/dashboard',config["source"]["access_token"],config["source"]["realm"])
    ,src_dashgroup_json = get_object('/dashboardgroup',config["source"]["access_token"],config["source"]["realm"])
    ,src_detectors_json = get_object('/detector',config["source"]["access_token"],config["source"]["realm"])
    ,src_tests_json = get_object('/synthetics/tests',src_conn.get("s_orgapikey"),src_conn.get("s_orgrealmvalue"))
    ,src_crosslink_json = get_object('/crosslink',config["source"]["access_token"],config["source"]["realm"])  
    ,src_team_json = get_object('/team',config["source"]["access_token"],config["source"]["realm"])      
    # TO-DO TEAMS REVIEW Load obj
  )
  




# Routes to get json objects for source org loading
@app.route('/getOrgDetails', methods=['POST','GET'])
def getOrgDetails():
  src_conn = request.get_json()
  if request.method == "POST":
    data = request.get_json()
    response = get_org_details(src_conn.get("s_orgapikey"),src_conn.get("s_orgrealmvalue"))
  return jsonify(response)

@app.route('/getTests', methods=['POST','GET'])
def getTests():
  src_conn = request.get_json()
  if request.method == "POST":
    data = request.get_json()
    response = get_object('/synthetics/tests',src_conn.get("s_orgapikey"),src_conn.get("s_orgrealmvalue"))
  return jsonify(response)
  
@app.route('/getDg', methods=['POST','GET'])
def getDg():
  src_conn = request.get_json()
  if request.method == "POST":
    data = request.get_json()
    response = get_object('/dashboardgroup',src_conn.get("s_orgapikey"),src_conn.get("s_orgrealmvalue"))
  return jsonify(response)

# TO-DO TEAMS REVIEW Route get json obj, response not printing

@app.route('/getTeam', methods=['POST','GET'])
def getTeam():
  src_conn = request.get_json()
  if request.method == "POST":
    data = request.get_json()
    response = get_object('/team',src_conn.get("s_orgapikey"),src_conn.get("s_orgrealmvalue"))
  return jsonify(response)
  
@app.route('/getDet', methods=['POST','GET'])
def getDet():
  src_conn = request.get_json()
  if request.method == "POST":
    data = request.get_json()
    response = get_object('/detector',src_conn.get("s_orgapikey"),src_conn.get("s_orgrealmvalue"))
  return jsonify(response)
  
@app.route('/getCL', methods=['POST','GET'])
def getCL():
  src_conn = request.get_json()
  if request.method == "POST":
    data = request.get_json()
    response = get_object('/crosslink',src_conn.get("s_orgapikey"),src_conn.get("s_orgrealmvalue"))
  return jsonify(response)


# Routes to create objects on target Org
@app.route('/exportTests', methods=['POST','GET'])
def exportTests():
  if request.method == "POST":
    data = request.get_json()
    response = create_tests(data.get("data"),data.get("dorgrealm"),data.get("dorgapikey"),data.get("dorgsessionkey"),data.get("sorgrealm"),data.get("sorgapikey"))
  return jsonify(response)

@app.route('/exportDg', methods=['POST','GET'])
def exportDg():
  if request.method == "POST":
    data = request.get_json()
    print(data)
    response = create_dashboardgroups(data.get("data"),data.get("dorgrealm"),data.get("dorgapikey"),data.get("dorgsessionkey"),data.get("sorgrealm"),data.get("sorgapikey"))
  return jsonify(response)


# TO-DO TEAMS REVIEW Routes to make obj

@app.route('/exportTeam', methods=['POST','GET'])
def exportTeam():
  if request.method == "POST":
    data = request.get_json()
    response = create_team(data.get("data"),data.get("dorgrealm"),data.get("dorgapikey"),data.get("dorgsessionkey"),data.get("sorgrealm"),data.get("sorgapikey"))
  return jsonify(response)


@app.route('/exportDet', methods=['POST','GET'])
def exportDet():
  if request.method == "POST":
    data = request.get_json()
    response = create_detectors(data.get("data"),data.get("dorgrealm"),data.get("dorgapikey"),data.get("dorgsessionkey"),data.get("sorgrealm"),data.get("sorgapikey"))
  return jsonify(response)

@app.route('/exportCL', methods=['POST','GET'])
def exportCL():
  if request.method == "POST":
    data = request.get_json()
    response = create_crosslink(data.get("data"),data.get("dorgrealm"),data.get("dorgapikey"),data.get("dorgsessionkey"),data.get("sorgrealm"),data.get("sorgapikey"))
  return jsonify(response)




#  For the GDI page
@app.route('/createMetric', methods=['POST','GET'])
def createM():
  if request.method == "POST":
    data = request.get_json()
    response = create_sendMetric(data.get("data"),data.get("targetingest"),data.get("targetorgrealm"))
  return jsonify(response)

@app.route('/createEvent', methods=['POST','GET'])
def createE():
  if request.method == "POST":
    data = request.get_json()
    response = create_sendEvent(data.get("data"),data.get("targetingest"),data.get("targetorgrealm"))
  return jsonify(response)

