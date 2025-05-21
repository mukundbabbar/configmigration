//Toggle Tab
function openTab(evt, tabName) {
   var i, tabcontent, tablinks;
   tabcontent = document.getElementsByClassName("tabcontent");
   for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
   }
   tablinks = document.getElementsByClassName("tablinks");
   for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
   }
   document.getElementById(tabName).style.display = "block";
   evt.currentTarget.className += " active";
}


function toggle(source, obj) {
   console.log("toggle")
   checkboxes = document.getElementsByName(obj);
   for (var i = 0, n = checkboxes.length; i < n; i++) {
      checkboxes[i].checked = source.checked;
   }
}

//Call python function to export selected synthetic tests
function expTests() {  
   var t = []
   console.log("Exporting tests call");
   var grid = document.getElementById("teststable");
   var checkBoxes = grid.getElementsByTagName("INPUT");
   for (var i = 0; i < checkBoxes.length; i++) {
      if (checkBoxes[i].checked) {
         var row = checkBoxes[i].parentNode.parentNode;
         console.log(row.cells[3].innerHTML)
         console.log(row.cells[1].innerHTML)
         t.push(row.cells[3].innerHTML + "/" + row.cells[1].innerHTML);
         console.log(row.cells[1].innerHTML);
      }
   }
   var dorgrealm = document.getElementById("destorgrealm").value;
   var dorgapikey = document.getElementById("destorgapikey").value;
   var dorgsessionkey = document.getElementById("desttoken").value;
   var sorgrealm = document.getElementById("srcorgrealm").value;
   var sorgapikey = document.getElementById("srcorgapikey").value;
   var myObj = '{"data":' + JSON.stringify(t) + ', "dorgrealm":"' + dorgrealm + '", "dorgapikey":"' + dorgapikey + '", "dorgsessionkey":"' + dorgsessionkey + '", "sorgrealm":"' + sorgrealm + '", "sorgapikey":"' + sorgapikey + '"}';
   console.log(myObj);
   $.ajax({
         type: "POST",
         url: "/exportTests",
         data: myObj,
         contentType: "application/json",
         dataType: 'json'
      })
      .done(function (RES) {
         if (RES)
            console.log(RES);
            $( "div.success" ).fadeIn( 300 ).delay( 1500 ).fadeOut( 400 );
      })
      .fail(function (xhr, text, err) {
            $( "div.failure" ).fadeIn( 300 ).delay( 1500 ).fadeOut( 400 );
      });

}

//Call python function to export selected dashboard groups
function expDg() {
   var t = []
   console.log("Exporting dashboard groups call");
   var grid = document.getElementById("dgtable");
   var checkBoxes = grid.getElementsByTagName("INPUT");
   for (var i = 0; i < checkBoxes.length; i++) {
      if (checkBoxes[i].checked) {
         var row = checkBoxes[i].parentNode.parentNode;
         t.push(row.cells[1].innerHTML);
         console.log(row.cells[1].innerHTML);
      }
   }
   var dorgrealm = document.getElementById("destorgrealm").value;
   var dorgapikey = document.getElementById("destorgapikey").value;
   var dorgsessionkey = document.getElementById("desttoken").value;
   var sorgrealm = document.getElementById("srcorgrealm").value;
   var sorgapikey = document.getElementById("srcorgapikey").value;
   var myObj = '{"data":' + JSON.stringify(t) + ', "dorgrealm":"' + dorgrealm + '", "dorgapikey":"' + dorgapikey + '", "dorgsessionkey":"' + dorgsessionkey + '", "sorgrealm":"' + sorgrealm + '", "sorgapikey":"' + sorgapikey + '"}';
   console.log(myObj);
   $.ajax({
         type: "POST",
         url: "/exportDg",
         data: myObj,
         contentType: "application/json",
         dataType: 'json'
      })
      .done(function (RES) {
        //  if (RES)
//             console.log(RES);
//             $( "div.success" ).fadeIn( 300 ).delay( 1500 ).fadeOut( 400 ); 
        if (RES.id.includes("Error")) {
         	//if succesfull, change color and load objects
         	console.log(RES)
            $( "div.failure" ).fadeIn( 300 ).delay( 1500 ).fadeOut( 400 );
            }
         else {
         	//if succesfull, change color and load objects
         	console.log(RES)
         	$( "div.success" ).fadeIn( 300 ).delay( 1500 ).fadeOut( 400 );
        }
      })
      .fail(function (xhr, text, err) {
            $( "div.failure" ).fadeIn( 300 ).delay( 1500 ).fadeOut( 400 );
      });

}

