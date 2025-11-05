import React from 'react';
import { use3DTilt } from '../../../hooks/use3dEffects';

const FloatingCard = ({ title, value, description, color, delay = 0 }) => {
  const [rotation, cardRef] = use3DTilt(5);

  return (
    <div 
      ref={cardRef}
      className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 glass-3d-hover transform-3d float-slow"
      style={{
        transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        transition: 'transform 0.3s ease',
        animationDelay: `${delay}s`
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <div className={`w-3 h-3 rounded-full ${color}`}></div>
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-2">{value}</div>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
};

const FloatingCards = () => {
  const cards = [
    {
      title: "Employee Satisfaction",
      value: "85%",
      description: "Overall satisfaction score",
      color: "bg-green-500",
      delay: 0
    },
    {
      title: "Retention Rate", 
      value: "92%",
      description: "Current retention percentage",
      color: "bg-blue-500",
      delay: 0.2
    },
    {
      title: "Growth Potential",
      value: "78%",
      description: "Identified growth opportunities", 
      color: "bg-purple-500",
      delay: 0.4
    },
    {
      title: "Risk Assessment",
      value: "12%",
      description: "High-risk employees identified",
      color: "bg-red-500", 
      delay: 0.6
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <FloatingCard key={index} {...card} />
      ))}
    </div>
  );
};

export default FloatingCards;