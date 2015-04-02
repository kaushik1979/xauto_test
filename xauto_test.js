filename = 'xauto_text.js';
Authors = new Mongo.Collection("Authors");

/*******  Client side code  *******/
if (Meteor.isClient) {

  // Schema
  Schemas = {};

  Template.registerHelper("Schemas", Schemas);


  /******* Single quick qoll collectoin less schema *******/
  Schemas.quick_qoll = new SimpleSchema({
    name: {
      type: String,
      label: "Send To",
      regEx: SimpleSchema.RegEx.Email,
      max: 500
    }
  });

  // quick qoll template
  Template.quick_qoll.helpers({
    quickQollSchema: function() {
      return Schemas.quick_qoll;
    }
  });

  renderQollToEmails = function(x) {
      // qlog.info('called render qoll to emails method', filename);
      console.log(x);
      return Blaze.toHTMLWithData(Template.quick_qoll_send_to, x);
      // return x.email + x.name;
  };

  renderQollToEmailsCb = function(x) {
      // qlog.info('Called the render-to-qoll-emails callback', filename);
      // console.log(x);
  };
}





/******  Server side code  ******/
if (Meteor.isServer) {
  Meteor.startup(function () {
    // Create and initialize the mongo collection if it aleady does not exist
    if(!Authors.findOne({})) {
      Authors.insert ({_id: '0', name: 'Richard Dawkins', email:'richard.dawkins@gmail.com'});
      Authors.insert ({_id: '1', name: 'Daniel Dennet', email:'daniel.dennet@gmail.com'});
      Authors.insert ({_id: '2', name: 'Charles Darwin', email:'charles.darwin@gmail.com'});
      Authors.insert ({_id: '3', name: 'Ram Rahim', email:'ram.rahim@gmail.com'});
      Authors.insert ({_id: '4', name: 'Kabir Das', email:'kabir.das@gmail.com'});
      Authors.insert ({_id: '5', name: 'Mahatma Gandhi', email:'mahatma.gandhi@gmail.com'});
      Authors.insert ({_id: '6', name: 'Munshi Premchandra', email:'munshi.premchandra@gmail.com'});
      Authors.insert ({_id: '7', name: 'Kalidas', email:'kalidas@gmail.com'});
    }
      
  });
}



/********  Meteor methods  ********/
Meteor.methods({
  fetch_my_emails: function(query){
        console.info("Getting emails of all friends for Query: " + query, filename);
        if(query.search(/,/) != -1) {
          var query = split(query);
          query = query[query.length-1];
        }
        console.info('Extracted query string from multiple is - ' + query, filename);

        var results = new Array();

        if(query != '') {
          var user_emails = Authors.find({'name': {$regex: '^.*'+query+'.*$', $options: 'i'}}, {'name' : 1, 'email' : 1}).fetch();

          user_emails.forEach(function(ue){
            results.push({'name' : ue.name, 'email' : ue.email});
          });
        }

        // console.info('Result till this point - ' + JSON.stringify(results), filename);

        return results;
    },
});

var split = function(val){
  return val.split( /,\s*/ );
};



