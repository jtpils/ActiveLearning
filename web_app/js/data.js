//
//	Copyright (c) 2014-2017, Emory University
//	All rights reserved.
//
//	Redistribution and use in source and binary forms, with or without modification, are
//	permitted provided that the following conditions are met:
//
//	1. Redistributions of source code must retain the above copyright notice, this list of
//	conditions and the following disclaimer.
//
//	2. Redistributions in binary form must reproduce the above copyright notice, this list
// 	of conditions and the following disclaimer in the documentation and/or other materials
//	provided with the distribution.
//
//	THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
//	EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//	OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT
//	SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//	INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
//	TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR
//	BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
//	CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY
//	WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH
//	DAMAGE.
//
//
var uid = "";
var application = "";
var projectDirMain = "";
var projectDir ="";
var array_mean = "";

$(function() {

	application = $_GET('application');
	projectDirMain = "/fastdata/features/";

	$("#applicationSel").val(application);
	$("#applicationSeldel").val(application);

	document.getElementById("index").setAttribute("href","index.html");
	document.getElementById("home").setAttribute("href","index_home.html?application="+application);
	document.getElementById("viewer").setAttribute("href","viewer.html?application="+application);
	document.getElementById("nav_reports").setAttribute("href","reports.html?application="+application);
	document.getElementById("nav_data").setAttribute("href","data.html?application="+application);
	document.getElementById("nav_validation").setAttribute("href","validation.html?application="+application);

	$.ajax({
		type: "POST",
		url: "php/data_getprojects.php",
		data: { projectDirMain: projectDirMain },
		dataType: "json",
		success: function(data) {
			// set first featurename
			for (var i = 0; i < data['projectDir'].length; i++) {
				$("#projectSel").append(new Option(data['projectDir'][i], data['projectDir'][i]));
			}
			updateFeature();
		}
	});

	$("#projectSel").change(updateFeature);

	$.ajax({
		type: "POST",
		url: "db/getdatasets.php",
		data: { application: application },
		dataType: "json",
		success: function(data) {

			for( var item in data ) {
				$("#deleteDatasetSel").append(new Option(data[item][0], data[item][0]));
			}
		}
	});


	//$("#datasetSel").change(updateFeatures);
	$('#progDiag').modal('hide');
	$('#_form').submit(function() {
  		$('#progDiag').modal('show');
	});


});




//
//	Updates the list of feature files located in the project directory
//
function updateFeature() {

	projectDir = projectDirMain+projectSel.options[projectSel.selectedIndex].label;

	$('#pyramidSel').empty();
	$('#featureSel').empty();
	$('#boundarySel').empty();


	$.ajax({
		type: "POST",
		url: "php/data_getdatasetsfromdir.php",
		data: { projectDir: projectDir,
						application: application },
		dataType: "json",
		success: function(data) {

			for (var i = 0; i < data['featureName'].length; i++) {
				$("#featureSel").append(new Option(data['featureName'][i], data['featureName'][i]));
			}
		}
	});

	$.ajax({
		type: "POST",
		url: "php/data_getboundariesfromdir.php",
		data: { projectDir: projectDir },
		dataType: "json",
		success: function(data) {

			for (var i = 0; i < data['boundaryDir'].length; i++) {
				$("#boundarySel").append(new Option(data['boundaryDir'][i], data['boundaryDir'][i]));
			}
			//updateFeatures();
		}
	});

	$.ajax({
		type: "POST",
		url: "php/data_getpyramidinfofromdir.php",
		data: { projectDir: projectDir },
		dataType: "json",
		success: function(data) {

			for (var i = 0; i < data['slideInfo'].length; i++) {
				$("#pyramidSel").append(new Option(data['slideInfo'][i], data['slideInfo'][i]));
			}
		}
	});

}



//
// Retruns the value of the GET request variable specified by name
//
//
function $_GET(name) {
	var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
	return match && decodeURIComponent(match[1].replace(/\+/g,' '));
}
