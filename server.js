const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'))

let teams = [];
let id = 0;

app.get('/api/teams', (req, res) => {
  res.send(teams);
});

app.post('/api/teams', (req, res) => {
  id = id + 1;
  let team = {
    id:id, 
    teamName:req.body.teamName, 
    mascot:req.body.mascot, 
    sport: req.body.sport,
    color1: req.body.color1,
    color2: req.body.color2,
  };
  teams.push(team);
  res.send(team);
});

app.put('/api/teams/:id', (req, res) => {
  let id = parseInt(req.params.id);
  let teamsMap = teams.map(team => { return team.id; });
  let index = teamsMap.indexOf(id);
  let team = teams[index];

  team.teamName = req.body.teamName; 
  team.mascot = req.body.mascot;
  team.sport = req.body.sport;
  team.color1 = req.body.color1;
  team.color2 = req.body.color2;

  // handle drag and drop re-ordering
  if (req.body.orderChange) {
    let indexTarget = teamsMap.indexOf(req.body.orderTarget);
    teams.splice(index,1);
    teams.splice(indexTarget,0,team);
  }
  res.send(team);
});

app.delete('/api/teams/:id', (req, res) => {
  let id = parseInt(req.params.id);
  let removeIndex = teams.map(team => { return team.id; }).indexOf(id);
  if (removeIndex === -1) {
    res.status(404).send("Sorry, that team doesn't exist");
    return;
  }
  teams.splice(removeIndex, 1);
  res.sendStatus(200);
});


app.listen(3000, () => console.log('Server listening on port 3000!'))