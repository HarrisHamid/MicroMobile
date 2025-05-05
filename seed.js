import { dbConnection, closeConnection } from "./config/mongoConnections.js";

const seedDatabase = async () => {
    try {
        const db = await dbConnection();
        await db.dropDatabase();

        const users = [
            {
                id: "7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310",
                username: "da_programmer_man",
                name: "Colby Foster",
                hashedPassword: "$2a$08$XdvNkfdNIL8F8xsuIUeSbNOF",
                email: "cfoster4@stevens.edu",
                address: "1 Castle Point Terrace",
                inHoboken: true,
                rating: 4.4
              },
              {
                id: "8c8998b3-d1e3-5g9d-c38b-7b2e5c6c7421",
                username: "ajfra",
                name: "AJ Francese",
                hashedPassword: "$2a$08$YewMkgeJKL9G9ytvJVfTbQOP",
                email: "afrances@stevens.edu",
                address: "2E Highview Avenue",
                inHoboken: false,
                rating: 4.8
              },
              {
                id: "9d9a9c4-e2f4-6h0e-d49c-8c3f6d7d8532",
                username: "i_love_micromobile",
                name: "Micro Mobile",
                hashedPassword: "$2a$08$ZfxNlhfKLM0H0zuwKWgUcRST",
                email: "micromobile@gmail.com",
                address: "800 Washington Street",
                inHoboken: true,
                rating: 5.0
              }
        ];

        await db.collection('users').insertMany(users);
        console.log('Seeded users.');

        const posts = [
            {
                id: "7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6311",
                postTitle: "Segway Ninebot ES4",
                vehicleType: "Scooter",
                vehicleTags: ["Electric", "2 Wheeler"],
                vehicleCondition: 4.5,
                currentlyAvailable: true,
                vehicleComments: [
                  {
                    id: "7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6312",
                    Username: "da_programmer_man",
                    Name: "Colby Foster",
                    Body: "good scooter"
                  },
                  {
                    id: "8c8998b3-d1e3-5g9d-c38b-7b2e5c6c7423",
                    Username: "ajfra",
                    Name: "AJ Francese",
                    Body: "Great condition and easy to ride!"
                  }
                ],
                posterUsername: "da_programmer_man",
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
                ]
              },
              {
                id: "9d9a9c4-e2f4-6h0e-d49c-8c3f6d7d8533",
                postTitle: "Mountain Bike Pro",
                vehicleType: "Bike",
                vehicleTags: ["Offroad", "21-speed"],
                vehicleCondition: 4.2,
                currentlyAvailable: true,
                vehicleComments: [
                  {
                    id: "9d9a9c4-e2f4-6h0e-d49c-8c3f6d7d8534",
                    Username: "i_love_micromobile",
                    Name: "Micro Mobile",
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
                ]
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