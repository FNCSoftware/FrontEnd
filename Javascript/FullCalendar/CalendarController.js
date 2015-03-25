(function() {

  var module = angular.module("userCalendar");

  var CalendarController = function($scope, $element, $interval, $location) {
    
    var orders = [{
      orderId: 111,
      status: OrderStatuses.New,
      address: '1214 Office Park Dr',
      dueDate: '2015-04-11T23:18:21.108716',
      inspectionDate: '2015-03-28T16:30:00.5242713',
    }, {
      orderId: 112,
      status: OrderStatuses.Accepted,
      address: '8220 Westbrook Dr',
      dueDate: '2015-03-11T09:30:00.5242713',
      inspectionDate: '2015-03-05T16:30:00.5242713',
    }, {
      orderId: 113,
      status: OrderStatuses.Accepted,
      address: '455 Eastover Gate',
      dueDate: '2015-04-02T15:45:00.5242713',
      inspectionDate: '2015-04-01T14:15:00.5242713',
    }, ];

    $scope.orders = orders;

    $scope.getEvents = function() {
      var events = [];
      for (var o in $scope.orders) {

        var order = $scope.orders[o];
        if (order.dueDate) {
          // due date event
          var dueEvent = {
            id: order.orderId + '-due',
            start: order.dueDate,
            title: order.address,
            allDay: false,
            url: '/' + order.orderId,
            color: '#CC0000',
            editable: false, // not draggable,
          };

          events.push(dueEvent);
        }

        if (order.inspectionDate) {
          // inspection date event
          var inspectionEvent = {
            id: order.orderId + '-inspection',
            start: order.inspectionDate,
            title: order.address,
            allDay: false,
            url: '/' + order.orderId,
            color: '#428bca',
            editable: true, // draggable
            durationEditable: false, // this value controls if users can change the time/duration of an event
          };

          events.push(inspectionEvent);
        }
      }

      return events;
    };
    
    var getOrderFromCalendarEvent = function(event) {
      var orderId = event.id.split('-')[0];
      var matchingOrders = $.grep($scope.orders, function(o) {
        return o.orderId == orderId;
      });

      if (matchingOrders.length > 0) {
        return matchingOrders[0];
      }

      return undefined;
    };
    
    var getCalendarEventPopupContent = function(eventOrder) {
      var content =
        '<div class="order-address">' +
        '<div>' + eventOrder.address + '</strong></div>' +
        '</div>' +
        '<div class="order-loaninfo">' +
        '</div>';

      return content;
    };

    $scope.setupCalendar = function() {

      $element.fullCalendar({
        header: {
          left: 'title',
          center: 'month, agendaWeek, agendaDay',
          right: 'prev, today, next'
        },
        timeFormat: 'h:mmt',
        editable: true,
        events: $scope.getEvents(),
        eventClick: function(event, jsEvent, view) {
          var eventOrder = getOrderFromCalendarEvent(event);
          if (eventOrder) {
            if (event.url)
              window.open(event.url, "_blank");
            return false;
          }
          return false;
        },
        eventDrop: function(event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view) {
          // this is a mock to set the inspection date for the order
          var eventOrder = getOrderFromCalendarEvent(event);
          if (eventOrder) {
            eventOrder.inspectionDate = event.start.format();

            // confirmation box's "Cancel" functionality
            var revert = function() {
              $element.fullCalendar('refetchEvents');
              revertFunc(); // this is fullCalendar's default revert functionality, which moves event back to original spot
            };

            // show confirmation box
          }
        },
        eventRender: function(event, element) {
          var eventOrder = getOrderFromCalendarEvent(event);
          if (eventOrder) {
            var orderId = eventOrder.orderId;
            
            // popover qtip
            element.qtip({
              prerender: true,
              content: {
                text: getCalendarEventPopupContent(eventOrder),
                title: OrderStatuses.getName(eventOrder.status),
                button: 'Close',
                prerender: true,
              },
              position: {
                my: 'bottom center',
                at: 'top center',
                target: 'mouse',
                adjust: {
                  mouse: false,
                  scroll: false
                }
              },
              show: 'mouseover',
              hide: 'mouseout',
              events: {
                show: function(evnt, api) {
                  var orderQtipId = '#' + $(this).attr('aria-describedby');

                  $(orderQtipId).unbind();

                  // on click, navigate to order's details
                  $(orderQtipId).click(function() {
                    window.open('\#' + orderId, '_blank');
                  });
                }
              },
              style: 'qtip-light qtip-shadow qtip-bootstrap ' + OrderStatuses.getClassName(eventOrder.status),
            });
          }
        },
        dayClick: function(date, allDay, jsEvent, view) {
          // when day is clicked on, go to agendaDay view for clicked date
          $element.fullCalendar('changeView', 'agendaDay');
          $element.fullCalendar('gotoDate', date);
        },
      });
    };
    
    $scope.setupCalendar();

  };

  // register controller with module
  module.controller("CalendarController", CalendarController);

}());