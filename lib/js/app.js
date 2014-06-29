angular.module('lawbrary', ['ionic'])

/**
 * The Books factory handles saving and loading books
 * from local storage, and also lets us save and load the
 * last active book index.
 */
.factory('Books', function() {
  return {
    all: function() {
      var bookString = window.localStorage['books'];
      if(bookString) {
        return angular.fromJson(bookString);
      }
      return [];
    },
    save: function(books) {
      window.localStorage['books'] = angular.toJson(books);
    },
    newBook: function(bookTitle, bookBody) {
      // Add a new book
      return {
        title: bookTitle,
        body: bookBody
      };
    },
    getLastActiveIndex: function() {
      return parseInt(window.localStorage['lastActiveBook']) || 0;
    },
    setLastActiveIndex: function(index) {
      window.localStorage['lastActiveBook'] = index;
    },
    remove: function (key) {
        localStorage.removeItem(key);
    },
    clearAll : function () {
        localStorage.clear();
    }
  }
})

.controller('MainCtrl', function($scope, $sce, $timeout, $ionicModal, Books) {

  // A utility function for creating a new book
  // with the given bookTitle
  var createBook = function(bookTitle, bookBody) {
    var newBook = Books.newBook(bookTitle, bookBody);
    $scope.books.push(newBook);
    Books.save($scope.books);
    $scope.selectBook(newBook, $scope.books.length-1);
  }

  Books.clearAll();
  // Load or initialize books
  $scope.books = Books.all();

  // Grab the last active, or the first book
  $scope.activeBook = $scope.books[Books.getLastActiveIndex()];

  $scope.searchText = "";

  // Called to create a new book
  $scope.newBook = function() {
    
  };

  $scope.highlight = function(text, search) {
    if (!search) {
        return $sce.trustAsHtml(text);
    }
    return $sce.trustAsHtml(text.replace(new RegExp(search, 'gi'), '<span class="highlightedText">$&</span>'));
  };

  // Called to select the given book
  $scope.selectBook = function(book, index) {
    $scope.activeBook = book;
    Books.setLastActiveIndex(index);
    $scope.sideMenuController.close();
  };

  $scope.completionChanged = function() {
    Books.save($scope.books);
  };

  $scope.toggleMenu = function() {
    $scope.sideMenuController.toggleLeft();
  };

  $scope.toggleSearch = function() {
    $scope.sideMenuController.toggleRight();
  };


  // Try to create the first book, make sure to defer
  // this by using $timeout so everything is initialized
  // properly
  $timeout(function() {

    if($scope.books.length == 0) {
      createBook("LABOUR RELATIONS ACT", "<p>OFFICE OF THE PRESIDENT<br/>No. 1877. 13 December 1995<br/>NO. 66 OF 1995: LABOUR RELATIONS ACT, 1995.<br/>It is hereby notified that the President has assented to the following Act which is hereby published for general information:- <br/>No. 66 of 1995: Labour Relations Act, 1995. <br/>ACT<br/>To change the law governing labour relations and, for that purpose- <br/>to give effect to section 27 of the Constitution; <br/>to regulate the organisational rights of trade unions; <br/>to promote and facilitate collective bargaining at the workplace and at sectoral level; <br/>to regulate the right to strike and the recourse to lockout in conformity with the Constitution; <br/>to promote employee participation in decision-making through the establishment of workplace forums; <br/>to provide simple procedures for the resolution of labour disputes through statutory conciliation, mediation and arbitration (for which purpose the Commission for Conciliation, Mediation and Arbitration is established), and through independent alternative dispute resolution services accredited for that purpose; <br/>to establish the Labour Court and Labour Appeal Court as superior courts, with exclusive jurisdiction to decide matters arising from the Act; <br/>to provide for a simplified procedure for the registration of trade unions and employers organisations, and to provide for their regulation to ensure democratic practices and proper financial control; <br/>to give effect to the public international law obligations of the Republic relating to labour relations; <br/>to amend and repeal certain laws relating to labour relations; and <br/>to provide for incidental matters. <br/>(English text signed by the President. Assented to 29 November 1995.) <br/></p>");  
    }
  });

});


