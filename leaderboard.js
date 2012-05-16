// Set up a collection to contain company information. On the server,
// it is backed by a MongoDB collection named "companies."

Companies = new Meteor.Collection("indiancompanies");

if (Meteor.is_client) {
  Template.leaderboard.companies = function () {
    return Companies.find({}, {sort: {score: -1, name: 1}});
  };

  Template.leaderboard.selected_name = function () {
    var company = Companies.findOne(Session.get("selected_company"));
    return company && company.name;
  };

  Template.company.selected = function () {
    return Session.equals("selected_company", this._id) ? "selected" : '';
  };

  Template.leaderboard.events = {
    'click input.inc': function () {
      Companies.update(Session.get("selected_company"), {$inc: {score: 5}});
    }
  };

  Template.company.events = {
    'click': function () {
      Session.set("selected_company", this._id);
    }
  };
}

// On server startup, create some companies if the database is empty.
if (Meteor.is_server) {
  Meteor.startup(function () {
    if (Companies.find().count() === 0) {
      var names = [
                    ["Agiliq", 100, "http://agiliq.com/"],
                   ["Flipkart", 90, "http://flipkart.com/"],
                   ["Inmobi", 80, "http://inmobi.com/"],
                   ["Wingify", 70, "http://visualwebsiteoptimiizer.com/"],
                   ["99tests", 80, "http://www.99tests.com/"],
                   ["TCS", 0, "http://tcs.com/"],
                   ["Satyam", 0, "http://satyam.com/"]
                   ];
      for (var i = 0; i < names.length; i++)
        Companies.insert({name: names[i][0], score: names[i][1], website: names[i][2]});
    }
  });
}
