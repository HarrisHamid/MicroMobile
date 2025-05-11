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
                email: "cfoster3@stevens.edu",
                address: "1 Castle Point Terrace",
                inHoboken: true,
                signupDate: "05/06/2025",
                lastLogin: "05/06/2025 08:24PM",
                ratings: [{userId: "6820e128170e22aca1ca2c73", rating: 5}, {userId: "6820e128170e21aca1ca7c73", rating: 2}],
                ratingAverage: 3.5,
                ratingCount: 2 
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
                ratingCount: 1
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
                ratingCount: 0
              }
        ];

        await db.collection('users').insertMany(users);
        console.log('Seeded users.');

        const posts = [
            {
                id: "7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6311",
                postTitle: "Segway Ninebot ES4",
                vehicleType: "Scooter",
                vehicleTags: ["Electric", "Two Wheels"],
                vehicleCondition: 4.5,
                currentlyAvailable: true,
                vehicleComments: [
                  {
                    id: "7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6312",
                    Username: "foster",
                    Name: "Colby Foster",
                    commentDate: "12/12/2024",
                    Body: "good scooter"
                  },
                  {
                    id: "8c8998b3-d1e3-5g9d-c38b-7b2e5c6c7423",
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
                requests: [],
                taken: []
              },
              {
                id: "9d9a9c4-e2f4-6h0e-d49c-8c3f6d7d8533",
                postTitle: "Mountain Bike Pro",
                vehicleType: "Bicycle",
                vehicleTags: ["Off Road"],
                vehicleCondition: 4.2,
                currentlyAvailable: true,
                vehicleComments: [
                  {
                    id: "9d9a9c4-e2f4-6h0e-d49c-8c3f6d7d8534",
                    Username: "i_love_micromobile",
                    Name: "Micro Mobile",
                    commentDate: "5/5/2025",
                    Body: "Smooth ride, great for trails"
                  }
                ],
                posterUsername: "ajfra",
                posterName: "AJ Francese",
                maxRentalHours: 0,
                maxRentalDays: 5,
                hourlyCost: 0,
                dailyCost: 15,
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
                requests: [],
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