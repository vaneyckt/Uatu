$(function () {
  var login = $("#login").val();
  var passw = $("#passw").val();

  function startAllJenkinsWorkers() {
    $.each($("table tr.cards"), function(index, elem) {
      var buildName         = $(elem).data("build-name");
      var jenkinsIdentifier = $(elem).data("jenkins-identifier");

      startJenkinsWorker(buildName, jenkinsIdentifier);
    });
  }

  function startJenkinsWorker(buildName, jenkinsIdentifier) {
    $.ajax({
      url: "http://<jenkins url>/job/" + jenkinsIdentifier + "/api/json?depth=1&jsonp=?",
      dataType: "jsonp",
      beforeSend: function (xhr) {
        xhr.setRequestHeader("Authentication", "Basic " + btoa(login + ":" + passw));
      },
      success: function(data) {
        if(data.lastCompletedBuild !== null) {
          $("table tr[data-build-name='" + buildName + "'] td:nth-child(1)").html(createCard(buildName, data.lastCompletedBuild));
        }
      },
      complete: function() {
        setTimeout(startJenkinsWorker, 60000, buildName, jenkinsIdentifier);
      }
    });
  }

  function startAllCdWorkers() {
    $.ajax({
      url: "http://<other jenkins url>/job/<job name>/api/json?depth=1&jsonp=?",
      dataType: "jsonp",
      beforeSend: function (xhr) {
        xhr.setRequestHeader("Authentication", "Basic " + btoa(login + ":" + passw));
      },
      success: function(data) {
        $.each($("table tr.cards"), function(index, elem) {
          var buildName         = $(elem).data("build-name");
          var cdIdentifier      = $(elem).data("cd-identifier");

          for(var i = 0; i < data.builds.length; i++) {
            if(data.builds[i].fullDisplayName.indexOf(cdIdentifier) > -1 && data.builds[i].result !== null) {
              $("table tr[data-build-name='" + buildName + "'] td:nth-child(2)").html(createCard(buildName, data.builds[i]));
              break;
            }
          }
        });
      },
      complete: function() {
        setTimeout(startAllCdWorkers, 60000);
      }
    });
  }

  function createCard(buildName, build) {
    var text = buildName + " #" + build.number + " - " + moment.tz(build.timestamp, "Europe/Dublin").format("DD/MM HH:mm");
    var klass = (build.result === "SUCCESS") ? "success" : "failure";
    var template = $("#template").html();
    Mustache.parse(template);
    return Mustache.render(template, {text: text, klass: klass});
  };

  startAllJenkinsWorkers();
  startAllCdWorkers();
});
