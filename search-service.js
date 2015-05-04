/**
 * Created by kyawtun on 29/4/15.
 */

if (Meteor.isClient) {
    var SearchResult = new Mongo.Collection('SearchResult');

    Session.setDefault('searching', false);

    Template.body.helpers({
        photos: function () {
            var result = SearchResult.find({
                query: Session.get('query')
            }, {sort: {order: 1}});
            return result;
        }
    });

    Template.body.events({
        'submit form': function (event, template) {
            event.preventDefault();
            var query = template.$('input[type=text]').val();
            if (query){
                var docs = SearchResult.find({}).fetch();

                for (var i = 0; i < docs.length; i++) {
                    SearchResult.remove(docs[i]._id);
                }

                Session.set('query', query);

            }
        }
    });

    Tracker.autorun(function () {
        if (Session.get('query')) {
            var searchHandle = Meteor.subscribe('search', Session.get('query'));
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
            if (prev_query != query) {return;}
            console.log(items.length + ' ' + query + ' result added from ' + (items[0] ? items[0].source : ''));
            items.map(function(item) {
                item.query = query;
                item.order = item.rank + item.source;
                me.added('SearchResult',  Random.id(), item);
            });
            me.ready();
        };

        omniSearch.searchGoogleImage(query, addItems);
        omniSearch.searchBingImage(query, addItems);
        omniSearch.searchGettyImages(query, addItems);
        omniSearch.searchGiphy(query, addItems);
        omniSearch.searchInstagramByTag(query, addItems);
        // omniSearch.searchFlickr(query, addItems);

    });

}