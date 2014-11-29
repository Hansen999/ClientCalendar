$(document).ready(function () {
    
    //IE Fix
    $.support.cors = true;
    
    //Login in button clicked
    $("#login").click(function(){
            //event.preventDefault();
            
            //Object of users input
            var user = {
                username : $("#email").val(),
                password : $("#password").val()
            }
            
            //Data object the server will recieve
            var json = "id=login&jsonData=" + JSON.stringify(user);

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
                login(response);
                console.log(response);
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
            function login(response){
                
                //If user logged in
                if(response.authentication == "true"){
                    //Store userid and events in session
                    $.sessionStorage.set("userid", response.userid);
                    
                    //Get Calendar, events, notes from server
                    getCalendars();
                    getEvents();
                    
                    //Show calendar
                    window.location = 'calendar.html';
                    
                } //If error was returned
                else {
                    //Error
                    $(".form-group").addClass("has-error");
                }
            }
             
    });
    
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
                $.sessionStorage.set("calendar", response);
                //console.log(response);
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
                $.sessionStorage.set("events", response);
                //console.log(response);
            });
    }
    
    /*      function getNotes() {

            //Request to server
            var request = $.ajax({
                url: "http://127.0.0.1:52400/getAllNotes/"+ $.sessionStorage.get("userid"),
                type: "GET",
                cache: false,
                contentType: "application/json; charset=utf-8",
                //data: header
            });
            
            //Response from server
            request.done(function (response, textStatus, jqXHR){
                $.sessionStorage.set("notes", response);
                //console.log(response);
            });
    }*/
    
});
