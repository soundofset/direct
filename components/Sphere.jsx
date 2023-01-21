import React from "react";

function Sphere({number, position, radius, color}) {
  return (
    <mesh position={position} recieveShadow={true} onClick={function () {
      console.log(number);
    }}>
      <sphereGeometry args={[radius, 64, 64]} />
      <meshPhysicalMaterial color={color} />
    </mesh>
  );
}

export default Sphere;