//Call python function to export selected teams

function expTeam() {
   var t = []
   console.log("Exporting Teams call");
   var grid = document.getElementById("teamtable");
   var checkBoxes = grid.getElementsByTagName("INPUT");
   for (var i = 0; i < checkBoxes.length; i++) {
      if (checkBoxes[i].checked) {
         var row = checkBoxes[i].parentNode.parentNode;
         t.push(row.cells[1].innerHTML);
         console.log(row.cells[1].innerHTML);
      }
   }
   var dorgrealm = document.getElementById("destorgrealm").value;
   var dorgapikey = document.getElementById("destorgapikey").value;
   var dorgsessionkey = document.getElementById("desttoken").value;
   var sorgrealm = document.getElementById("srcorgrealm").value;
   var sorgapikey = document.getElementById("srcorgapikey").value;
   var myObj = '{"data":' + JSON.stringify(t) + ', "dorgrealm":"' + dorgrealm + '", "dorgapikey":"' + dorgapikey + '", "dorgsessionkey":"' + dorgsessionkey + '", "sorgrealm":"' + sorgrealm + '", "sorgapikey":"' + sorgapikey + '"}';
   console.log(myObj);
   $.ajax({
         type: "POST",
         url: "/exportTeam",
         data: myObj,
         contentType: "application/json",
         dataType: 'json'
      })
      .done(function (RES) {
         if (RES)
            console.log(RES);
            $( "div.success" ).fadeIn( 300 ).delay( 1500 ).fadeOut( 400 );
      })
      .fail(function (xhr, text, err) {
            $( "div.failure" ).fadeIn( 300 ).delay( 1500 ).fadeOut( 400 );
      });

}
//Call python function to export selected detectors
function expDet() {
   var t = []
   console.log("Exporting Detectors call");
   var grid = document.getElementById("dettable");
   var checkBoxes = grid.getElementsByTagName("INPUT");
   for (var i = 0; i < checkBoxes.length; i++) {
      if (checkBoxes[i].checked) {
         var row = checkBoxes[i].parentNode.parentNode;
         t.push(row.cells[1].innerHTML);
         console.log(row.cells[1].innerHTML);
      }
   }
   var dorgrealm = document.getElementById("destorgrealm").value;
   var dorgapikey = document.getElementById("destorgapikey").value;
   var dorgsessionkey = document.getElementById("desttoken").value;
   var sorgrealm = document.getElementById("srcorgrealm").value;
   var sorgapikey = document.getElementById("srcorgapikey").value;
   var myObj = '{"data":' + JSON.stringify(t) + ', "dorgrealm":"' + dorgrealm + '", "dorgapikey":"' + dorgapikey + '", "dorgsessionkey":"' + dorgsessionkey + '", "sorgrealm":"' + sorgrealm + '", "sorgapikey":"' + sorgapikey + '"}';
   console.log(myObj);
   $.ajax({
         type: "POST",
         url: "/exportDet",
         data: myObj,
         contentType: "application/json",
         dataType: 'json'
      })
      .done(function (RES) {
         if (RES)
            console.log(RES);
            $( "div.success" ).fadeIn( 300 ).delay( 1500 ).fadeOut( 400 );
      })
      .fail(function (xhr, text, err) {
            $( "div.failure" ).fadeIn( 300 ).delay( 1500 ).fadeOut( 400 );
      });

}

// GDI  - create sample metric
function createMetric() {
   var targetorgrealm = document.getElementById("targetorgrealm").value;
   var targetingest = document.getElementById("targetingest").value;
   var t = $("#metric_data").val();
   var myObj = '{"data":' + t + ', "targetorgrealm":"' + targetorgrealm + '", "targetingest":"' + targetingest + '"}';
   console.log("Creating Metric");
   $.ajax({
         type: "POST",
         url: "/createMetric",
         data: myObj,
         contentType: "application/json",
         dataType: 'json'
      })
      .done(function (RES) {
         if (RES)
            console.log(RES);
            $( "div.success" ).fadeIn( 300 ).delay( 1500 ).fadeOut( 400 );
      })
      .fail(function (xhr, text, err) {
            $( "div.failure" ).fadeIn( 300 ).delay( 1500 ).fadeOut( 400 );
      });
}

