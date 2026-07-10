import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
  const group = new THREE.Group();
  const parts = [];

  // Custom glowing materials for high-tech aesthetic
  const neonBlue = new THREE.MeshStandardMaterial({
    color: 0x00ffff,
    emissive: 0x00ffff,
    emissiveIntensity: 0.5,
    metalness: 0.8,
    roughness: 0.2
  });

  const neonRed = new THREE.MeshStandardMaterial({
    color: 0xff0000,
    emissive: 0xff0000,
    emissiveIntensity: 0.5,
    metalness: 0.5,
    roughness: 0.5
  });

  // 1. Lower Control Arm
  const controlArmGeo = new THREE.BoxGeometry(4, 0.5, 3);
  const controlArmMesh = new THREE.Mesh(controlArmGeo, darkSteel);
  controlArmMesh.position.set(2, -4, 0);
  group.add(controlArmMesh);
  
  parts.push({
    name: "Lower Control Arm",
    description: "Connects the steering knuckle to the chassis, allowing up and down movement.",
    material: "Dark Steel",
    function: "Suspension Linkage",
    assemblyOrder: 1,
    connections: ["Chassis", "Steering Knuckle"],
    failureEffect: "Loss of wheel control, excessive tire wear, clunking noises.",
    cascadeFailures: ["Steering Knuckle", "Strut"],
    originalPosition: { x: 2, y: -4, z: 0 },
    explodedPosition: { x: 5, y: -6, z: 2 },
    mesh: controlArmMesh
  });

  // 2. Steering Knuckle
  const knuckleGeo = new THREE.CylinderGeometry(0.8, 0.8, 2, 16);
  const knuckleMesh = new THREE.Mesh(knuckleGeo, steel);
  knuckleMesh.position.set(4, -3, 0);
  group.add(knuckleMesh);

  parts.push({
    name: "Steering Knuckle",
    description: "Pivot point of the steering system, connects suspension to wheel.",
    material: "Forged Steel",
    function: "Steering and Wheel Hub Mounting",
    assemblyOrder: 2,
    connections: ["Control Arm", "Strut Tube", "Wheel Hub"],
    failureEffect: "Inability to steer, wheel detachment.",
    cascadeFailures: ["Control Arm", "Brake Rotor"],
    originalPosition: { x: 4, y: -3, z: 0 },
    explodedPosition: { x: 8, y: -3, z: 0 },
    mesh: knuckleMesh
  });

  // 3. Strut Tube
  const strutTubeGeo = new THREE.CylinderGeometry(0.5, 0.5, 5, 32);
  const strutTubeMesh = new THREE.Mesh(strutTubeGeo, neonBlue);
  strutTubeMesh.position.set(4, 0, 0);
  strutTubeMesh.rotation.z = Math.PI / 12; // Slight tilt
  group.add(strutTubeMesh);

  parts.push({
    name: "Strut Tube",
    description: "Main body of the MacPherson strut, houses shock absorber fluid and valving.",
    material: "High-Tech Alloy / Neon",
    function: "Damping and Structural Support",
    assemblyOrder: 3,
    connections: ["Steering Knuckle", "Shock Piston", "Coil Spring"],
    failureEffect: "Poor ride quality, bouncy suspension, bottoming out.",
    cascadeFailures: ["Upper Mount", "Control Arm Bushings"],
    originalPosition: { x: 4, y: 0, z: 0 },
    explodedPosition: { x: 6, y: 2, z: -2 },
    mesh: strutTubeMesh
  });

  // 4. Shock Absorber Piston
  const pistonGeo = new THREE.CylinderGeometry(0.2, 0.2, 4, 16);
  const pistonMesh = new THREE.Mesh(pistonGeo, chrome);
  pistonMesh.position.set(3.5, 3, 0);
  pistonMesh.rotation.z = Math.PI / 12;
  group.add(pistonMesh);

  parts.push({
    name: "Shock Absorber Piston",
    description: "Moves through hydraulic fluid in the strut tube to damp spring oscillations.",
    material: "Chrome Plated Steel",
    function: "Vibration Damping",
    assemblyOrder: 4,
    connections: ["Strut Tube", "Upper Mount"],
    failureEffect: "Loss of damping, oil leak.",
    cascadeFailures: ["Tires"],
    originalPosition: { x: 3.5, y: 3, z: 0 },
    explodedPosition: { x: 5, y: 6, z: -2 },
    mesh: pistonMesh
  });

  // 5. Coil Spring
  class HelixCurve extends THREE.Curve {
    constructor(radius, height, coils) {
      super();
      this.radius = radius;
      this.height = height;
      this.coils = coils;
    }
    getPoint(t, optionalTarget = new THREE.Vector3()) {
      const angle = t * Math.PI * 2 * this.coils;
      const x = Math.cos(angle) * this.radius;
      const z = Math.sin(angle) * this.radius;
      const y = (t - 0.5) * this.height;
      return optionalTarget.set(x, y, z);
    }
  }
  const springPath = new HelixCurve(1.2, 5, 6);
  const springGeo = new THREE.TubeGeometry(springPath, 200, 0.15, 8, false);
  const springMesh = new THREE.Mesh(springGeo, neonRed);
  springMesh.position.set(3.7, 1.5, 0);
  springMesh.rotation.z = Math.PI / 12;
  group.add(springMesh);

  parts.push({
    name: "Coil Spring",
    description: "Supports vehicle weight and absorbs impact from road bumps.",
    material: "Spring Steel / Neon Red",
    function: "Energy Storage / Support",
    assemblyOrder: 5,
    connections: ["Strut Tube", "Upper Mount"],
    failureEffect: "Sagging ride height, harsh impacts.",
    cascadeFailures: ["Strut Tube", "Shock Piston"],
    originalPosition: { x: 3.7, y: 1.5, z: 0 },
    explodedPosition: { x: 2, y: 4, z: 3 },
    mesh: springMesh
  });

  // 6. Upper Mount
  const topMountGeo = new THREE.CylinderGeometry(1.5, 1.2, 0.5, 32);
  const topMountMesh = new THREE.Mesh(topMountGeo, rubber);
  topMountMesh.position.set(3.2, 4.5, 0);
  topMountMesh.rotation.z = Math.PI / 12;
  group.add(topMountMesh);

  parts.push({
    name: "Upper Mount",
    description: "Mounts the strut to the vehicle body, includes a bearing for steering rotation.",
    material: "Rubber & Steel",
    function: "Isolation and Pivot",
    assemblyOrder: 6,
    connections: ["Shock Piston", "Coil Spring", "Chassis"],
    failureEffect: "Clunking over bumps, stiff steering.",
    cascadeFailures: ["Shock Absorber"],
    originalPosition: { x: 3.2, y: 4.5, z: 0 },
    explodedPosition: { x: 1, y: 7, z: 0 },
    mesh: topMountMesh
  });

  // 7. Wheel Hub / Rotor
  const rotorGeo = new THREE.CylinderGeometry(2, 2, 0.4, 32);
  const rotorMesh = new THREE.Mesh(rotorGeo, steel);
  rotorMesh.position.set(4.5, -3, 0);
  rotorMesh.rotation.x = Math.PI / 2;
  group.add(rotorMesh);

  parts.push({
    name: "Brake Rotor",
    description: "Provides a mounting surface for the wheel and brake components.",
    material: "Cast Iron",
    function: "Wheel Rotation & Braking",
    assemblyOrder: 7,
    connections: ["Steering Knuckle", "Wheel"],
    failureEffect: "Vibrations during braking, wheel wobble.",
    cascadeFailures: ["Wheel Bearings"],
    originalPosition: { x: 4.5, y: -3, z: 0 },
    explodedPosition: { x: 8, y: -3, z: -4 },
    mesh: rotorMesh
  });

  const description = "The MacPherson strut is a type of automotive suspension system that uses the top of a telescopic damper as the upper steering pivot. It is widely used in the front suspension of modern vehicles due to its simplicity, compact size, and low manufacturing cost. Key components include the strut itself (which integrates the shock absorber), a coil spring, and a lower control arm. When driving over rough terrain, the spring compresses to absorb the shock, while the damper dissipates the stored energy to prevent oscillation.";

  const quizQuestions = [
    {
      question: "What is the primary function of the coil spring in a MacPherson strut?",
      options: [
        "To steer the vehicle",
        "To support the vehicle's weight and absorb road impacts",
        "To stop the vehicle",
        "To dampen spring oscillations"
      ],
      correct: 1,
      explanation: "The coil spring stores energy from road impacts and supports the weight of the vehicle. The shock absorber (damper) is responsible for dissipating that energy.",
      difficulty: "Easy"
    },
    {
      question: "Which component of the MacPherson strut also acts as the upper steering pivot?",
      options: [
        "Lower Control Arm",
        "Steering Knuckle",
        "Telescopic Damper (Strut)",
        "Anti-roll bar"
      ],
      correct: 2,
      explanation: "In a MacPherson strut design, the upper mount of the telescopic damper serves as the upper steering pivot, simplifying the suspension compared to a double wishbone setup.",
      difficulty: "Medium"
    },
    {
      question: "What happens if the shock absorber (damper) fails?",
      options: [
        "The vehicle will sit lower to the ground",
        "The wheel will fall off",
        "The steering will lock up",
        "The suspension will oscillate excessively (bounce) after hitting a bump"
      ],
      correct: 3,
      explanation: "The damper's job is to resist and dissipate the energy of the coil spring. Without it, the spring will continue to bounce multiple times after an impact.",
      difficulty: "Hard"
    }
  ];

  function animate(time, speed, meshes) {
    const t = time * speed * 2;
    // Simulate rough terrain
    const bump = Math.sin(t * 5) * 0.5 + Math.sin(t * 12) * 0.2;
    
    const controlArm = meshes.find(m => m.name === "Lower Control Arm").mesh;
    controlArm.rotation.z = bump * 0.1;
    
    const knuckle = meshes.find(m => m.name === "Steering Knuckle").mesh;
    knuckle.position.y = -3 + bump;
    
    const rotor = meshes.find(m => m.name === "Brake Rotor").mesh;
    rotor.position.y = -3 + bump;
    
    const strutTube = meshes.find(m => m.name === "Strut Tube").mesh;
    strutTube.position.y = bump * 0.8; 
    
    const spring = meshes.find(m => m.name === "Coil Spring").mesh;
    spring.position.y = 1.5 + bump * 0.4;
    spring.scale.y = 1 - (bump * 0.15); 
    
    // Dynamic glow effect for the spring compressing
    spring.material.emissiveIntensity = 0.5 + Math.abs(bump) * 1.5;
    
    const piston = meshes.find(m => m.name === "Shock Absorber Piston").mesh;
    piston.position.y = 3 + bump * 0.1; 
  }

  return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createMacPhersonStrutSuspension() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
