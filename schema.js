const graphql = require('graphql');
const {getStudents,
    getStudentById,
    getCourses,
    getCourseById,
    getCourseByStudentId,
    addCourses,
    updateCourses
    } = require('./Mysql');
    const {
        GraphQLInt,
        GraphQLList,
        GraphQLObjectType,
        GraphQLString,
        GraphQLSchema
    } = graphql;

const Course = new GraphQLObjectType({
    name: 'CourseType',
    fields: () => ({
        course_id: { type: GraphQLInt },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        student_id: { type: GraphQLInt },
        student: {
            type: Student,
            resolve(parentValue, args) {
              const student_id = parentValue.student_id;
                return getStudentById(student_id);
            }
        }
    })
});

const Student = new GraphQLObjectType({
    name: 'StudentType',
    fields: () => ({
        student_id: { type: GraphQLInt },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        course: {
            type: new GraphQLList(Course),
            resolve(parentValue, args) {
              const student_id = parentValue.student_id;
                return getCourseByStudentId(student_id);
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        students: {
            type: new GraphQLList(Student),
            resolve(parentValue, args) {
                return getStudents();
            }
        },
        student: {
            type: Student,
            args: {
               student_id: { type: GraphQLInt } 
              },
            resolve(parentValue, args) {
                return getStudentById(args.student_id);
            }
        },
        courses: {
            type: new GraphQLList(Course),
            resolve(parentValue, args) {
                return getCourses();
            }
        },
        course: {
            type: Course,
            args: {
               course_id: { type: GraphQLInt } 
              },
            resolve(parentValue, args) {
                const course= getCourseById(args.course_id);
                return course;
            }
        }
    }
});

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
        addCourses: {
            type: Course,
            args: {
                title: { type: GraphQLString },
                description: { type: GraphQLString },
                Student_id: { type: GraphQLString }
            },
            resolve(parentValue, args) {
              const { title, description, course_id } = args;
                const course = {
                  title,
                  description,
                  course_time: Math.floor(Date.now() / 1000),
                  course_id 
                }
                return addCourses(course);
            }
        },
        updateCourses: {
            type: Course,
            args: {
                course_id: { type: GraphQLInt },
                title: { type: GraphQLString },
                description: { type: GraphQLString },
                student_id: { type: GraphQLString }
            },
            async resolve(parentValue, args) {
                const { course_id, title, description, student_id } = args;
                const course = await getCourseById(course_id);
                if (course) {
                    course.title = title;
                    course.description = description;
                    course.student_id = student_id;
                    await updateCourses(course);
                }
                return course();
            }
        }
    })
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
});