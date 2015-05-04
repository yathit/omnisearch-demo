/**
 * Created by kyawtun on 29/4/15.
 */

if (Meteor.isClient) {


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
