/****************************************************
Get all information before startup
****************************************************/

//Get all calendar & events
    getCalendars();
    getEvents();
    getUsers();
    getQuote();
    //getNotes();

    var calendars = [];
    var events = [];
    var users = [];
    //var notes = [];

    function getCalendars() {

            //Request to server
            var request = $.ajax({
                url: "http://127.0.0.1:52400/getAllCalendars/"+ $.sessionStorage.get("userid"),
                type: "GET",
                cache: false,
                contentType: "application/json; charset=utf-8",
                //data: header
            });
            
            //Response from server
            request.done(function (response, textStatus, jqXHR){
                
                response.forEach(function(calendar){
                    calendars.push(calendar);
                });
                
            });
    }
    
    function getEvents() {
        
            //Request to server
            var request = $.ajax({
                url: "http://127.0.0.1:52400/getAllEvents/"+ $.sessionStorage.get("userid"),
                type: "GET",
                cache: false,
                contentType: "application/json; charset=utf-8",
                //data: header
            });
            
            //Response from server
            request.done(function (response, textStatus, jqXHR){
                console.log(response);
                response.forEach(function(event){
                    var eventObj = {};
                    eventObj["eventid"] = event.eventid;
                    eventObj["start"] = new Date(event.start);
                    eventObj["end"] = new Date(event.end);
                    eventObj["title"] = event.title;
                    eventObj["location"] = event.location;
                    eventObj["notes"] = event.notes;
                    eventObj["forecast"] = event.weatherData;
                    events.push(eventObj);
                });
                   
            });
    }

    function getQuote() {
            
        //Request to server
            var request = $.ajax({
                url: "http://127.0.0.1:52400/getQuote/",
                type: "GET",
                cache: false,
                contentType: "application/json; charset=utf-8",
                //data: header
            });
            
            request.done(function (response, textStatus, jqXHR){
                $('#qotdtopic').text(response.topic);
                $('#qotd').text(response.quote);
                $('#qotdauthor').text("Author: " + response.author);
                
                $(".QOTD").show();
            });
    }

    function getUsers() {

            //Request to server
            var request = $.ajax({
                url: "http://127.0.0.1:52400/getAllUsers/",
                type: "GET",
                cache: false,
                contentType: "application/json; charset=utf-8",
                //data: header
            });
            
            //Response from server
            request.done(function (response, textStatus, jqXHR){
                
                response.forEach(function(user){
                    users.push(user);
                });
                
            });
    }