// GDI  - create sample event
function createE() {
   var targetorgrealm = document.getElementById("targetorgrealm").value;
   var targetingest = document.getElementById("targetingest").value;
   var t = $("#event_data").val();
   var myObj = '{"data":' + t + ', "targetorgrealm":"' + targetorgrealm + '", "targetingest":"' + targetingest + '"}';
   console.log("Creating Event");
   $.ajax({
         type: "POST",
         url: "/createEvent",
         data: myObj,
         contentType: "application/json",
         dataType: 'json'
      })
      .done(function (RES) {
         if (RES)
            console.log(RES);
            $( "div.success" ).fadeIn( 300 ).delay( 1500 ).fadeOut( 400 );
      })
      .fail(function (xhr, text, err) {
            $( "div.failure" ).fadeIn( 300 ).delay( 1500 ).fadeOut( 400 );
      });

}


//Call API for data links
function expCL() {
   var t = []
   console.log("Exporting Data Links call");
   var grid = document.getElementById("cltable");
   var checkBoxes = grid.getElementsByTagName("INPUT");
   for (var i = 0; i < checkBoxes.length; i++) {
      if (checkBoxes[i].checked) {
         var row = checkBoxes[i].parentNode.parentNode;
         t.push(row.cells[1].innerHTML);
         console.log(row.cells[1].innerHTML);
      }
   }
   var dorgrealm = document.getElementById("destorgrealm").value;
   var dorgapikey = document.getElementById("destorgapikey").value;
   var dorgsessionkey = document.getElementById("desttoken").value;
   var sorgrealm = document.getElementById("srcorgrealm").value;
   var sorgapikey = document.getElementById("srcorgapikey").value;
   var myObj = '{"data":' + JSON.stringify(t) + ', "dorgrealm":"' + dorgrealm + '", "dorgapikey":"' + dorgapikey + '", "dorgsessionkey":"' + dorgsessionkey + '", "sorgrealm":"' + sorgrealm + '", "sorgapikey":"' + sorgapikey + '"}';
   console.log(myObj);
   $.ajax({
         type: "POST",
         url: "/exportCL",
         data: myObj,
         contentType: "application/json",
         dataType: 'json'
      })
      .done(function (RES) {
         if (RES)
            console.log(RES);
            $( "div.success" ).fadeIn( 300 ).delay( 1500 ).fadeOut( 400 );
      })
      .fail(function (xhr, text, err) {
            $( "div.failure" ).fadeIn( 300 ).delay( 1500 ).fadeOut( 400 );
      });

}

// To connect to src org and load objects
function connectToSOrg() {
   var orgrealmvalue = document.getElementById("srcorgrealm").value;
   var orgapikey = document.getElementById("srcorgapikey").value;
   t = myObj = '{"s_orgrealmvalue":"' + orgrealmvalue + '", "s_orgapikey":"' + orgapikey + '"}';
   console.log("Making post call to load org");
   $.ajax({
         type: "POST",
         url: "/getOrgDetails",
         data: t,
         contentType: "application/json",
         dataType: 'json'
      })
      .done(function (RES) {
         if (RES.id.includes("Error")) {
         	//if succesfull, change color and load objects
         	console.log(RES)
            $("#src_info")[0].innerHTML = "Status: " +  RES.id;
            $("#src_info")[0].style = "color: red";
            $( "div.failure" ).fadeIn( 300 ).delay( 1500 ).fadeOut( 400 );
            }
         else {
         	//if succesfull, change color and load objects
         	console.log(RES)
            $("#src_info")[0].innerHTML = "Connected to : " +  RES.id + " " + RES.organizationName;
            $("#src_info")[0].style = "color: green";
            
            //Add custom span to monitor usage
            const Provider = SplunkRum.provider;
            var tracer=Provider.getTracer('appModuleLoader');
            span = tracer.startSpan('connect', {
            //span attributes
            attributes: {
                   'workflow.name': 'connect',
                   'src_org_name': RES.organizationName,
                   'src_org_id': RES.id
            }
            });
            span.end();
            //custom work done
            
            
            loadTests()
            loadDG()
            loadCL()
            loadDET()
            loadTeam()
            }
      })
      .fail(function (xhr, text, err) {
         var responseTitle = $(xhr.responseText).filter('title').get(0);
         $("#src_info")[0].innerHTML += "<br />" + xhr.responseText;
        $( "div.failure" ).fadeIn( 300 ).delay( 1500 ).fadeOut( 400 );
      });
}

