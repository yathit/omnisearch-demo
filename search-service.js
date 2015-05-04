/**
 * Created by kyawtun on 29/4/15.
 */

if (Meteor.isClient) {

    var OmniSearchSource = function() {
        this.searchResult = new Mongo.Collection('SearchResult');


        this.queryVar = new ReactiveVar('');
    };


    OmniSearchSource.prototype.getResult = function() {
        return this.searchResult.find({
            query: this.queryVar.get()
        }, {sort: {order: 1}});
    };


    OmniSearchSource.prototype.search = function(query) {
        var docs = this.searchResult.find({}).fetch();

        for (var i = 0; i < docs.length; i++) {
            this.searchResult.remove(docs[i]._id);
        }
        this.queryVar.set(query);
        Meteor.subscribe('search', query);
    };

    var omniSearch = new OmniSearchSource();

    Template.body.helpers({
        photos: function() {
            return omniSearch.getResult();
        }
    });

    Template.body.events({
        'submit form': function (event, template) {
            event.preventDefault();
            var query = template.$('input[type=text]').val();
            if (query){


                omniSearch.search(query);

            }
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