
import { useEffect, useState, type JSX } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";



const NoInternetPage: React.FC<{ children: JSX.Element }> = ({ children }) => {

    const [isOnline, setOnline] = useState(true);

    const metaData = {
        title: "CBTAS - Error",
    };

    // On initization set the isOnline state.
    useEffect(() => {
        setOnline(navigator.onLine)
    }, [])

    window.addEventListener('online', () => {
        setOnline(true)
    });

    window.addEventListener('offline', () => {
        setOnline(false)
    });

    if (isOnline) {
        return (
            children
        )
    } else {
        return (
            <main className="h-screen w-full grid place-content-center text-center relative">
                <HelmetProvider>
                    <Helmet {...metaData} />
                </HelmetProvider>
                <video src="https://cdnl.iconscout.com/lottie/premium/preview-watermark/404-error-7362259-6014988.mp4"
                    className="h-[150px] md:h-[200px] w-auto mx-auto" autoPlay muted loop playsInline
                />
                <h3 className="mt-2 font-bold text-navyBlue text-xl md:text-3xl">No Internet Connection</h3>
                <p className="mt-3 mx-auto text-gray-500 text-sm md:text-base">
                    Please try again later.
                </p>
            </main>
        )
    }


}

export default NoInternetPage;