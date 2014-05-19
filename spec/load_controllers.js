module.exports = function(server){
  var app = server.app;
  
  //resources
  app.resources('resources_controller', {
    collection: {
      get: ['collection_action']
    },
    member: {
      post: ['member_action']
    }
  });
  app.resources('change_name_controller', {
    name: 'custom_name'
  });
  app.resources('before_controllers');


  //resource
  app.resource('resource_controller');
  app.resource('change_name_controller', {
    name: 'resource_custom_name'
  });
}