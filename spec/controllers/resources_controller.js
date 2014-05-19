module.exports = {
  options: {
    before: {}
  },
  index: function(req,res) {
    res.json({ msg: 'resources_controller/index'} );
  },
  create: function(req,res) {
    res.json({ msg: 'resources_controller/create'} );
  },
  show: function(req,res) {
    res.json( { msg: 'resources_controller/show' } );
  },
  destroy: function(req,res) {
    res.json({ msg: 'resources_controller/destroy'} );
  },
  update: function(req,res) {
    res.json( { msg: 'resources_controller/update' } );
  },
  collection_action: function(req,res) {
    res.json( { msg: 'resources_controller/collection_action' } );
  },
  member_action: function(req, res) {
    res.json( { msg: 'resources_controller/member_action' } );
  }
}