$(function() {

	var model = {
		cats : [
			{
				name: "Sally-Anna", 
				pic: "images/catclicker.jpg",
				clicks: 0
			},
			{
				name: "Mr. Grumpkins" ,
				pic: "images/cat2.jpg", 
				clicks: 0
			},
			{
				name: "Nero", 
				pic: "images/future-nero.jpg",
				clicks: 0
			},
			{
				name: "Barney",
				pic: "images/barney.jpg", 
				clicks: 0
			},
			{
				name: "Narnia",
				pic: "images/narnia.jpg",
				clicks: 0
			},
		],
		admin: false
	};

	var octopus = {
		setCatID: function() {
			model.cats.forEach(function(cat, index) {
				cat.id = index;
			});
		},

		getAllCats : function() {
			return model.cats;
		},

		selectCat: function(cat) {
			this.currentCat = model.cats[cat.id];
			displayView.render();
			adminView.render();
		},

		getSelectedCat: function() {
			return this.currentCat;
		},

		addClicks: function(id) {
			model.cats[id].clicks++;
			displayView.render();
			adminView.render();
		},

		toggleAdmin: function() {
			if (model.admin) {
				model.admin = false;
			} else {
				model.admin = true;
			};
			adminView.render();
		},

		adminMode: function() {
			return model.admin;
		},

		update: function() {
			//Get values from inputs
			var name = $('#name').val();
			var pic = $('#imageURL').val();
			var clicks = $('#clicks').val();

			var id = this.currentCat.id
			//Change the model for the current cat
			model.cats[id].name = name;
			model.cats[id].pic = pic;
			model.cats[id].clicks = clicks;

			this.toggleAdmin(); //turn off Admin mode
			$('.cat-list').empty();
			listView.render();
			displayView.render();
		},

		init : function() {
			this.setCatID();
			this.currentCat = model.cats[0];

			listView.init();
			displayView.init();
			adminView.init();
		}

	}

	var listView = {
		init: function() {
			this.$listView = $('.list-view'); //the list-view div
			this.catTemplate = $('script[data-template="cat-link"]').html(); //list item
			this.catList = $('<ul class="cat-list"></ul>');
		
			this.$listView.on('click', 'a', function() {
				var cat = $(this).parents().data();
				octopus.selectCat(cat);
			});

			this.render();
		},

		render: function() {
			// Cache vars for use in forEach() callback
			var $listView = this.$listView,
				catTemplate = this.catTemplate,
				catList = this.catList;

			octopus.getAllCats().forEach(function(cat) {
				var thisTemplate = catTemplate
				.replace(/{{id}}/, cat.id)
				.replace(/{{name}}/, cat.name);
				catList.append(thisTemplate);
				return false;
			});
			$listView.html(catList);
		}
	};

	var displayView = {
		init: function() {
			this.$displayArea = $('.display-area'); //div
			this.displayTemplate = $('script[data-template="display-area"]').html();

			this.$displayArea.on('click', 'img', function() {
				var id = $(this).parents().data("id");
				octopus.addClicks(id);
			})
		
			this.render();
		},

		render: function() {
			var $displayArea = this.$displayArea, //div
				displayTemplate = this.displayTemplate;

			var thisCat = octopus.getSelectedCat();
			var thisTemplate = 
				displayTemplate
				.replace(/{{id}}/, thisCat.id)
				.replace(/{{name}}/g, thisCat.name)
				.replace(/{{pic}}/g, thisCat.pic)
				.replace(/{{clicks}}/g, thisCat.clicks);
			$displayArea.html(thisTemplate);

		}
	};

	var adminView = {
		init: function() {
			this.$admin = $('.admin'); //Admin Div
			this.$adminBtn = $('.admin-btn') //Admin Button
			this.adminForm = $('.admin-form'); //Admin Form

			this.$adminBtn.click(function() {
				octopus.toggleAdmin();
			});

			$('.save-btn').click(function() {
				octopus.update();
			});

			$('.cancel-btn').click(function() {
				octopus.toggleAdmin();
			});

			this.render();
		},

		render: function() {
			var admin = this.$admin,
				form = this.adminForm;

			var cat = octopus.getSelectedCat();

			$('#name').val(cat.name);
			$('#imageURL').val(cat.pic);
			$('#clicks').val(cat.clicks);
			
			if (octopus.adminMode()) {
				form.show();
			} else {
				form.hide();
			}

		}
	};

	octopus.init();
});