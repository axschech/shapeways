/*

	I used this to help me understand somethings:
	http://backbonejs.org/docs/todos.html

	If some of my code looks similar, its because the functionality is similar.

*/
require.config({
	// waitSeconds: 0,
	baseUrl:'js',
	paths: {
	    jquery: 'jquery.min',
	    underscore: 'underscore.min',
	    backbone: 'backbone.min',
	    'backbone.localStorage': 'backbone.localStorage',
	    card: 'card'
  	},
	shim: {
		underscore: {
			exports: '_'
		},
		backbone: {
			deps: ["underscore", "jquery"],
			exports: "Backbone"
		}
	}
});
require(['jquery','underscore','backbone','backbone.localStorage'], function ($, _, Backbone) {   // or, you could use these deps in a separate module using define
	// define(['underscore', 'backbone', 'backbone.localStorage'], function(_, Backbone) {
		$(function(){

			var User = Backbone.Model.extend({
					defaults: function() {

						return {
							order: Users.nextOrder(),
							name: "Username",
							email: "Contact",
							twitter: "@twitter-handle",
							image: "http://community.invisionpower.com/uploads/profile/photo-259363.jpg"
						}
					}
			});

			var UserList = Backbone.Collection.extend({
					model:User,
					localStorage: new Backbone.LocalStorage("app-backbone"),
					nextOrder: function() {
				      if (!this.length) return 1;
				      return this.last().get('order') + 1;
				    }
			});

			var Users = new UserList();

			var AppView = Backbone.View.extend({
					el: $("#app"),

					events: {
						'click #new_card': 'createUser'
					},

					initialize: function() {
						//start listening for changes to the Users collection
						this.listenTo(Users, 'add', this.addOne);
						this.render();

					},

					render: function() {
						// console.log('raynder')
						Users.fetch();
						if(Users.length) {
							// this.addAll();
						}
					},

					addOne: function(user) {
						// console.log('adding one');
						var view = new UserView({model: user});
						this.$('#users').append(view.render().el);
					},

					addAll: function() {
				      	Users.each(this.addOne, this);
				    },

					createUser: function() {
						Users.create({});	
					}

			});

			var UserView = Backbone.View.extend({
					className:"users",

					template: _.template($("#card").html()),
					//I probably could have done this better, but I ran out of time!
					events: {
						'keypress .edit_name': 'changeName',
						'dblclick .name': 'editName',
						'keypress .edit_email': 'changeEmail',
						'dblclick .email': 'editEmail',
						'keypress .edit_twitter': 'changeTwitter',
						'dblclick .twitter': 'editTwitter',
						'click .follow': 'goTwitter',
						'click .delete_user': 'deleteUser',
						'change .files': 'changePicture'
						// 'mouseenter .thumbnail': 'onPicture',
						// 'mouseleave .thumbnail': 'offPicture'

					},

					initialize: function() {
						this.listenTo(this.model, 'change', this.render);
						this.listenTo(this.model, 'destroy', this.remove);
					},

					render: function() {
						this.$el.html(this.template(this.model.toJSON()));
						//on render check if any of the fields need to be in edit mode
						// this won't happen very often because of the defaults

						 if(this.model.get('name')=="") {
						 	this.$('.edit_name').show();
						 	this.$('.name').hide();
						 }
						 else {
						 	this.$('.edit_name').hide();
						 	this.$('.name').show();
						 }
						 
						 if(this.model.get('email')=="") {
						 	this.$('.edit_email').show();
						 	this.$('.email').hide();
						 }
						 else {
						 	this.$('.edit_email').hide();
						 	this.$('.email').show();
						 }

						 if(this.model.get('twitter')=="") {
						 	this.$('.edit_twitter').show();
						 	this.$('.twitter').hide();
						 }
						 else {
						 	this.$('.edit_twitter').hide();
						 	this.$('.twitter').show();
						 }

						 return this;
						//var view = new UserView({model: User});
					},
					editName: function() {
						this.$('.edit_name').show();
						this.$('.name').hide();
					},
					changeName: function(e) {

						if (e.keyCode != 13) return;
      					if (!this.$('.edit_name').val()) return;

						var name = this.$('.edit_name').val();
						this.model.set('name', name);
						this.model.save();

						this.$('.edit_name').hide();
						this.$('.name').show();
						Users.fetch();

						if(name=='heavypennies') {

							var TheGame = new GameView();
						}
					},
					editEmail: function() {
						this.$('.edit_email').show();
						this.$('.email').hide();
					},
					changeEmail: function(e) {
						if (e.keyCode != 13) return;
      					if (!this.$('.edit_email').val()) return;

						var email = this.$('.edit_email').val();
						
						this.model.set('email', email);
						this.model.save();

						this.$('.edit_email').hide();
						this.$('.email').show();
						Users.fetch();
					},
					editTwitter: function() {
						this.$('.edit_twitter').show();
						this.$('.twitter').hide();
					},
					changeTwitter: function(e) {
						console.log(e);
						if (e.keyCode != 13) return;
      					if (!this.$('.edit_twitter').val()) return;

						var twitter = this.$('.edit_twitter').val();
						
						this.model.set('twitter', twitter);
						this.model.save();

						this.$('.edit_twitter').hide();
						this.$('.twitter').show();
						Users.fetch();
					},
					goTwitter: function() {
						//not enough time to try and implement the twitter api
						if(this.model.get('twitter')=="") return;

						var url = "https://twitter.com/"+this.model.get('twitter');
						window.open(
							url,
							'_blank'
						);
					},
					changePicture: function(evt) {
						//yay html5 file api!
						var self = this;
						console.log(evt);
						var files = evt.target.files;
						var f = files[0];
						var reader = new FileReader();
						reader.onload = (function(theFile) {
							return function(e) {
							  // Render thumbnail.

								self.model.set('image', e.target.result);
								self.model.save();
							};
						})(f);

					      // Read in the image file as a data URL.
					      reader.readAsDataURL(f);
					},
					deleteUser: function() {
						// console.log('deleting');
						this.model.destroy();
					}
			});
			
			var GameModel = Backbone.Model.extend({
				defaults: {
					turns: {"computer":[],"player":[]},
					wins: [
						[1,2,3],
						[4,5,6],
						[7,8,9],
						[1,4,7],
						[2,5,8],
						[3,6,9],
						[1,5,9],
						[3,5,7]
					],
					condition: null
				},
				checkCondition: function(which) {
					var turns = this.get('turns');
					var wins = this.get('wins');
					var total = turns.player.length + turns.computer.length;
					for(var i in wins) {
						var win = wins[i];
						var check = _.difference(win,turns[which]);
						if(check.length==0) {
							this.set('condition',"win");
						}
					}
					if(total==9 && this.get('condition')!="win") {
						this.set('condition','tie');
					}
				},
				playerTurn: function(num) {
					var turns = this.get('turns');
				
					turns.player.push(parseInt(num));
					turns.player.sort();
					this.set('turns',turns);
					
					return this.checkCondition('player');
				},
				computerTurn: function(num) {
					var turns = this.get('turns');
					var playerTurns = turns.player;
					var computerTurns = turns.computer;
					var x=false;
					while(!x) {
						var rand = Math.floor((Math.random() * 9) + 1);
						if(playerTurns.indexOf(rand)===-1 && computerTurns.indexOf(rand)===-1) {
							turns.computer.push(rand);
							x=true;
						}
					}

					var con = this.checkCondition('computer');
					return rand;
				}
			});

			var GameView = Backbone.View.extend({
				el: $('#game'),

				initialize: function() {
					
					$('#app').hide();
					$('#game').show();
					document.getElementById('music').play();
					this.playing = true;
					this.model = new GameModel();

					var eventsHash = {};
					this.tiles = this.$('.tile');
					// console.log(this.tiles);
					for(var i=0; i<9; i++) {
						var tile = this.tiles[i];
						var id = "click #"+tile.id;
						var func = "clicking"+tile.id;
						eventsHash[id] = func;
						this[func] = function(e) {
							var initCon = this.model.get('condition');
							if(initCon=="win" || initCon=="tie") {
								return false;
							}
							this.model.playerTurn(e.target.id);
							var id = "#"+e.target.id;
							$(id).html("X");
							if(this.model.get('condition')===null) {
								var compTurn = this.model.computerTurn();
								console.log(compTurn);
								var oID = "#"+compTurn;
								$(oID).html('O');
								var con = this.model.get('condition');
								this.$('status').html('Game over, refresh the page');
							}
							else {
								var con = this.model.get('condition');
								this.$('#status').html('Game over, refresh the page');
							}
							
						}
					}
					eventsHash['click #volume'] = "switchVolume";
					this.events = eventsHash;
					this.delegateEvents();

				},

				switchVolume: function(e) {
					// if(e.target.src='http://localhost/shapeways/img/play.png') {
					// 	e.target.src="http://localhost"
					// }
					if(this.playing) {
						document.getElementById('music').pause();
						e.target.src = "img/mute.png";
						this.playing=false;
					}
					else {
						document.getElementById('music').play();
						e.target.src = "img/play.png";
						this.playing=true;;
					}
				}
			});


			var App = new AppView;
		});
	// });
});