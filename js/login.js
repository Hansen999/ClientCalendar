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
                //console.log(response);
                login(response);
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
                if(response.authentication){
                    console.log("Error logging in");
                } //If error was returned
                else {
                    //Store userid and events in session
                    $.sessionStorage.set("userid", response.userid);
                    $.sessionStorage.set("events", response.events);
                    //Direct user to calendar
                    window.location = 'calendar.html';
                }
            }
             
    });
    
});