//Load tests
function loadTests() {
   var orgrealmvalue = document.getElementById("srcorgrealm").value;
   var orgapikey = document.getElementById("srcorgapikey").value;
   t = myObj = '{"s_orgrealmvalue":"' + orgrealmvalue + '", "s_orgapikey":"' + orgapikey + '"}';
   console.log("Making post call to load objects");
   //Synthetic Tests
   $.ajax({
         type: "POST",
         url: "/getTests",
         data: t,
         contentType: "application/json",
         dataType: 'json'
      })
      .done(function (RES) {
         if (RES) {
         	console.log(RES)
         	let tbl = document.getElementById("teststable");
         	console.log(RES.tests.length)
         	document.getElementById("syntesthead").innerText = "Synthetic Tests ("+RES.totalCount+")";
         	for (let j=0;j<RES.tests.length;j++) {
         		let tr = document.createElement("tr");
         		let td = document.createElement("td");
         		let chb = document.createElement('input');
         		chb.type = 'checkbox';
         		chb.name = 'testscheck';
         		chb.id = RES.tests[j]['id'];
         		td.appendChild(chb);
         		tr.appendChild(td);
         		td = document.createElement("td");
         		td.innerText = RES.tests[j]['id'];
         		tr.appendChild(td);
         		td = document.createElement("td");
         		td.innerText = RES.tests[j]['name'];
         		tr.appendChild(td);
         		td = document.createElement("td");
         		td.innerText = RES.tests[j]['type'];
         		tr.appendChild(td);
         		tbl.appendChild(tr);
         	}
            }
      })
      .fail(function (xhr, text, err) {
      	 console.log("Failed to load data" + err);
      });
}

//Load dashboard groups
function loadDG() {
   var orgrealmvalue = document.getElementById("srcorgrealm").value;
   var orgapikey = document.getElementById("srcorgapikey").value;
   t = myObj = '{"s_orgrealmvalue":"' + orgrealmvalue + '", "s_orgapikey":"' + orgapikey + '"}';
   console.log("Making post call to load objects");
   //Synthetic Tests
   $.ajax({
         type: "POST",
         url: "/getDg",
         data: t,
         contentType: "application/json",
         dataType: 'json'
      })
      .done(function (RES) {
         if (RES) {
         	console.log(RES)
         	let tbl = document.getElementById("dgtable");
         	console.log(RES.results.length)
         	document.getElementById("dghead").innerText = "Dashboard Groups ("+RES.count+")";
         	//clear the table
         	for (let j=0;j<RES.results.length;j++) {
         		let tr = document.createElement("tr");
         		let td = document.createElement("td");
         		let chb = document.createElement('input');
         		chb.type = 'checkbox';
         		chb.name = 'testscheck';
         		chb.id = RES.results[j]['id'];
         		td.appendChild(chb);
         		tr.appendChild(td);
         		td = document.createElement("td");
         		td.innerText = RES.results[j]['id'];
         		tr.appendChild(td);
         		td = document.createElement("td");
         		td.innerText = RES.results[j]['name'];
         		tr.appendChild(td);
         		td = document.createElement("td");
         		let dashtable = document.createElement("table");
         		for (let i=0;i<RES.results[j].dashboards.length;i++) {
         			let tri = document.createElement("tr");
         			let tdi = document.createElement("td");
         			tdi.innerText = RES.results[j].dashboards[i];
         			tri.appendChild(tdi);
         			dashtable.appendChild(tri);
         		}
         		td.appendChild(dashtable);
         		tr.appendChild(td);
         		tbl.appendChild(tr);
         	}
            }
      })
      .fail(function (xhr, text, err) {
      	 console.log("Failed to load data" + err);
      });
}


