import { ObjectId } from "mongodb";
import { dbConnection, closeConnection } from "./config/mongoConnections.js";

const seedDatabase = async () => {
    try {
        const db = await dbConnection();
        await db.dropDatabase();

        // Users
        const users = [
            {
                _id: new ObjectId("60f5a3b8e1d3f2a5b8c9d001"),
                firstName: "Colby",
                lastName: "Foster",
                userId: "foster",
                password: "$2b$10$dnq4FMTtxKZyvXAeT7siGeQyLud./DzsihdmkVT4rY2GuQUcGPHn6",
                email: "cfoster4@stevens.edu",
                address: "1 Castle Point Terrace",
                inHoboken: "yes",
                state: "NJ",
                signupDate: "05/06/2024",
                lastLogin: "05/06/2025 08:24PM",
                ratings: [
                    { userId: "60f5a3b8e1d3f2a5b8c9d003", rating: 4 },
                    { userId: "60f5a3b8e1d3f2a5b8c9d004", rating: 3 }
                ],
                ratingAverage: 3.5,
                ratingCount: 2,
                requests: [],
                clients: []
            },
            {
                _id: new ObjectId("60f5a3b8e1d3f2a5b8c9d002"),
                firstName: "AJ",
                lastName: "Francese",
                userId: "ajfra",
                password: "$2a$08$YewMkgeJKL9G9ytvJVfTbQOP",
                email: "afrances@stevens.edu",
                address: "493 Washington Street",
                inHoboken: "yes",
                state: "NJ",
                signupDate: "05/06/2024",
                lastLogin: "05/06/2025 08:24PM",
                ratings: [
                    { userId: "60f5a3b8e1d3f2a5b8c9d001", rating: 5 }
                ],
                ratingAverage: 5,
                ratingCount: 1,
                requests: [],
                clients: []
            },
            {
                _id: new ObjectId("60f5a3b8e1d3f2a5b8c9d003"),
                firstName: "Jack",
                lastName: "Bulas",
                userId: "DarklightNinja",
                password: "$2a$08$YewMkgeJKL9G9ytvJVfTbQOP", 
                email: "jbulas@stevens.edu",
                address: "123 Jefferson Street",
                inHoboken: "yes",
                state: "NJ",
                signupDate: "01/10/2023",
                lastLogin: "05/12/2025 09:00AM",
                ratings: [],
                ratingAverage: 0,
                ratingCount: 0,
                requests: [],
                clients: []
            },
            {
                _id: new ObjectId("60f5a3b8e1d3f2a5b8c9d004"),
                firstName: "Harris",
                lastName: "Hamid",
                userId: "harrishamid",
                password: "$2a$08$YewMkgeJKL9G9ytvJVfTbQOP", 
                email: "hhamid@stevens.edu",
                address: "456 Washington Street",
                inHoboken: "yes",
                state: "NJ",
                signupDate: "05/10/2024",
                lastLogin: "05/12/2025 09:05AM",
                ratings: [
                    { userId: "60f5a3b8e1d3f2a5b8c9d002", rating: 4 }
                ],
                ratingAverage: 4,
                ratingCount: 1,
                requests: [],
                clients: []
            }
        ];
        await db.collection('users').insertMany(users);
        console.log('Seeded users.');

        // Posts
        const posts = [
            {
                _id: new ObjectId("68221d78e3075c435680c814"),
                postTitle: "Segway Ninebot ES4",
                vehicleType: "Scooter",
                vehicleTags: ["Electric", "Two Wheels"],
                vehicleCondition: 3.8,
                currentlyAvailable: true,
                vehicleComments: [
                    {
                        _id: new ObjectId("aaaaaaaaaaaaaaaaaaaaaaaa"),
                        Username: "DarklightNinja",
                        Name: "Jack Bulas",
                        commentDate: "05/3/2025",
                        Body: "Condition is lower than 3.8, but not terrible."
                    },
                    {
                        _id: new ObjectId("bbbbbbbbbbbbbbbbbbbbbbbb"),
                        Username: "harrishamid",
                        Name: "Harris Hamid",
                        commentDate: "05/9/2025",
                        Body: "Does not work well on hills."
                    }
                ],
                posterUsername: "foster",
                posterName: "Colby Foster",
                maxRentalHours: 8,
                maxRentalDays: 2,
                hourlyCost: 1.5,
                dailyCost: 10,
                location: "1 Castle Point Terrace",
                image: "/public/uploads/seed1.png",
                whenAvailable: [
                  [], [], [], [], [], [], [], [], [1], [1], [1], [1],
                  [1], [1], [1], [1], [1], [1], [], [], [], [], [], [],

                  [], [], [], [], [], [], [1], [1], [1], [1], [1], [1], 
                  [1], [1], [1], [1], [], [], [], [], [], [], [], [],

                  [], [], [], [], [], [], [1], [1], [1], [1], [1], [1], 
                  [1], [1], [1], [1], [], [], [], [], [], [], [], [],

                  [], [], [], [], [], [], [], [], [], [1], [1], [1], 
                  [1], [], [], [], [], [], [], [], [], [], [], [],

                  [], [], [], [], [], [], [1], [1], [1], [1], [1], [1], 
                  [1], [1], [1], [1], [], [], [], [], [], [], [], [],

                  [], [], [], [], [], [1], [1], [1], [1], [1], [1], [1], 
                  [1], [1], [1], [1], [1], [1], [1], [1], [1], [], [], [],
                  
                  [], [], [], [], [], [1], [1], [1], [1], [1], [1], [1], 
                  [1], [1], [1], [1], [1], [1], [1], [1], [1], [], [], [],
                ],
                requests: [],
                taken: []
            },
            {
                _id: new ObjectId("68221d78e3075c435680c815"),
                postTitle: "Mountain Bike Pro",
                vehicleType: "Bicycle",
                vehicleTags: ["Off Road", "Two Wheels"],
                vehicleCondition: 4.5,
                currentlyAvailable: true,
                vehicleComments: [
                    {
                        _id: new ObjectId("cccccccccccccccccccccccc"),
                        Username: "foster",
                        Name: "Colby Foster",
                        commentDate: "05/5/2025",
                        Body: "Great bike!"
                    }
                ],
                posterUsername: "ajfra",
                posterName: "AJ Francese",
                maxRentalHours: 0,
                maxRentalDays: 5,
                hourlyCost: 0,
                dailyCost: 15,
                location: "Hoboken Terminal",
                image: "/public/uploads/seed2.jpg",
                whenAvailable: [
                  [], [], [], [], [], [1], [1], [], [], [], [], [],
                  [], [], [], [], [], [], [1], [1], [1], [1], [1], [],

                  [], [], [], [], [], [1], [1], [], [], [], [], [],
                  [], [], [], [], [], [], [1], [1], [1], [1], [1], [],

                  [], [], [], [], [], [1], [1], [], [], [], [], [],
                  [], [], [], [], [], [], [1], [1], [1], [1], [1], [],

                  [], [], [], [], [], [1], [1], [], [], [], [], [],
                  [], [], [], [], [], [], [1], [1], [1], [1], [1], [],

                  [], [], [], [], [], [1], [1], [], [], [], [], [],
                  [], [], [], [], [], [], [1], [1], [1], [1], [1], [],

                  [], [], [], [], [], [], [], [], [1], [1], [1], [1], 
                  [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [], [],
                  
                  [], [], [], [], [], [], [], [], [], [], [1], [1], 
                  [1], [1], [1], [1], [1], [1], [1], [], [], [], [], [],
                ],
                requests: [],
                taken: []
            },
            {
                _id: new ObjectId("68221d78e3075c435680c817"),
                postTitle: "Enuff Skully Skateboard",
                vehicleType: "Skateboard",
                vehicleTags: ["New"],
                vehicleCondition: 4.8,
                currentlyAvailable: true,
                vehicleComments: [],
                posterUsername: "harrishamid",
                posterName: "Harris Hamid",
                maxRentalHours: 6,
                maxRentalDays: 2,
                hourlyCost: 2,
                dailyCost: 14,
                location: "456 Washington Street",
                image: "/public/uploads/seed3.jpg",
                whenAvailable: [
                  [], [], [], [], [], [], [], [], [], [], [], [],
                  [], [], [], [], [], [], [1], [1], [1], [1], [1], [],

                  [], [], [], [], [], [], [], [], [], [], [], [],
                  [], [], [], [], [], [], [1], [1], [1], [1], [1], [],

                  [], [], [], [], [], [1], [1], [1], [1], [], [], [],
                  [], [], [], [], [], [], [1], [1], [1], [1], [1], [],

                  [], [], [], [], [], [1], [1], [1], [1], [], [], [],
                  [], [], [], [], [], [], [1], [1], [1], [1], [1], [],

                  [], [], [], [], [], [1], [1], [1], [1], [], [], [],
                  [], [], [], [], [], [], [1], [1], [1], [1], [1], [],

                  [], [], [], [], [], [], [], [], [], [], [], [],
                  [], [], [], [], [], [1], [1], [1], [1], [1], [1], [],
                  
                  [], [], [], [], [], [], [], [], [], [], [], [],
                  [], [], [1], [1], [1], [1], [1], [1], [1], [1], [1], [],
                ],
                requests: [],
                taken: []
            },
            {
                _id: new ObjectId("68221d78e3075c435680c816"),
                postTitle: "Stauber Summit Snowboard",
                vehicleType: "Other",
                vehicleTags: ["Snow Gear"],
                vehicleCondition: 3.2,
                currentlyAvailable: true,
                vehicleComments: [
                    {
                        _id: new ObjectId("dddddddddddddddddddddddd"),
                        Username: "foster",
                        Name: "Colby Foster",
                        commentDate: "04/19/2025",
                        Body: "How long is it?"
                    },
                    {
                        _id: new ObjectId("eeeeeeeeeeeeeeeeeeeeeeee"),
                        Username: "DarklightNinja",
                        Name: "Jack Bulas",
                        commentDate: "04/20/2025",
                        Body: "The board is 128cm long."
                    }
                ],
                posterUsername: "DarklightNinja",
                posterName: "Jack Bulas",
                maxRentalHours: 0,
                maxRentalDays: 7,
                hourlyCost: 0,
                dailyCost: 18,
                location: "123 Jefferson Street",
                image: "/public/uploads/seed4.jpg",
                whenAvailable: [
                  [], [], [], [], [], [1], [1], [1], [1], [], [], [],
                  [], [], [], [], [], [], [1], [1], [1], [1], [], [],

                  [], [], [], [], [], [1], [1], [1], [], [], [], [],
                  [], [], [], [], [], [], [1], [1], [1], [1], [], [],

                  [], [], [], [], [], [1], [1], [1], [1], [1], [], [],
                  [], [], [], [], [], [], [1], [1], [1], [1], [], [],

                  [], [], [], [], [], [1], [1], [], [], [], [], [],
                  [], [], [], [], [], [], [1], [1], [1], [1], [], [],

                  [], [], [], [], [], [1], [1], [1], [], [], [], [],
                  [], [], [], [], [], [], [1], [1], [1], [1], [], [],

                  [], [], [], [], [], [], [], [1], [1], [1], [1], [1], 
                  [1], [1], [1], [1], [1], [1], [1], [1], [1], [], [], [],
                  
                  [], [], [], [], [], [], [], [1], [1], [1], [1], [1], 
                  [1], [1], [1], [1], [1], [1], [1], [], [], [], [], [],
                ],
                requests: [],
                taken: []
            },
        ];
        await db.collection('posts').insertMany(posts);
        console.log('Seeded posts.');

        console.log('Database seeded successfully!');
    } catch (e) {
        console.error('Error seeding database:', e);
    }
};

export {
    seedDatabase
};
