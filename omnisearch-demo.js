if (Meteor.isClient) {
    // counter starts at 0
    Session.setDefault('counter', 0);

    Template.hello.helpers({
        counter: function () {
            return Session.get('counter');
        },
        setResult: function(items) {

        }
    });

    var doSearch = _.throttle(function(text, template) {
        Meteor.call('omnisearch', text, function(err, tesult) {
            template.setResult(result);
        })
    }, false, 200);

    Template.hello.events({
        "keyup #search-box": function(event, template) {
            var text = $(e.target).val().trim();
            if (text) {
                doSearch(text, template);
            }
        }
    });
}

if (Meteor.isServer) {
    Meteor.startup(function () {
        // code to run on server at startup
    });

    Meteor.methods({

    })
}