//Load detectors
function loadDET() {
   var orgrealmvalue = document.getElementById("srcorgrealm").value;
   var orgapikey = document.getElementById("srcorgapikey").value;
   t = myObj = '{"s_orgrealmvalue":"' + orgrealmvalue + '", "s_orgapikey":"' + orgapikey + '"}';
   console.log("Making post call to load objects");
   //Synthetic Tests
   $.ajax({
         type: "POST",
         url: "/getDet",
         data: t,
         contentType: "application/json",
         dataType: 'json'
      })
      .done(function (RES) {
         if (RES) {
         	console.log(RES)
         	let tbl = document.getElementById("dettable");
         	console.log(RES.results.length)
         	document.getElementById("dethead").innerText = "Detectors ("+RES.count+")";
         	for (let j=0;j<RES.results.length;j++) {
         		let tr = document.createElement("tr");
         		let td = document.createElement("td");
         		let chb = document.createElement('input');
         		chb.type = 'checkbox';
         		chb.name = 'testscheck';
         		chb.id = RES.results[j]['id'];
         		td.appendChild(chb);
         		tr.appendChild(td);
         		td = document.createElement("td");
         		td.innerText = RES.results[j]['id'];
         		tr.appendChild(td);
         		td = document.createElement("td");
         		td.innerText = RES.results[j]['name'];
         		tr.appendChild(td);
         		tbl.appendChild(tr);
         	}
            }
      })
      .fail(function (xhr, text, err) {
      	 console.log("Failed to load data" + err);
      });
}
// Load teams

function loadTeam() {
   var orgrealmvalue = document.getElementById("srcorgrealm").value;
   var orgapikey = document.getElementById("srcorgapikey").value;
   t = myObj = '{"s_orgrealmvalue":"' + orgrealmvalue + '", "s_orgapikey":"' + orgapikey + '"}';
   console.log("Making post call to load objects");
   //Synthetic Tests
   $.ajax({
         type: "POST",
         url: "/getTeam",
         data: t,
         contentType: "application/json",
         dataType: 'json'
      })
      .done(function (RES) {
         if (RES) {
            console.log(RES)
            let tbl = document.getElementById("teamtable");
            console.log(RES.results.length)
            document.getElementById("teamhead").innerText = "Teams ("+RES.count+")";
            for (let j=0;j<RES.results.length;j++) {
               let tr = document.createElement("tr");
               let td = document.createElement("td");
               let chb = document.createElement('input');
               chb.type = 'checkbox';
               chb.name = 'teamcheck';
               chb.id = RES.results[j]['id'];
               td.appendChild(chb);
               tr.appendChild(td);
               td = document.createElement("td");
               td.innerText = RES.results[j]['id'];
               tr.appendChild(td);
               td = document.createElement("td");
               td.innerText = RES.results[j]['name'];
               tr.appendChild(td);
               tbl.appendChild(tr);
            }
            }
      })
      .fail(function (xhr, text, err) {
          console.log("Failed to load data" + err);
      });
}

//Load data links
function loadCL() {
   var orgrealmvalue = document.getElementById("srcorgrealm").value;
   var orgapikey = document.getElementById("srcorgapikey").value;
   t = myObj = '{"s_orgrealmvalue":"' + orgrealmvalue + '", "s_orgapikey":"' + orgapikey + '"}';
   console.log("Making post call to load objects");
   //Synthetic Tests
   $.ajax({
         type: "POST",
         url: "/getCL",
         data: t,
         contentType: "application/json",
         dataType: 'json'
      })
      .done(function (RES) {
         if (RES) {
         	console.log(RES)
         	let tbl = document.getElementById("cltable");
         	console.log(RES.results.length)
         	document.getElementById("clhead").innerText = "Data Links ("+RES.count+")";
         	for (let j=0;j<RES.results.length;j++) {
         		let tr = document.createElement("tr");
         		let td = document.createElement("td");
         		let chb = document.createElement('input');
         		chb.type = 'checkbox';
         		chb.name = 'testscheck';
         		chb.id = RES.results[j]['id'];
         		td.appendChild(chb);
         		tr.appendChild(td);
         		td = document.createElement("td");
         		td.innerText = RES.results[j]['id'];
         		tr.appendChild(td);
         		td = document.createElement("td");
         		td.innerText = RES.results[j]['propertyName'];
         		tr.appendChild(td);
         		td = document.createElement("td");
         		td.innerText = RES.results[j]['targets'][0]['type'];
         		tr.appendChild(td);
         		tbl.appendChild(tr);
         	}
            }
      })
      .fail(function (xhr, text, err) {
      	 console.log("Failed to load data" + err);
      });
}

