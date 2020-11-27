import bcrypt from 'bcryptjs';

const data = {
    users: [
        {
            name: 'Angel',
            email: 'angel.q.nolasco@gmail.com',
            password: bcrypt.hashSync('1234', 8),
            isAdmin: true,
            isSeller: true,
            seller:{
                name: 'Quijano',
                logo: '/images/p1.jpg',
                description: 'Vendedor Quijano',
                rating: 0,
                numReviews: 0,
            },
        },
        {
            name: 'Agustin',
            email: 'gutty@gmail.com',
            password: bcrypt.hashSync('gutty', 8),
            isAdmin: false,
            isSeller: true,
            seller:{
                name: 'Gutty',
                logo: '/images/d1.jpg',
                description: 'Vendedor Gutty',
                rating: 0,
                numReviews: 0,
            },
        }
    ],
    products:[
        {
            name: 'Nike Slim Shirts',
            category: 'Shirts',
            image: '/images/d1.jpg',
            price: 120,
            countInStock: 10,
            brand: 'Nike',
            rating: 4.5,
            numReviews: 10,
            description: 'High quality products',
        },
        {
            name: 'Adidas Fit Shirts',
            category: 'Shirts',
            image: '/images/d1.jpg',
            price: 100,
            countInStock: 12,
            brand: 'Adidas',
            rating: 4.0,
            numReviews: 10,
            description: 'High quality products',
        },
        {
            name: 'Lacoste Free Shirts',
            category: 'Shirts',
            image: '/images/d1.jpg',
            price: 220,
            countInStock: 14,
            brand: 'Lacoste',
            rating: 4.5,
            numReviews: 17,
            description: 'High quality products',
        },
    ]
}

export default data;