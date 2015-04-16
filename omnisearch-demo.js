if (Meteor.isClient) {

    Template.hello.onCreated(function() {
        this.searchProvider = new OmniSearchSource();
    });

    Template.hello.helpers({
        results: function() {
            var me = Template.instance();
            var items = me.searchProvider.getResult();
            console.log(items);
            return items;
        },
        progress: function() {
            var me = Template.instance();
            var p = me.searchProvider.getProgress();
            return p;
        }
    });

    var doSearch = _.debounce(function(text, template) {
        var option = {};
        Meteor.call('omnisearch', text, option, function(err, items) {
            template.searchProvider.search(text);
        })
    }, 1000);

    Template.hello.events({
        "keyup #search-box": function(event, template) {
            var text = $(event.target).val().trim();
            var is_token = event.keyCode == 10 || event.keyCode == 32;
            if (text) {
                if (is_token) {
                    template.searchProvider.search(text);
                } else {
                    doSearch(text, template);
                }

            }
        }
    });
}
