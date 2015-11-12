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
  model: Contact,
  url: 'http://tiny-starburst.herokuapp.com/collections/contactsmel'
});

  ///////////////////////////////
 //          VIEWS            //
///////////////////////////////

var HomePage = Backbone.View.extend({
  tagName: 'p',
  template: _.template($('#homePageTemplate').html()),
  events: {
    'click .home': 'handleHomeClick'
  },
  // handleHomeClick: function(){
  //   console.log('you clicked the Home button!');
  //   $('.formDisplay').html(form.el);
  //   contactList.fetch({
  //     success: function(){
  //       $('.listDisplay').html(addressBook.el);
  //     }
  //   });
  // },
  render: function(){
    console.log('called render home');
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
  // events: {
  //   'click .send': 'render'
  // },
  initialize: function(){
    this.listenTo(this.collection, 'fetch sync', this.render);
    // this.listenTo(this.model, 'change', this.render);
  },

  render: function(){
    var view = this;
    this.$el.html('');
    this.collection.each(function(model){
      var contact = new ContactDetail({
        model: model
      });
      contact.render();
      // console.log(contact.el)
      // this.$('main').val('');
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
    var contact = new Contact({
      firstName: first,
      lastName: last,
      phone: phone,
      email: email,
      twitter: twitter,
      linkedin: linkedin
    });
    contact.save();

    contactList.add(contact);

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
    // setup
    var mainView = new HomePage();
    var contactList = new ContactList();
    var addressBook = new AddressBook({
      collection: contactList
    });
    var form = new Form();

    // Render
    mainView.render();
    form.render();


    contactList.fetch({
      success: function(){
        // Attach to page
        $('header').html(mainView.el);
        $('main').html('');
        $('main').append('<section class="formDisplay"></section>');
        $('main').append('<section class="listDisplay"></section>');
        $('.listDisplay').html(addressBook.el);
        $('.formDisplay').html(form.el);
      }
    });
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






var router = new Router();
Backbone.history.start();
