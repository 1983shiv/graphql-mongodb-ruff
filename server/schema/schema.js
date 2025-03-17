// import { projects, clients} from "../sampleData.js"
import { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLSchema, GraphQLList, GraphQLNonNull, GraphQLEnumType} from "graphql"

import Client from "../models/Client.js"
import Project from "../models/Project.js"

// client type
const ClientType = new GraphQLObjectType({
    name: 'Client',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString }
    })
})

// project type
const ProjectType = new GraphQLObjectType({
    name: 'Project',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        status: { type: new GraphQLEnumType({
            name: 'myProjectStatus',
            values: {
                'new': { value: 'Not Started' },
                'progress': { value: 'In Progress' },
                'completed': { value: 'Completed' }
            },
            defaultValue: 'Not Started'
        }) },
        client: {
            type: ClientType,
            resolve(parent, args) {
                // return clients.find(client => client.id === parent.clientId)
                return Client.findById(parent.clientId)
            }
        }
    })
})

// Query
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        projects: {
            type: GraphQLList(ProjectType),
            resolve(parent, args) {
                // return projects, projects object[] is coming from sampleData.js
                return Project.find()
            }
        },
        project: {
            type: ProjectType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                // return projects.find(project => project.id === args.id)
                return Project.findById(args.id)
            }
        },
        clients: {
            type: GraphQLList(ClientType),
            resolve(parent, args) {
                // return clients, clients object[] is coming from sampleData.js
                return Client.find()
            }
        },
        client: {
            type: ClientType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                // return clients.find(client => client.id === args.id)
                return Client.findById(args.id)
            }
        }
    }
})  


// Mutation
const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addClient: {
            type: ClientType,
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                email: { type: GraphQLString },
                phone: { type: GraphQLString },
            },
            resolve(parent, args) {
                const client = new Client({
                    name: args.name,
                    email: args.email,
                    phone: args.phone
                })
                return client.save()
            }
        },
        deleteClient: {
            type: ClientType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args) {
                return Client.findByIdAndDelete(args.id)
            }
        },
        addProject: {
            type: ProjectType,
            args: {
                name: { type: GraphQLString },
                description: { type: GraphQLString },
                status: { type: new GraphQLEnumType({
                    name: 'ProjectStatus',
                    values: {
                        'new': { value: 'Not Started' },
                        'progress': { value: 'In Progress' },
                        'completed': { value: 'Completed' }
                    },
                    defaultValue: 'Not Started'
                }) },
                clientId: { type: GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args) {
                const project = new Project({
                    name: args.name,
                    description: args.description,
                    status: args.status,
                    clientId: args.clientId
                })
                return project.save()
            }
        },
        deleteProject: {
            type: ProjectType,
            args: {
                id: { type: GraphQLID }
            },
            resolve(parent, args) {
                return Project.findByIdAndDelete(args.id)
            }
        },
        updateProject: {
            type: ProjectType,
            args: {
                id: { type: GraphQLID },
                name: { type: GraphQLString },
                description: { type: GraphQLString },
                status: { type: GraphQLString },
            },
            resolve(parent, args) {
                return Project.findByIdAndUpdate(args.id, {
                    $set: {
                        name: args.name,
                        description: args.description,
                        status: args.status
                    }
                }, { new: true })
            }
        }
    }
})

const schema = new GraphQLSchema({
    query: RootQuery,
    mutation: mutation
})

export default schema;