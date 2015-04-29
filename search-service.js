/**
 * Created by kyawtun on 29/4/15.
 */

if (Meteor.isClient) {
    Photos = new Mongo.Collection('photos');

    Session.setDefault('searching', false);

    Template.body.helpers({
        photos: function () {
            return Photos.find({
                query: Session.get('query')
            });
        },
        searching: function () {
            return false;
        }
    });

    Template.body.events({
        'submit form': function (event, template) {
            event.preventDefault();
            var query = template.$('input[type=text]').val();
            if (query){
                var docs = Photos.find({}).fetch();

                for (var i = 0; i < docs.length; i++) {
                    Photos.remove(docs[i]._id);
                }

                Session.set('query', query);

            }
        }
    });

    Tracker.autorun(function () {
        if (Session.get('query')) {
            var searchHandle = Meteor.subscribe('search', Session.get('query'));
            Session.set('searching', !searchHandle.ready());
        }
    });
}

if (Meteor.isServer) {

    var prev_query;
    /**
     * Provide client search.
     * <pre>
     *     Meteor.call('omnisearch', 'cat', {}, function(err, ans) {console.log(err, ans);});
     *     Meteor.call('omnisearch', 'cat', {video: 'youtube'}, function(err, ans) {console.log(err, ans);});
     * </pre>
     */
    Meteor.publish('search', function(query) {

        if (query == prev_query) {
            return;
        }

        prev_query = query;

        console.log('searching ' + query);
        var omniSearch = new OmniSearch(API);

        this.unblock();

        var me = this;
        var addItems = function(items) {
            console.log(items.length + ' result added');
            items.map(function(item) {
                item.query = query;
                me.added('photos',  Random.id(), item);
            })
            me.ready();
        };

        console.log(query + new Date());
        addItems(omniSearch.searchGoogleImage(query));
        if (prev_query != query) {return;}

        console.log(query + new Date());
        addItems(omniSearch.searchBingImage(query));
        if (prev_query != query) {return;}

        console.log(query + new Date());
        addItems(omniSearch.searchGettyImages(query));
        if (prev_query != query) {return;}

        console.log(query + new Date());
        addItems(omniSearch.searchGiphy(query));
        if (prev_query != query) {return;}

        console.log(query + new Date());
        addItems(omniSearch.searchInstagram(query));
        if (prev_query != query) {return;}

        console.log(query + new Date());
        addItems(omniSearch.searchFlickr(query));
        console.log(query + new Date());

        this.ready();
        console.log('searching ' + query + ' done.');

    });

}