// To connect to destination org in CM page
function connectToDOrg() {
   var orgrealmvalue = document.getElementById("destorgrealm").value;
   var orgapikey = document.getElementById("destorgapikey").value;
   t = myObj = '{"s_orgrealmvalue":"' + orgrealmvalue + '", "s_orgapikey":"' + orgapikey + '"}';
   console.log("Making post call to check connection to dest org");
   $.ajax({
         type: "POST",
         url: "/getOrgDetails",
         data: t,
         contentType: "application/json",
         dataType: 'json'
      })
      .done(function (RES) {
         if (RES.id.includes("Error")) {
         	//if succesfull, change color and load objects
         	console.log(RES)
            $("#dest_info")[0].innerHTML = "Status: " +  RES.id;
            $("#dest_info")[0].style = "color: red";
            $( "div.failure" ).fadeIn( 300 ).delay( 1500 ).fadeOut( 400 );
            }
         else {
         	//if succesfull, change color and load objects
         	console.log(RES)
            $("#dest_info")[0].innerHTML = "Connected to : " +  RES.id + " " + RES.organizationName;
            $("#dest_info")[0].style = "color: green";
            
            //Add custom span to monitor usage
            const Provider = SplunkRum.provider;
            var tracer=Provider.getTracer('appModuleLoader');
            span = tracer.startSpan('connect', {
            //span attributes
            attributes: {
                   'workflow.name': 'connect',
                   'dest_org_name': RES.organizationName,
                   'dest_org_id': RES.id
            }
            });
            span.end();
            //custom work done
            }
      })
      .fail(function (xhr, text, err) {
         console.log(err)
        $( "div.failure" ).fadeIn( 300 ).delay( 1500 ).fadeOut( 400 );
      });   
}

function getLongTime() {
	const currentDate = new Date(); 
	const milliseconds = currentDate.getMilliseconds(); 
	console.log(milliseconds);
	return milliseconds;
}


// For GDI page connection to Target Org
function connectToTOrg() {
   var orgrealmvalue = document.getElementById("targetorgrealm").value;
   var orgapikey = document.getElementById("targetorgapikey").value;
   t = myObj = '{"s_orgrealmvalue":"' + orgrealmvalue + '", "s_orgapikey":"' + orgapikey + '"}';
   console.log("Making post call to check connection to target org");
   $.ajax({
         type: "POST",
         url: "/getOrgDetails",
         data: t,
         contentType: "application/json",
         dataType: 'json'
      })
      .done(function (RES) {
         if (RES.id.includes("Error")) {
         	//if succesfull, change color and load objects
         	console.log(RES)
            $("#target_info")[0].innerHTML = "Status: " +  RES.id;
            $("#target_info")[0].style = "color: red";
            $( "div.failure" ).fadeIn( 300 ).delay( 1500 ).fadeOut( 400 );
            }
         else {
         	//if succesfull, change color and load objects
         	console.log(RES)
            $("#target_info")[0].innerHTML = "Connected to : " +  RES.id + " " + RES.organizationName;
            $("#target_info")[0].style = "color: green";
            
            //Add custom span to monitor usage
            const Provider = SplunkRum.provider;
            var tracer=Provider.getTracer('appModuleLoader');
            span = tracer.startSpan('gdi', {
            //span attributes
            attributes: {
                   'workflow.name': 'gdi',
                   'dest_org_name': RES.organizationName,
                   'dest_org_id': RES.id
            }
            });
            span.end();
            //custom work done
            
            
            }
      })
      .fail(function (xhr, text, err) {
         console.log(err)
        $( "div.failure" ).fadeIn( 300 ).delay( 1500 ).fadeOut( 400 );
      });   
}
