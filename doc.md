#Architecture


Data storage would take place in two steps:

* LocalStorage
* REST Backend

In order to persist editing between page loads LocalStorage must be used. This allows the user to leave the page and come back to it and find their edits waiting for them. Using a framework like Backbone helps because the user can easily save their data and the framework takes care of saving, fetching, and rendering the data. Saving edits without a backend call also helps keep the server load down. The request is only made when a user is sure they want to store the information they have edited. This means that only one request is made after the user is *finished* editing, instead of multiple requests being made *while* the user is editing. 

I would use a REST backend to both send and receive the data after the user is done editing. It should only take one call to get all of the data. This call should be a get request, something like GET: /user/id. If calling for multiple users the URI would like something like: /users/otherid. This "otherid" would refer to some kind of grouping id, such as Department ID, or some other grouping. Saving the data would be made via either a POST request for a new user, or a PUT request for one that has already been created. 

This is where some client side logic comes into play. The client must be aware of which users are new and which are not. I would structure it this way:

1. Create user via client side
2. Give all users a property, something like 'new' that defaults to true
2. As the contact card is updated, store the edits in LocalStorage
3. Once the first request is made (a POST request) the new property switches to false.
4. Now, for every other request to the server the client knows to use a PUT request.

So, to summarize:
The server's responsibility is fetching any existing information on users, and then saving the final edits of users. The client's responsbility is creating new users, storing intermediate edits, and making the correct request back to the server (POST or PUT).

I would incorporate this functionality into a site that already has inline editing in different ways; it would depend a lot on what the existing code looks like. If the existing code is already interfacing with a REST back end then it wouldn't be that difficult to implement LocalStorage for intermediate edits. If not, then I would first make sure the REST communication was implemented via AJAX.

