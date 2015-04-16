if (Meteor.isClient) {

    Template.hello.onCreated(function() {
        this.searchProvider = new OmniSearchSource();
    });

    Template.hello.helpers({
        results: function() {
            var me = Template.instance();
            var items = me.searchProvider.getResult();
            return items;
        }
    });

    Template.hello.events({
        "keyup #search-box": function(event, template) {
            var text = $(event.target).val().trim();
            var is_valid_token = event.keyCode == 10 || event.keyCode == 32;
            if (text && is_valid_token) {
                template.searchProvider.search(text);
            }
        }
    });
}
