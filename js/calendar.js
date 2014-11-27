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
    })
    
    //Log out button
    $("#logout").click(function(){
        //Clear session and log out
        $.sessionStorage.removeAll();
        window.location = 'login.html';
    });
    
    //Log calendar button
    $("#addCalendar").click(function(){
        //Clear session and log out
        console.log("You clicked add Calendar");
    });

});

//Create event array from session
var eventTest = [];
var eventsSession = $.sessionStorage.get("events");
    if(eventsSession != null){
    eventsSession.forEach(function(event){
        var eventObj = {};
        eventObj["id"] = event.eventid;
        eventObj["start"] = new Date(event.strDateStart);
        eventObj["end"] = new Date(event.strDateEnd)
        eventObj["title"] = event.title;
        eventTest.push(eventObj);
    });
}

