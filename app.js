var express = require('express');
var exphbs  = require('express-handlebars');
 
var app = express();
var hbs = exphbs.create({ 
    defaultLayout: 'layout',
    extname: '.hbs',
    partialsDir: 'views/partials/'
});
 
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
 
app.get('/', function (req, res) {
    res.render('home', {
        title: "Homepage"
    });
});

app.get('/:url', function (req, res) {
    res.render(req.params.url, {
        title: req.params.url + " | Portfolio"
    });
});

app.use(express.static('public/'));

app.listen(3030, function () {
  console.log('Listening on http://localhost:3030')
})