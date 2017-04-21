module.exports = function() {
  var data = {};

  data.posts = [];
  data.posts.push({ id: 1, body: 'foo' });
  data.posts.push({ id: 1, body: 'bar' });
  data.posts.push({ id: 1, body: 'bee' });
  data.posts.push({ id: 1, body: 'wasp' });
  data.posts.push({ id: 1, body: 'cake' });
  //...

  return data;
}
