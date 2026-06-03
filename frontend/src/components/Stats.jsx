import React, { useRef, useEffect, useState } from 'react';

const stats = [
    { value: 448,   suffix: '',  label: 'Articles',   color: 'from-indigo-500 to-indigo-400' },
    { value: 25,    suffix: '',  label: 'Parts',       color: 'from-slate-400 to-slate-500' },
    { value: 12,    suffix: '',  label: 'Schedules',   color: 'from-amber-400 to-amber-500' },
    { value: 106,   suffix: '', label: 'Amendments',  color: 'from-indigo-400 to-amber-400' },
];

function useCountUp(target, duration = 1600, start = false) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (!start) return;
        let startTime = null;
        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(ease * target));
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [target, duration, start]);
    return count;
}

const StatCard = ({ value, suffix, label, color, started }) => {
    const count = useCountUp(value, 1800, started);
    return (
        <div className="text-center group">
            <div className={`text-5xl sm:text-6xl font-extrabold mb-2 bg-gradient-to-br ${color} bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300 inline-block tracking-tight`}>
                {count}{suffix}
            </div>
            <div className="text-zinc-500 font-bold tracking-wider text-xs uppercase mt-1">{label}</div>
        </div>
    );
};

const Stats = () => {
    const ref = useRef(null);
    const [started, setStarted] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setStarted(true); },
            { threshold: 0.5 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section ref={ref} className="py-20 relative bg-black overflow-hidden">


            <div className="relative max-w-screen-2xl w-full mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-zinc-900/40 backdrop-blur-2xl rounded-[2.5rem] px-10 py-16 border border-zinc-800/50 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)]">
                    <p className="text-center text-zinc-400 text-xs font-black uppercase tracking-widest mb-12">
                        The Constitution — by the numbers
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                        {stats.map((s) => (
                            <StatCard key={s.label} {...s} started={started} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Stats;

