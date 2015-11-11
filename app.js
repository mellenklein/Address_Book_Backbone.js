console.log('hey there!');

  ////////////////////////////////////////////
 //          MODELS & COLLECTIONS          //
////////////////////////////////////////////
var Person = Backbone.Model.extend({
  url: 'http://tiny-starburst.herokuapp.com/collections/contactsmel'
});

var Contact = Backbone.Model.extend({
  urlRoot: 'http://tiny-starburst.herokuapp.com/collections/contactsmel'
});

var ContactList = Backbone.Collection.extend({
  url: 'http://tiny-starburst.herokuapp.com/collections/contactsmel'
});

  ///////////////////////////////
 //          VIEWS            //
///////////////////////////////

var HomePage = Backbone.View.extend({
  tagName: 'p',
  template: _.template($('#homePageTemplate').html()),
  render: function(){
    this.$el.html(this.template());
    return this;
  }
});

var ContactDetail = Backbone.View.extend({
  tagName: 'article',
  className: 'contact',
  template: _.template($('#contactDetailTemplate').html()),
  render: function(){
    var data = this.model.toJSON();
    this.$el.html(this.template(data));
    return this;
  }
});

var AddressBook = Backbone.View.extend({
  tagName: 'section',
  className: 'list',
  events: {
    'change model': 'render'
  },
  initialize: function(){
    this.listenTo(this.collection, 'fetch sync', this.render);
  },

  render: function(){
    var view = this;

    this.collection.each(function(model){
      var contact = new ContactDetail({
        model: model
      });
      contact.render();
      view.$el.append(contact.el);
    });
  }
});

var Form = Backbone.View.extend({
  tagName: 'form',
  className: 'form',
  events: {
    'click .send': 'handleSendClick'
  },
  send: function(){
    var first = this.$('.firstName').val();
    var last = this.$('.lastName').val();
    var email = this.$('.email').val();
    var phone = this.$('.phone').val();
    var twitter = this.$('.twitter').val();
    var linkedin = this.$('.linkedin').val();

    if(first.trim() === ''){
      alert('First Name is required');
      return;
    }
    if(last.trim() === ''){
      alert('Last Name is required');
      return;
    }
    if(email.trim() === ''){
      alert('Email address is required');
      return;
    }
    var person = new Person({
      firstName: first,
      lastName: last,
      phone: phone,
      email: email,
      twitter: twitter,
      linkedin: linkedin
    });
    person.save();
    this.$('input').val('');
    alert('Success! Your contact was saved to the address book.');
  },

  handleSendClick: function(event){
    event.preventDefault();
    this.send();
  },

  render: function(){
    var formTemplate = $('#formTemplate').html();
    this.$el.html(formTemplate);
    return this;
  }
});

  ///////////////////////////////
 //          ROUTER           //
///////////////////////////////

var Router = Backbone.Router.extend({
  routes: {
    '': 'home',
    'contact/:id': 'viewContact'
  },
  home: function(){
    var mainView = new HomePage();
    mainView.render();
    $('header').append(mainView.el);
  },
  viewContact(contactId){
    var model = new Contact({
      id: contactId
    });

    model.fetch().then(function(){
      var view = new ContactDetail({
        model: model
      });
      view.render();
      $('main').html(view.el);
    });
  }
});




  ///////////////////////////////
 //          RENDERING        //
///////////////////////////////




var router = new Router();
Backbone.history.start();

var form = new Form();
form.render();
$('main').append(form.el);

var contactList = new ContactList();

var addressBook = new AddressBook({
  collection: contactList
});

contactList.fetch({
  success: function(){
    $('main').append(addressBook.el);
  }
});
