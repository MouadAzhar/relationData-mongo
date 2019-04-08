const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

const authorSchema =  new mongoose.Schema({
  name: String,
  bio: String,
  website: String
});

const Author = mongoose.model('Author',authorSchema);
const Course = mongoose.model('Course', new mongoose.Schema({
  name: String,
  authors: [authorSchema] 
}));

async function createAuthor(name, bio, website) { 
  const author = new Author({
    name, 
    bio, 
    website 
  });

  const result = await author.save();
  console.log(result);
}

async function createCourse(name, authors) {
  const course = new Course({
    name, 
    authors
  }); 
  
  const result = await course.save();
  console.log(result);
}

async function listCourses() { 
  const courses = await Course
    .find()
    .populate('author','name -_id')
    .select('name author');
  console.log(courses);
}

// async function updateAuthor(courseID){
//     const course = await Course.findById(courseID);
//     course.author.name = 'Mouad';
//     course.save();

// }
async function updateAuthor(courseID){
    const course = await Course.update({_id:courseID},{
        $set :{
            'author.name' : 'John '
        }
    });
    course.author.name = 'Mouad';
    course.save();

}

async function addAuthor(courseID,author){
 const course = await Course.findById(courseID);
 course.authors.push(author);
 course.save();
}
async function removeAuthor(courseID,authorID){
  const course = await Course.findById(courseID);
  const author =  course.authors.id(authorID); 
  author.remove();
  course.save();
}

//addAuthor('5cab0e910164383ad815c145', new Author ({name:"Jarvan"}) );
//createCourse('Node Course', [
// new Author({name:'Mouad'}),
// new Author({name:'TybaG'})
// ]);

//updateAuthor('5ca61b311865cf4bacaead57');

removeAuthor('5cab0e910164383ad815c145','5cab14a7e769402684762678');
