import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load env vars from .env.local (Vite's default)
dotenv.config({ path: join(__dirname, '../.env.local') });

const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID
};

console.log("Initializing Firebase with project ID:", firebaseConfig.projectId);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const types = ["movie", "series", "sports", "music"];

const genresByType = {
    movie: ["Action", "Sci-Fi", "Drama", "Comedy", "Thriller", "Horror", "Romance"],
    series: ["Action", "Sci-Fi", "Drama", "Comedy", "Thriller", "Documentary"],
    sports: ["Football", "Basketball", "Tennis", "Formula 1", "Cricket", "UFC"],
    music: ["Pop", "Rock", "Hip Hop", "Classical", "Jazz", "Electronic"]
};

function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomDuration() {
    const hours = Math.floor(Math.random() * 3);
    const mins = Math.floor(Math.random() * 60);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
}

function getRandomRating() {
    return Number((Math.random() * 4 + 6).toFixed(1)); // random 6.0 - 10.0
}

function getMockImages(type) {
    const thumbs = {
        movie: ["https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80", "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&q=80", "https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=400&q=80"],
        series: ["https://images.unsplash.com/photo-1593696954577-ab3d39317b97?w=400&q=80", "https://images.unsplash.com/photo-1522869635100-9f4c5e86fe33?w=400&q=80", "https://images.unsplash.com/photo-1505775561242-7276188edfa4?w=400&q=80"],
        sports: ["https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&q=80", "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=400&q=80", "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&q=80"],
        music: ["https://images.unsplash.com/photo-1470229722913-7c092b89ea2e?w=400&q=80", "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80", "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&q=80"]
    };

    const backdrops = {
        movie: ["https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&q=80", "https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=1920&q=80"],
        series: ["https://images.unsplash.com/photo-1593696954577-ab3d39317b97?w=1920&q=80", "https://images.unsplash.com/photo-1505775561242-7276188edfa4?w=1920&q=80"],
        sports: ["https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1920&q=80", "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1920&q=80"],
        music: ["https://images.unsplash.com/photo-1470229722913-7c092b89ea2e?w=1920&q=80", "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1920&q=80"]
    };

    return {
        thumbnail: getRandomItem(thumbs[type]),
        backdrop: getRandomItem(backdrops[type])
    };
}

async function seedData() {
    const contentRef = collection(db, 'content');
    console.log("Seeding data into 'content' collection...");

    try {
        let count = 0;
        // 20 items per type = 80 total
        for (const type of types) {
            for (let i = 1; i <= 20; i++) {
                const images = getMockImages(type);

                await addDoc(contentRef, {
                    title: `Awesome ${type.charAt(0).toUpperCase() + type.slice(1)} ${i}`,
                    type: type,
                    genre: getRandomItem(genresByType[type]),
                    rating: getRandomRating(),
                    thumbnail: images.thumbnail,
                    backdrop: images.backdrop,
                    duration: getRandomDuration(),
                    releaseYear: Math.floor(Math.random() * (2024 - 1990 + 1)) + 1990,
                    popularity: Math.floor(Math.random() * 100000),
                    viewCount: Math.floor(Math.random() * 500000),
                    likeCount: Math.floor(Math.random() * 50000),
                    createdAt: serverTimestamp()
                });

                count++;
                if (count % 10 === 0) process.stdout.write(` ${count} `);
                else process.stdout.write(`.`);
            }
        }

        console.log(`\nSuccessfully seeded ${count} items!`);
    } catch (e) {
        console.error("\nError seeding data:", e);
    }
}

seedData();
