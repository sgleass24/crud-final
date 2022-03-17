var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');

// display movies page
router.get('/', function(req, res, next) {

    dbConn.query('SELECT * FROM movies ORDER BY id desc',function(err,rows)     {

        if(err) {
            req.flash('error', err);
            // render to views/movies/index.ejs
            res.render('movies',{data:''});
        } else {
            // render to views/movies/index.ejs
            res.render('movies',{data:rows});
        }
    });
});

// display add movie page
router.get('/add', function(req, res, next) {
    // render to add.ejs
    res.render('movies/add', {
        title: '',
        director: ''
    })
})

// add a new movie
router.post('/add', function(req, res, next) {

    let title = req.body.title;
    let director = req.body.director;
    let errors = false;

    if(title.length === 0 || director.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Please enter title and director");
        // render to add.ejs with flash message
        res.render('movies/add', {
            title: title,
            director: director
        })
    }

    // if no error
    if(!errors) {

        var form_data = {
            title: title,
            director: director
        }

        // insert query
        dbConn.query('INSERT INTO movies SET ?', form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)

                // render to add.ejs
                res.render('movies/add', {
                    title: form_data.title,
                    director: form_data.director
                })
            } else {
                req.flash('success', 'Movie successfully added');
                res.redirect('/movies');
            }
        })
    }
})

// display edit movies page
router.get('/edit/(:id)', function(req, res, next) {

    let id = req.params.id;

    dbConn.query('SELECT * FROM movies WHERE id = ' + id, function(err, rows, fields) {
        if(err) throw err

        // if user not found
        if (rows.length <= 0) {
            req.flash('error', 'Movie not found with id = ' + id)
            res.redirect('/movies')
        }
        // if movie found
        else {
            // render to edit.ejs
            res.render('movies/edit', {
                title: 'Edit Movie',
                id: rows[0].id,
                title: rows[0].title,
                director: rows[0].director
            })
        }
    })
})

// update movie data
router.post('/update/:id', function(req, res, next) {

    let id = req.params.id;
    let title = req.body.title;
    let director = req.body.director;
    let errors = false;

    if(title.length === 0 || director.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Please enter title and director");
        // render to add.ejs with flash message
        res.render('movies/edit', {
            id: req.params.id,
            title: title,
            director: director
        })
    }

    // if no error
    if( !errors ) {

        var form_data = {
            title: title,
            director: director
        }
        // update query
        dbConn.query('UPDATE movies SET ? WHERE id = ' + id, form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('movies/edit', {
                    id: req.params.id,
                    title: form_data.title,
                    director: form_data.director
                })
            } else {
                req.flash('success', 'Movie successfully updated');
                res.redirect('/movies');
            }
        })
    }
})

// delete movie
router.get('/delete/(:id)', function(req, res, next) {

    let id = req.params.id;

    dbConn.query('DELETE FROM movies WHERE id = ' + id, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to books page
            res.redirect('/movies')
        } else {
            // set flash message
            req.flash('success', 'Movie successfully deleted! ID = ' + id)
            // redirect to books page
            res.redirect('/movies')
        }
    })
})

module.exports = router;