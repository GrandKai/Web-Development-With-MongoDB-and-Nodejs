var MongoClient = require('mongodb').MongoClient;
var dbhost = 'mongodb://localhost:27017/test',
    myCollection = 'chapter2';
var seedData = function(db, callback) {
    db.collection(myCollection).find({}, {}, {}).toArray(function (err, docs) {
      if (docs.length <=0 ) {
        console.log('No data. Seeding...');

        // count each record as its inserted
        var ihandler = function (err, recs) {
          if (err) throw err;
          inserted++;
        };

        var toinsert = 2, inserted = 0;

        // perform a MongoDB insert for each recoed
        db.collection(myCollection).insert({
          'Title': 'Neuromancer',
          'Author': 'William Gibson'
        }, ihandler);

        db.collection(myCollection).insert({
          'Title': 'GrandKai',
          'Author': 'GrandKai'
        }, ihandler);

        // 等待上面两条记录插入完成
        // 插入
        var sync = setInterval(function () {
          if (inserted === toinsert) {
            clearInterval(sync);
            callback(db);
          }
        }, 50);
        return;
      }
      callback(db);
      return;
    });
};

var showDocs = function (db) {
  console.log("Listing books:");
  var options = {
    sort: [['Title', 1]]
  };

  db.collection(myCollection).find({}, {}, options).toArray(function (err, docs) {
    if (err) throw err;
    for (var i = 0; i < docs.length; i++) {
      console.log(docs[i].Title + '; ' + docs[i].Author);
    }
    db.close();
  })
};

MongoClient.connect(dbhost, function (err, db) {
  if (err) throw err;
  seedData(db, showDocs)
});