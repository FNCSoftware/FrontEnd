From a list of orders, populate a calendar with events.
For demo purposes, the list of orders is static, but in practice they are a result of an ajax call.

We actually filter our orders by the start and end date in the current calendar view when bringing down orders to show in calendar.
For example, in our fullcalendar setup we perfom this instead of using the static list of orders:
events: function (start, end, timezone, callback) {
    $element.fullCalendar('removeEvents');

    // These are used as params when making our ajax call
    $scope.calendarStartDate(start.format());
    $scope.calendarEndDate(end.format());

    var eventsCallback = function () {
      var returnedEvents = $scope.createCalendarEvents();
      callback(returnedEvents);
    };

    $scope.loadCalendarOrders(eventsCallback); // this performs our ajax call and it's done function calls the callback function
},
The function above is called every time the calendar renders a new view (by clicking the next or prev buttons or Month, Week, or Day views)


This calendar implementation is using several 3rd party scripts -

http://fullcalendar.io/		This is includes fullcalendar.js and fullcalendar.css. Used to display the calendar and calendar events
	Which also has dependencies on -
	http://momentjs.com/	moment.js. Used to format dates
	gcal.js			Google Calendar functionality

http://qtip2.com/download 	This includes jquery.qtip.js and jquery.qtip.css. Used for the popups/tooltips seen when hovering over calendar events

Bootstrap

jQuery

----------------------------------------------------------------

A demo of this functionality can be found at
http://plnkr.co/edit/ZKxuJmmyWpxUYptSoOaP?p=preview

Check it out!

----------------------------------------------------------------