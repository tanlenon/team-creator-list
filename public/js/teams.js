var app = new Vue({
  el: '#app',
  data: {
    teams: [],
    show: 'all',
    drag: {},
    color1: '#000000',
    color2: '#000000',
    teamName: '',
    mascot: '',
    sport: './../img/question-mark.png',
  },
  created:function() {
    this.getTeams();
  },
  computed: {
    activeTeams: function() {
      return this.teams.filter(function(team) {
	      return !team.completed;
      });
    },
    filteredTeams: function() {
      if (this.show === 'active')
	      return this.teams.filter(function(team) {
	        return !team.completed;
	  });
      if (this.show === 'completed')
	      return this.teams.filter(function(team) {
	        return team.completed;
	  });
      return this.teams;
    },
    created: function() {
      this.getTeams();
    },
  },
  methods: {
    addTeam: function() {

      axios.post("/api/teams", {
        teamName: this.teamName ? this.teamName : "blank",
        color1: this.color1,
        color2: this.color2,
        mascot: this.mascot ? this.mascot : "blank",
        sport: this.sport,
      }).then(response => {
        this.color1 = '#000000',
        this.color2 = '#000000',
        this.teamName = '',
        this.mascot = '',
        this.sport = './../img/question-mark.png',
        this.getTeams();
        return true;
      }).catch(err => {
      });
    },
    deleteTeam: function(team) {
      axios.delete("/api/teams/" + team.id).then(response => {
        this.getTeams();
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
      this.teams.forEach(team => {
        if (team.completed)
          this.deleteTeam(team)
      });
    },
    dragTeam: function(team) {
      this.drag = team;
    },
    dropTeam: function(team) {
      axios.put("/api/teams/" + this.drag.id, {
        color1: this.drag.color1,
        color2: this.drag.color2,
        teamName: this.drag.teamName,
        mascot: this.drag.mascot,
        sport: this.drag.sport,
        orderChange: true,
        orderTarget: team.id
      }).then(response => {
        this.getTeams();
        return true;
      }).catch(err => {
      });
    },
    getTeams: function() {
      axios.get("/api/teams").then(response => {
        this.teams = response.data;
        return true;
      }).catch(err => {
      });
    },
    sortByName: function() {
      this.teams = this.teams.sort(function(a,b) {
        if(a.teamName < b.teamName) return -1;
        if(a.teamName > b.teamName) return 1;
        return 0;
      })
    },
    sortByMascot: function() {
      this.teams = this.teams.sort(function(a,b) {
        if(a.mascot < b.mascot) return -1;
        if(a.mascot > b.mascot) return 1;
        return 0;
      })
    },
    // move: function(team, direction) {

    //   axios.put("/api/teams/" + team.id, {
    //     text: team.text,
    //     priority: (function() {

    //       var priority = parseInt(team.priority);

    //       if(direction === "up") {
    //         if(priority < 3) {
    //           return priority + 1;
    //         }
    //         return priority;

    //       } else if(direction === "down") {
    //         if(priority > 1) {
    //           return priority - 1;
    //         }
    //         return priority;
    //       }

    //     })(),

    //     completed: team.completed,
    //     orderChange: false,
    //   }).then(response => {
    //     this.getTeams();
    //     return true;
    //   }).catch(err => {
    //   });
    // },
  }
});
