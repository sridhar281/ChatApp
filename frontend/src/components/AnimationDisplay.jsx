// src/components/AnimationDisplay.jsx
import Lottie from "lottie-react";
import chatAnimation from "../assets/chatAnimation.json"; 

const AnimationDisplay = () => {
  return (
     <div className="w-full h-full flex items-center justify-start from-primary to-secondary p-12">
  <Lottie
    animationData={chatAnimation}
    loop={true}
    className="w-[500px] max-w-full transform translate-y-[20px]"
  />
  
</div>

  );
};

export default AnimationDisplay;