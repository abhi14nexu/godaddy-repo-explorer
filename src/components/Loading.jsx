import { useState, useEffect } from 'react';

const Loading = ({ message = 'Loading...' }) => {
  const [percentage, setPercentage] = useState(0);
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    // Generate random positions for floating percentages
    const generatePositions = () => {
      const newPositions = [];
      for (let i = 0; i < 8; i++) {
        newPositions.push({
          id: i,
          x: Math.random() * 80 + 10, // 10% to 90% of screen width
          y: Math.random() * 80 + 10, // 10% to 90% of screen height
          delay: Math.random() * 2,
          duration: 3 + Math.random() * 2
        });
      }
      setPositions(newPositions);
    };

    generatePositions();

    // Animate percentage from 0 to 100
    const interval = setInterval(() => {
      setPercentage(prev => {
        if (prev >= 100) {
          return 0; // Reset to create continuous loop
        }
        return prev + 1;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/95 backdrop-blur-sm">
      {/* Floating percentage numbers */}
      {positions.map((pos) => (
        <div
          key={pos.id}
          className="absolute text-gray-400 font-mono text-sm animate-pulse opacity-20"
          style={{
            left: `${pos.x}%`,
            top: `${pos.y}%`,
            animationDelay: `${pos.delay}s`,
            animationDuration: `${pos.duration}s`
          }}
        >
          {Math.floor(percentage * (0.7 + Math.random() * 0.6))}%
        </div>
      ))}

      {/* Main loader */}
      <div className="relative z-10 text-center">
        {/* Circular progress */}
        <div className="relative w-24 h-24 mx-auto mb-6">
          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="rgb(229, 231, 235)"
              strokeWidth="4"
              fill="none"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="rgb(31, 41, 55)"
              strokeWidth="4"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - percentage / 100)}`}
              strokeLinecap="round"
              className="transition-all duration-100 ease-out"
            />
          </svg>
          
          {/* Center percentage */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-800 font-mono">
              {percentage}%
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-64 h-1 bg-gray-200 rounded-full overflow-hidden mb-4 mx-auto">
          <div 
            className="h-full bg-gray-800 rounded-full transition-all duration-100 ease-out"
            style={{width: `${percentage}%`}}
          ></div>
        </div>

        {/* Message */}
        <p className="text-gray-600 text-sm font-medium">
          {message}
        </p>

        {/* Floating dots around main loader */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gray-400 rounded-full animate-ping opacity-30"
              style={{
                left: `${45 + Math.cos(i * Math.PI / 2) * 40}%`,
                top: `${45 + Math.sin(i * Math.PI / 2) * 40}%`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: '2s'
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loading;