// A RESTful factory for retreiving mails from 'mails.json'

(function(){
  app.factory('mails',mails);
  mails.$inject=['$http'];
  function mails($http){
    var path = 'js/app/mail/mails.json';
    var mails = $http.get(path).then(function(resp) {
      //debugger;
      return resp.data.mails;
    });
    var factory = {};
    factory.all = function() {
      return mails;
    };
    factory.get = function(id) {
      return mails.then(function(mails) {
        for (var i = 0; i < mails.length; i++) {
          if (mails[i].id == id) return mails[i];
        }
        return null;
      })
    };
    return factory;
  }
})();


// app.factory('mails', ['$http',
//   function($http) {
//     var path = 'js/app/mail/mails.json';
//     var mails = $http.get(path).then(function(resp) {
//       //debugger;
//       return resp.data.mails;
//     });
//     var factory = {};
//     factory.all = function() {
//       return mails;
//     };
//     factory.get = function(id) {
//       return mails.then(function(mails) {
//         for (var i = 0; i < mails.length; i++) {
//           if (mails[i].id == id) return mails[i];
//         }
//         return null;
//       })
//     };
//     return factory;
//   }
// ]);