//Create event array from session
    var eventTest = [];
    var eventsSession = $.sessionStorage.get("events");
        if(eventsSession != null){
        eventsSession.forEach(function(event){
            var eventObj = {};
            eventObj["id"] = event.eventid;
            eventObj["start"] = new Date(event.start);
            eventObj["end"] = new Date(event.end);
            eventObj["title"] = event.title;
            eventTest.push(eventObj);
        });
        }

$(document).ready(function () {
    
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
        events: eventTest,
        eventColor: '#428bca',
        eventBorderColor: '#bcbcbc',
        
        //Event is clicked
        eventClick: function(calEvent, jsEvent, view) {

        alert('Event: ' + calEvent.title);
        alert('Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY);
        alert('View: ' + view.name);

        // change the border color just for fun
        $(this).css('border-color', 'red');

    }
    })
    
    //Log out button
    $("#logout").click(function(){
        //Clear session and log out
        $.sessionStorage.removeAll();
        window.location = 'login.html';
    });
    
    //Login in button clicked
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

            //Callback handler that will be called on failure
            request.fail(function (jqXHR, textStatus, errorThrown){
                // log the error to the console
                console.error(
                        "The following error occured: "+
                        textStatus, errorThrown
                );
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
    
});


