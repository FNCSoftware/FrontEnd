OrderStatuses = new Object();
OrderStatuses.New = 1;
OrderStatuses.Accepted = 2;
OrderStatuses.Submitted = 3;
OrderStatuses.Rejected = 4;
OrderStatuses.OnHold = 5;
OrderStatuses.WithClient = 6;
OrderStatuses.Completed = 7;
OrderStatuses.Cancelled = 8;
OrderStatuses.NewMessages = 9;

OrderStatuses.getName = function(status) {
    if (status == OrderStatuses.New) return "New Order";
    if (status == OrderStatuses.Accepted) return "Accepted Order";
    if (status == OrderStatuses.Submitted) return "Submitted Order";
    if (status == OrderStatuses.Completed) return "Completed Order";
    if (status == OrderStatuses.Rejected) return "Rejected Order";
    if (status == OrderStatuses.OnHold) return "Order On-Hold";
    if (status == OrderStatuses.Cancelled) return "Order Cancelled";
    if (status == OrderStatuses.WithClient) return "With Client";
    return '';
};

OrderStatuses.getClassName = function(status) {
    if (status == OrderStatuses.New) return "order-new";
    if (status == OrderStatuses.Accepted) return "order-accepted";
    if (status == OrderStatuses.Submitted) return "order-submitted";
    if (status == OrderStatuses.Completed) return "order-completed";
    if (status == OrderStatuses.Rejected) return "order-rejected";
    if (status == OrderStatuses.OnHold) return "order-onhold";
    if (status == OrderStatuses.Cancelled) return "order-onhold";
    if (status == OrderStatuses.WithClient) return "order-with-client blocked-byclient";
    return '';
};