//Run when all Ajax-calls are done
$(document).ajaxStop(function () {
    
    //Populate calendar/userlists
    setCalendarList();
    setUserList();
    
    /****************************************************
    Static utility object, for events data manipulation
    ****************************************************/
    var EventUtility = {
          dateTimeasDigits: function (date) {
              var date = new Date(date);
              var hours = (date.getHours() < 10) ? "0" + date.getHours() : date.getHours();
              var minutes = (date.getMinutes() < 10) ? "0" + date.getMinutes() : date.getMinutes();
              return hours + ":" + minutes;
              //return format: HH:mm
          },
          eventLocation: function (location) {
              if (location.length > 25) {
                  return location.substr(0, 25) + " ...";
              } else {
                  return location;
              }
          },
          notes: function (notesObj) {
              var lihtml = "";
              notesObj.forEach(function (note) {
                  lihtml += "<li>" + note.text + "</li>";
              });
              return (lihtml.length > 0) ? lihtml : "";
          },
          forecast: function (forecastData) {
              if (forecastData != null) {
                  return "<tr>" +
                      "<td colspan=\"2\"><b>Vejret</b></td>" +
                      "</tr>" +
                      "<tr>" +
                      "<td>Desc:</td>" +
                      "<td>" + forecastData.desc + "</td>" +
                      "</tr>" +
                      "<tr>" +
                      "<td>Temp:</td>" +
                      "<td>" + forecastData.celsius + "</td>" +
                      "</tr>"
              } else {
                  return "";
              }

          }

      };
    
    /********************************************
    Creation of FullCalender
    ********************************************/
    $('#myCalendar').fullCalendar({
        
        //Calendar UI settings
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'agendaDay agendaWeek month'
        },
        defaultView: 'agendaWeek',
        timeFormat: 'H(:mm)',
        firstDay: 1,
        height: 600,
        
        //Passing events into calendar
        events: events,
        eventColor: '#428bca',
        eventBorderColor: '#bcbcbc',
        
        //Event is clicked
        eventClick: function (calEvent, jsEvent, view) {
                    $(this).popover({
                        html: true,
                        placement: "right",
                        title: function () {
                            return calEvent.title;
                        },
                        content: function () {
                            return "<table class\"table\" width=\"100%\">" +
                                "<tbody>" +
                                "<tr>" +
                                "<td><b> Tid: </b></td>" +
                                "<td class=\"text-right\"> " + EventUtility.dateTimeasDigits(calEvent.start) + " - " + EventUtility.dateTimeasDigits(calEvent.end) + "</td>" +
                                "</tr>" +
                                "<tr>" +
                                "<td><b> Lokale: </b></td>" +
                                "<td class=\"text-right\"> " + EventUtility.eventLocation(calEvent.location) + " </td>" +
                                "</tr>" +
                                "<tr>" +
                                "<td style=\"padding-top:10px;\" colspan=\"2\"><b> Noter</b></td>" +
                                "</tr>" +
                                "<tr>" +
                                "<td colspan=\"2\">" +
                                "<ul class=\"note-ul\">" +
                                EventUtility.notes(calEvent.notes) +
                                "<li><a href=\"#\" id=\"addNewNote" + calEvent._id + "\">Ny note</a></li>" +
                                "</ul>" +
                                "</td>" +
                                "</tr>" +
                                EventUtility.forecast(calEvent.forecast) +
                                "</tbody" +
                                "</table>";
                        },
                        container: "body"
                    });
                    $(this).popover('toggle');

                    $.fn.editable.defaults.mode = 'inline';
                    $('#addNewNote' + calEvent._id).editable({
                        type: 'text'
                    }).on("save", function (e, params) {

                        var request = $.ajax({
                            url: 'http://127.0.0.1:52400/',
                            dataType: "json",
                            type: "POST",
                            data: "id=addNote&jsonData=" +
                            "{\"userid\":'" + $.sessionStorage.get("userid") + "',\"eventid\":'" + calEvent.event_id + "',\"text\":'" + encodeURI(params.submitValue) + "'}"
                        });

                        request.done(function (response, textStatus, jqXHR) {


                        });

                    });
            },
        
        //Day is clicked
        /*dayClick: function(date, jsEvent, view) {
            //Trigger create event
            $('#eventModal').modal('show');
        },*/
    })
    
    //Log out button
    $("#logout").click(function(){
        //Clear session and log out
        $.sessionStorage.removeAll();
        window.location = 'login.html';
    });
    
    /********************************************
    Creation of event & call to server
    ********************************************/
    $("#btnCreateEvent").click(function(){
            
            var parseDate = function (date, datoSplit, tidSplit) {

                    var dato = date.substr(0, date.indexOf(" "));
                    var tid = date.substr(dato.length, date.length).trim();

                    var d = dato.split(datoSplit);
                    var t = tid.split(tidSplit);

                    return d[2] + "-" + d[1] + "-" + d[0] + " " + t[0] + ":" + t[1] + ":00";

                }
        
            //Object of users input
            var event = {
                userid : $.sessionStorage.get("userid"),
                calendarid : $("#selectcalendar").find(":selected").val(),
                title : $("#title").val(),
                location : $("#location").val(),
                start: parseDate($("#datetimepicker1").find("input").val(), "-", ":"),
                end: parseDate($("#datetimepicker2").find("input").val(), "-", ":"),
            }
            
            //Data object the server will recieve
            var json = "id=addEvent&jsonData=" + JSON.stringify(event);
            console.log(json);

            //Request to server
            var request = $.ajax({
                url: "http://127.0.0.1:52400/",
                type: "POST",
                cache: false,
                contentType: "application/json; charset=utf-8",
                data: json
            });
            
            //Response from server
            request.done(function (response, textStatus, jqXHR){
                console.log(json);
                calResponse(response);
            });
        
            //Check response from server
            function calResponse(response){
                
                if (response.response == "EVENT CREATED") {
                    $('#eventModal').modal('hide');
                    location.reload();
                } else {
                    $(".form-group-event").addClass("has-error");
                }
            }
        
    });
    
    /********************************************
    Creation of calendar & call to server
    ********************************************/
    $("#btnCreateCal").click(function(){
            
            //Object of users input
            var calendar = {
                userid : $.sessionStorage.get("userid"),
                name : $("#calendarName").val(),
                privatepublic : $("#addNewCalendarForm").find("input[type='radio']:checked").val(),
            }
            
            //Data object the server will recieve
            var json = "id=addCalendar&jsonData=" + JSON.stringify(calendar);
            console.log(json);

            //Request to server
            var request = $.ajax({
                url: "http://127.0.0.1:52400/",
                type: "POST",
                cache: false,
                contentType: "application/json; charset=utf-8",
                data: json
            });
            
            //Response from server
            request.done(function (response, textStatus, jqXHR){
                console.log(response);
                calResponse(response);
            });
            
            //Check response from server
            function calResponse(response){
                
                if (response.response == "CALENDAR CREATED") {
                    $('#calendarModal').modal('hide');
                    location.reload();
                } else {
                    $(".form-group-create").addClass("has-error");
                }
            }
        
    });
    
    /********************************************
    Share calendar & call to server
    ********************************************/
    $("#btnShareCal").click(function(){
            
            //Object of users input
            var calendarShare = {
                calendarid : $("#sharecalendar").find(":selected").val(),
                email : $("#shareuser").find(":selected").val(),
            }
            
            //Data object the server will recieve
            var json = "id=shareCalendar&jsonData=" + JSON.stringify(calendarShare);
            console.log(json);

            //Request to server
            var request = $.ajax({
                url: "http://127.0.0.1:52400/",
                type: "POST",
                cache: false,
                contentType: "application/json; charset=utf-8",
                data: json
            });
            
            //Response from server
            request.done(function (response, textStatus, jqXHR){
                console.log(response);
                calResponse(response);
            });
        
            //Check response from server
            function calResponse(response){
                
                if (response.response == "CALENDAR SHARED") {
                    $('#shareModal').modal('hide');
                    location.reload();
                } else {
                    $(".form-group-share").addClass("has-error");
                }
            }
        
    });
    
    /********************************************
    Delete calendar & call to server
    ********************************************/
    $("#btnDeleteCal").click(function(){
            
            //Object of users input
            var calendarDel = {
                calendarid: $("#deletecalendar").find(":selected").val(),
            }
            
            //Data object the server will recieve
            var json = "id=deleteCalendar&jsonData=" + JSON.stringify(calendarDel);
            console.log(json);    
        
            //Request to server
            var request = $.ajax({
                url: "http://127.0.0.1:52400/",
                type: "POST",
                cache: false,
                contentType: "application/json; charset=utf-8",
                data: json
            });
            
            //Response from server
            request.done(function (response, textStatus, jqXHR){
                console.log(response);
                calResponse(response);
            });
            
            //Check response from server
            function calResponse(response){
                
                if (response.response == "CALENDAR DELETED") {
                    $('#deleteModal').modal('hide');
                    location.reload();
                } else {
                    $(".form-group-del").addClass("has-error");
                }
            }
        
    });
    
});


/********************************************
Populate calendar/userlists
********************************************/
function setCalendarList() {
        
        //Set calendars
        $.each(calendars, function (key, value) {
                $('#selectcalendar').append($("<option/>", {
                    value: value.calendarId,
                    text: value.calendarName
                }));
            });
    
        //Set calendars
        $.each(calendars, function (key, value) {
                $('#sharecalendar').append($("<option/>", {
                    value: value.calendarId,
                    text: value.calendarName
                }));
            });
        
        $.each(calendars, function (key, value) {
                $('#deletecalendar').append($("<option/>", {
                    value: value.calendarId,
                    text: value.calendarName
                }));
            });  
}

function setUserList() {
        
        //Set calendars
        $.each(users, function (key, value) {
                $('#shareuser').append($("<option/>", {
                    //value: value.userid,
                    text: value.username
                }));
            });   
}




