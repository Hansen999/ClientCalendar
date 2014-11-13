$(document).ready(function () {

    // page is now ready, initialize the calendar...

    $('#mycalendar').fullCalendar({

        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'agendaDay agendaWeek month'
        },

        events: [
        {
            title: 'Programmering',
            start: '2014-10-05',
            end: '2014-10-05'
        }
        ]

    })

});