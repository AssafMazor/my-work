
     var Router = Backbone.Router.extend ({
        routes: {
            "": "main",
           'inbox' : 'inbox',
           'today/task/:id' : 'task',
           'today' : 'today',
           'today/task/:id' : 'task',
           'upcoming' : 'upcoming',
           'today/task/:id' : 'task',
           'filters-labels' : 'filtersLabels',
           'filters/:filterId' : 'fillter',
           'labels/:labelId' : 'label'
        },

        main: function(){
            this.navigate("today", {trigger: true});
        },
        inbox: function() {
           console.log("inbox");
        },
        task: function(id) {
            console.log("task" + id);
        },
        today: function() {
            console.log("today");
        },
        upcoming: function() {
            console.log("upcoming");
        },
        filtersLabels: function() {

            console.log("filtersLabels");
        },
        fillter: function(filterId) {
            console.log("fillter" + filterId);
        },
        label: function(labelId) {
            console.log("label" + labelId);
        }
     });

     var router = new Router();
     Backbone.history.start();
