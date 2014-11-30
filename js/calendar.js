//Get all calendar & events
    getCalendars();
    getEvents();
    getNotes();
    getUsers();

    var calendars = [];
    var events = [];
    var notes = [];
    var users = [];

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
                
                response.forEach(function(event){
                    var eventObj = {};
                    eventObj["id"] = event.eventid;
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
    
    function getNotes() {
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

$(document).ajaxStop(function () {
    
    setCalendarList();
    setUserList();
    
    //Create calendar
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
        eventClick: function(calEvent, jsEvent, view) {
        },
        
        //Trigger create event
        dayClick: function(date, jsEvent, view) {
            
            //Show modal
            $('#eventModal').modal('show');
            
        },
    })
    
    //Log out button
    $("#logout").click(function(){
        //Clear session and log out
        $.sessionStorage.removeAll();
        window.location = 'login.html';
    });
    
    //Create event button
    $("#btnCreateEvent").click(function(){
            
            //Object of users input
            var event = {
                userid : $.sessionStorage.get("userid"),
                calendarid : $("#selectcalendar").find(":selected").val(),
                title : $("#title").val(),
                location : $("#location").val(),
                start : $("#start").val(),
                end : $("#end").val(),
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
                //calResponse(response);
            });
        
            //Check response from server
            function calResponse(response){
                
                if (response.response == "CALENDAR CREATED") {
                    $('#myModal').modal('hide');     
                } else {
                    $(".form-group").addClass("has-error");
                }
            }
        
    });
    
    //Create Calendar button
    $("#btnCreateCal").click(function(){
            
            //Object of users input
            var calendar = {
                userid : $.sessionStorage.get("userid"),
                name : $("#calendarName").val(),
                privatepublic : $("#addNewCalendarForm").find("input[type='radio']:checked").val(),
            }
            
            //Data object the server will recieve
            var json = "id=addCalendar&jsonData=" + JSON.stringify(calendar);

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
                } else {
                    $(".form-group").addClass("has-error");
                }
            }
        
    });
    
    $("#btnShareCalendar").click(function(){
            
            //Object of users input
            var calendar = {
                calendarid : $("#selectcalendar").find(":selected").val(),
                email : $("#selectcalendar").find(":selected").val(),
            }
            
            //Data object the server will recieve
            var json = "id=addEvent&jsonData=" + JSON.stringify(calendar);
            console.log(json);

            /*//Request to server
            var request = $.ajax({
                url: "http://127.0.0.1:52400/",
                type: "POST",
                cache: false,
                contentType: "application/json; charset=utf-8",
                data: json
            });
            
            //Response from server
            request.done(function (response, textStatus, jqXHR){
                //calResponse(response);
            });*/
        
            //Check response from server
            function calResponse(response){
                
                if (response.response == "CALENDAR CREATED") {
                    $('#myModal').modal('hide');     
                } else {
                    $(".form-group").addClass("has-error");
                }
            }
        
    });
    
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
                delResponse(response);
            });
            
            //Check response from server
            function delResponse(response){
                
                if (response.response == "CALENDAR DELETED") {
                    $('#deleteModal').modal('hide');     
                } else {
                    $(".form-group").addClass("has-error");
                }
            }
        
    });
    
});

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




