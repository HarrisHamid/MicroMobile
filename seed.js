import { ObjectId } from "mongodb";
import { dbConnection, closeConnection } from "./config/mongoConnections.js";

const seedDatabase = async () => {
    try {
        const db = await dbConnection();
        await db.dropDatabase();

        const users = [
            {
                firstName: "Colby",
                lastName: "Foster",
                userId: "foster",
                password: "$2b$10$dnq4FMTtxKZyvXAeT7siGeQyLud./DzsihdmkVT4rY2GuQUcGPHn6",
                email: "cfoster4@stevens.edu",
                address: "1 Castle Point Terrace",
                inHoboken: true,
                signupDate: "05/06/2025",
                lastLogin: "05/06/2025 08:24PM",
                ratings: [{userId: "6820e128170e22aca1ca2c73", rating: 5}, {userId: "6820e128170e21aca1ca7c73", rating: 2}],
                ratingAverage: 3.5,
                ratingCount: 2,
                requests: [{endDate : "2025-05-14T13:57:35.284Z",
                  extraComments : "I want this scooter",
                  requestingUser : "ajfra",
                  startDate: "2025-05-13T13:57:32.829Z",
                  title: "Segway Ninebot ES4",
                  vehicleId: "68221d78e3075c435680c814"
                },
                {endDate : "2025-05-14T13:57:35.284Z",
                  extraComments : "I want this bike",
                  requestingUser : "foster",
                  startDate: "2025-05-13T13:57:32.829Z",
                  title: "Mountain Bike Pro",
                  vehicleId: "68221d78e3075c435680c815"
                }
              ],  
                clients: ["ajfra"]
              },
              {
                firstName: "AJ",
                lastName: "Francese",
                userId: "ajfra",
                password: "$2a$08$YewMkgeJKL9G9ytvJVfTbQOP",
                email: "afrances@stevens.edu",
                address: "2E Highview Avenue",
                inHoboken: false,
                signupDate: "05/06/2025",
                lastLogin: "05/06/2025 08:24PM",
                ratings: [{userId: "6820e128170e21aca1ca7c73", rating: 3}],
                ratingAverage: 3,  
                ratingCount: 1,
                requests: [],
                taken: []
              },
              {
                firstName: "Micro",
                lastName: "Mobile",
                userId: "i_love_micromobile",
                password: "$2a$08$ZfxNlhfKLM0H0zuwKWgUcRST",
                email: "micromobile@gmail.com",
                address: "800 Washington Street",
                inHoboken: true,
                signupDate: "05/06/2025",
                lastLogin: "05/06/2025 08:24PM",
                ratings: [],
                ratingAverage: 0,  
                ratingCount: 0,
                requests: [],
                taken: []
              }
        ];

        await db.collection('users').insertMany(users);
        console.log('Seeded users.');

        const posts = [
            {
                _id: new ObjectId("68221d78e3075c435680c814"),
                postTitle: "Segway Ninebot ES4",
                vehicleType: "Scooter",
                vehicleTags: ["Electric", "Two Wheels"],
                vehicleCondition: 4.5,
                currentlyAvailable: true,
                vehicleComments: [
                  {
                    _id: new ObjectId("68221d78e3075c435680c817"),
                    Username: "foster",
                    Name: "Colby Foster",
                    commentDate: "12/12/2024",
                    Body: "good scooter"
                  },
                  {
                    _id: new ObjectId("68221d78e3075c435680c818"),
                    Username: "ajfra",
                    Name: "AJ Francese",
                    commentDate: "3/5/2025",
                    Body: "Great condition and easy to ride!"
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
                  [0,0,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,1,0,0,0,0],
                  [0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,1,0,0,0,0],
                  [0,0,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,1,0,0,0,0],
                  [0,0,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,1,0,0,0,0],
                  [0,0,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,1,0,0,0,0],
                  [0,0,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,1,0,0,0,0]
                ],
                requests: [{endDate : "2025-05-14T13:57:35.284Z",
                  extraComments : "I want this scooter",
                  requestingUser : "ajfra",
                  startDate: "2025-05-13T13:57:32.829Z",
                  title: "Segway Ninebot ES4",
                  vehicleId: "68221d78e3075c435680c814"
                }],
                taken: []
              },
              {
                _id: new ObjectId("68221d78e3075c435680c815"),
                postTitle: "Mountain Bike Pro",
                vehicleType: "Bicycle",
                vehicleTags: ["Off Road"],
                vehicleCondition: 4.2,
                currentlyAvailable: true,
                vehicleComments: [
                  {
                    _id: new ObjectId("68221d78e3075c435680c816"),
                    Username: "i_love_micromobile",
                    Name: "Micro Mobile",
                    commentDate: "5/5/2025",
                    Body: "Smooth ride, great for trails"
                  }
                ],
                posterUsername: "foster",
                posterName: "Colby Foster",
                maxRentalHours: 0,
                maxRentalDays: 5,
                hourlyCost: 0,
                dailyCost: 15,
                location: "Hoboken Terminal",
                image: "/public/uploads/seed2.jpg",
                whenAvailable: [
                  [0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0],
                  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
                ],
                requests: [{endDate : "2025-05-14T13:57:35.284Z",
                  extraComments : "I want this bike",
                  requestingUser : "foster",
                  startDate: "2025-05-13T13:57:32.829Z",
                  title: "Mountain Bike Pro",
                  vehicleId: "68221d78e3075c435680c815"
                }],
                taken: []
              }
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
}