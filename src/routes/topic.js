exports.list = function(req, res){
  res.render('topic/list', { title: 'List Topics' })
}

exports.view = function(req, res){
  res.render('topic/view', { title: 'View Topic' })
}

exports.create = function(req, res){
  res.render('topic/create', { title: 'Create Topic' })
}

exports.reply = function(req, res){
  res.render('topic/reply', { title: 'Reply to Topic' })
}
