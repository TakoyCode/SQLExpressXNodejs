// Used this video: https://www.youtube.com/watch?v=pKd0Rpw7O48

const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const courses = [
    { id: 1, name: 'course1' },
    { id: 2, name: 'course2' },
    { id: 3, name: 'course3' },
];

app.get('/', (req, res) => {
    res.send(`<h1>Bing</h1>`);
});

app.get('/api/courses', (req, res) => {
    res.send(courses);
});


app.post('/api/courses/old', (req, res) => {

    // Lager en schema som holder alle våre kriterier for hva som er er valid objekt
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
    });
    // Bruker så Joi til å sjekke om det som blir sendt inn er valid, i forhold til schema vi lagde
    const result = schema.validate(req.body);
    console.log(result);

    // Hvis vi får en error fra når vi sjekket med joi, så sender vi tilbake den error meldingen og avslutter funksjonen
    if (result.error) return res.status(400).send(result.error.details[0].message);

    // Før Joi:
    // Sjekker om name er valid og at den er lengre en 3 karakterer
    // if (!req.body.name || req.body.name.length < 3) {
    //     res.status(400).send('Name is required and should be minimum 3 characters.');
    //     return;
    // }

    const course = {
        id: courses.length + 1,
        name: req.body.name,
    };

    courses.push(course);
    res.send(course);
});

app.get('/api/courses/:id', (req, res) => {
    const course = courses.find((c) => (c.id === parseInt(req.params.id)));

    // Sender en status kode med verdien 404, når den ikke finner en course med den id-en
    if (!course) return res.status(404).send('The course with the given ID was not found.')
    res.send(course);

    // courses.forEach((c) => {
    //     if (c.id == req.params.id) res.send(c);
    // });
    // const index = req.params.id - 1;
    // res.send(courses[index]);
});

app.post('/api/courses', (req, res) => {
    // const result = validateCourse(req.body);
    // { error } er det samme som å skrive result.error
    const { error } = validateCourse(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const course = {
        id: courses.length + 1,
        name: req.body.name,
    };

    courses.push(course);
    res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
    // Check if the course exists
    const course = courses.find((c) => (c.id === parseInt(req.params.id)));
    if (!course) return res.status(404).send('The course with the given ID was not found.');

    // Validate the incoming information

    // const result = validateCourse(req.body);
    // { error } er det samme som å skrive result.error
    const { error } = validateCourse(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Update the course
    course.name = req.body.name;

    res.send(course);
    // res.status(200).send(`Course with id ${course.id}, has been updated.`)
});

app.delete('/api/courses/:id/', (req, res) => {
    // Check if the course exists
    const course = courses.find((c) => (c.id === parseInt(req.params.id)));
    if (!course) return res.status(404).send('The course with the given ID was not found.');

    // Get the index for the course
    const index = courses.indexOf(course);

    // Remove the course
    courses.splice(index, 1);

    // Send back the removed course
    res.send(course);
});

app.delete('/api/courses/:id/ver1', (req, res) => {
    // Find the index to the course that has the matching id
    const index = courses.find((c) => (c.id === parseInt(req.params.id)));

    // Check if it found a index 
    if (index === -1) return res.status(404).send('The course with the given ID was not found.');

    // Remove the course
    const removedCourse = courses.splice(index, 1);

    // Send back the removed course
    res.send(removedCourse);
});

function validateCourse(course) {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
    });

    return schema.validate(course);
}



// req.params gir deg parameterne i api linken
// f.eks. api/posts/2001/2, så hadde req.params vært { "year": "2001", "month": "2" }
// req.query gir deg alt som ligger etter ? i lenken, så alt som er ekstra og ikke er nødvending
// f.eks. api/posts/2001/2?sortBy=name, så hadde req.query vært { "sortBy": "name" }
app.get('/api/posts/:year/:month', (req, res) => {
    res.send([req.params, req.query]);
});

// PORT - leser verdien til enviormentent sitt felt som heter PORT og hvis det er tomt så bruker den 3000 i stedet for PORT
const port = process.env.PORT || 3000;

// Bestemer hvem port http serveren skal lyte til
app.listen(port, () => { console.log(`Listening on port ${port}...`) });
