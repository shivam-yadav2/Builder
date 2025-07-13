import Lenis from "lenis";
// import 'lenis/dist/lenis.css'

const Smooth = ({ children }) => {
    // Initialize Lenis
    const lenis = new Lenis({
        duration: 1.5
    });

    // Use requestAnimationFrame to continuously update the scroll
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    return <div>{children}</div>;
};

export default Smooth;