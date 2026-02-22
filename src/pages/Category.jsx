import { useParams, Navigate } from 'react-router-dom';
import CategoryPageLayout from '../components/layout/CategoryPageLayout';

const validTypes = ['movie', 'series', 'sports', 'music'];

const categoryInfo = {
    movie: {
        title: "Movies",
        description: "Experience the magic of cinema. From breathtaking blockbusters to critically acclaimed indie masterpieces.",
        heroImage: "https://image.tmdb.org/t/p/original/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg" // Inception
    },
    series: {
        title: "Series",
        description: "Binge-worthy shows to get lost in. Dive deep into complex narratives and unforgettable characters.",
        heroImage: "https://image.tmdb.org/t/p/original/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg" // Breaking Bad
    },
    sports: {
        title: "Sports",
        description: "Feel the adrenaline. Catch all the live action, highlights, and legendary moments.",
        heroImage: "https://image.tmdb.org/t/p/original/2vq5GTJOahE03mNYZGxIynlHcWr.jpg" // Ford v Ferrari
    },
    music: {
        title: "Music",
        description: "Turn up the volume. Unlimited access to the world's best concerts, music videos, and documentaries.",
        heroImage: "https://image.tmdb.org/t/p/original/dcvbs8z0GEXslC1kCT77x19XDeR.jpg" // Bohemian Rhapsody
    }
};

export default function Category() {
    const { type } = useParams();

    if (!validTypes.includes(type)) {
        return <Navigate to="/" replace />;
    }

    const info = categoryInfo[type];

    return (
        <CategoryPageLayout
            key={type} // Ensure layout completely unmounts/remounts when type changes
            type={type}
            title={info.title}
            description={info.description}
            heroImage={info.heroImage}
        />
    );
}
