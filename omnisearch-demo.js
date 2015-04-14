if (Meteor.isClient) {

    Template.hello.onCreated(function() {
        this.results_ = new ReactiveVar([]);
    });

    Template.hello.helpers({
        results: function() {
            var me = Template.instance();
            return me.results_.get();
        }
    });

    var doSearch = _.throttle(function(text, template) {

        var option = {};
        Meteor.call('omnisearch', text, option, function(err, items) {
            console.log(err, items);
            template.results_.set(items);
        })
    }, 200, {leading: false});

    Template.hello.events({
        "keyup #search-box": function(event, template) {
            var text = $(event.target).val().trim();
            if (text) {
                doSearch(text, template);
            }
        }
    });
}
