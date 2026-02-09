export default function LoadingState() {
    return (
        <div className="flex flex-col items-center justify-center py-16">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
            <p className="mt-6 text-lg text-gray-600">
                Analyzing how AI understands this product…
            </p>
        </div>
    );
}
