import Card from '../ui/Card';

export default function RecommendedGrid({ title, items }) {
    return (
        <div className="px-6 md:px-12 py-8">
            <h2 className="text-xl md:text-2xl font-bold mb-6">{title}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-y-16 gap-x-4">
                {items.map(item => (
                    <div key={item.id} className="w-full flex justify-center">
                        {/* Override negative margin effects for grid by wrapping */}
                        <div className="scale-[0.85] origin-top -m-8">
                            <Card item={item} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
