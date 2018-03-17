var app = new Vue({
  el: '#app',
  data: {
    items: [],
    text: '',
    show: 'all',
    drag: {},
    priority: 1,
  },
  created:function() {
    this.getItems();
  },
  computed: {
    activeItems: function() {
      return this.items.filter(function(item) {
	      return !item.completed;
      });
    },
    filteredItems: function() {
      if (this.show === 'active')
	      return this.items.filter(function(item) {
	        return !item.completed;
	  });
      if (this.show === 'completed')
	      return this.items.filter(function(item) {
	        return item.completed;
	  });
      return this.items;
    },
    created: function() {
      this.getItems();
    },
  },
  methods: {
    addItem: function() {

      axios.post("/api/items", {
        text: this.text ? this.text : "blank",
        priority: this.priority,
        completed: false
      }).then(response => {
        this.text = "";
        this.priority = 1;
        this.getItems();
        return true;
      }).catch(err => {
      });
    },
    completeItem: function(item) {
      axios.put("/api/items/" + item.id, {
        text: item.text,
        priority: item.priority,
        completed: !item.completed,
        orderChange: false,
      }).then(response => {
        return true;
      }).catch(err => {
      });
    },
    deleteItem: function(item) {
      axios.delete("/api/items/" + item.id).then(response => {
        this.getItems();
        return true;
      }).catch(err => {
      });
    },
    showAll: function() {
      this.show = 'all';
    },
    showActive: function() {
      this.show = 'active';
    },
    showCompleted: function() {
      this.show = 'completed';
    },
    deleteCompleted: function() {
      this.items.forEach(item => {
        if (item.completed)
          this.deleteItem(item)
      });
    },
    dragItem: function(item) {
      this.drag = item;
    },
    dropItem: function(item) {
      axios.put("/api/items/" + this.drag.id, {
        text: this.drag.text,
        completed: this.drag.completed,
        orderChange: true,
        orderTarget: item.id
      }).then(response => {
        this.getItems();
        return true;
      }).catch(err => {
      });
    },
    getItems: function() {
      axios.get("/api/items").then(response => {
        this.items = response.data;
        return true;
      }).catch(err => {
      });
    },
    sortList: function() {
      this.items = this.items.sort(function(a,b) {
        return b.priority - a.priority;
      })
    },
    move: function(item, direction) {

      axios.put("/api/items/" + item.id, {
        text: item.text,
        priority: (function() {

          var priority = parseInt(item.priority);

          if(direction === "up") {
            if(priority < 3) {
              return priority + 1;
            }
            return priority;

          } else if(direction === "down") {
            if(priority > 1) {
              return priority - 1;
            }
            return priority;
          }

        })(),

        completed: item.completed,
        orderChange: false,
      }).then(response => {
        this.getItems();
        return true;
      }).catch(err => {
      });
    },
  }
});
