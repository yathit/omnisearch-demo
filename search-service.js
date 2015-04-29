/**
 * Created by kyawtun on 29/4/15.
 */

if (Meteor.isClient) {
    Photos = new Mongo.Collection('photos');

    Session.setDefault('searching', false);

    Template.hello.helpers({
        photos: function () {
            return Photos.find();
        },
        searching: function () {
            return Session.get('searching');
        }
    });

    Template.hello.events({
        'submit form': function (event, template) {
            event.preventDefault();
            var query = template.$('input[type=text]').val();
            if (query)
                Session.set('query', query);
        }
    });

    Tracker.autorun(function () {
        if (Session.get('query')) {
            var searchHandle = Meteor.subscribe('search', Session.get('query'));
            Session.set('searching', !searchHandle.ready());
        }
    });
}