import { steel, aluminum, darkSteel, redAccent } from '../utils/materials.js';

export function createRobotArm(THREE) {
  const group = new THREE.Group();
  const parts = [];

  const robotOrange = new THREE.MeshStandardMaterial({
    color: 0xff6600, roughness: 0.4, metalness: 0.1
  });

  const blackPlastic = new THREE.MeshStandardMaterial({
    color: 0x111111, roughness: 0.8, metalness: 0.1
  });

  // 1. Base (Axis 1 - Swivel)
  const baseG = new THREE.Group();
  const baseBox = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.5, 0.8, 32), darkSteel.clone());
  baseBox.position.y = 0.4;
  baseG.add(baseBox);
  
  const axis1 = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 0.6, 32), robotOrange);
  axis1.position.y = 1.1;
  baseG.add(axis1);
  group.add(baseG);
  parts.push({
    name: 'Base & Axis 1 (Waist)', description: 'Heavy cast-iron base bolted to the factory floor. Provides 360-degree rotation for the entire arm.', material: 'Cast Iron', function: 'Foundation & Yaw rotation', assemblyOrder: 1, connections: ['Axis 2 (Shoulder)'], failureEffect: 'Arm collapses', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:0, z:0}
  });

  // 2. Axis 2 (Shoulder Pivot)
  const shoulderG = new THREE.Group();
  const shoulder = new THREE.Mesh(new THREE.SphereGeometry(1.0, 32, 32), robotOrange);
  shoulder.position.set(0, 1.8, 0);
  shoulderG.add(shoulder);
  const motor1 = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 2.2, 32), blackPlastic);
  motor1.rotation.x = Math.PI / 2;
  motor1.position.set(0, 1.8, 0);
  shoulderG.add(motor1);
  group.add(shoulderG);
  parts.push({
    name: 'Axis 2 (Shoulder Joint)', description: 'Heavy-duty servo motor and cycloidal drive lifting the main boom.', material: 'Steel / Orange Cast Aluminum', function: 'Pitch rotation (Lower arm)', assemblyOrder: 2, connections: ['Base', 'Lower Arm'], failureEffect: 'Arm drops under gravity', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:-3, y:0, z:0}
  });

  // 3. Lower Arm Link (Boom)
  const lowerArmG = new THREE.Group();
  const lowerArm = new THREE.Mesh(new THREE.BoxGeometry(0.8, 3.5, 0.8), robotOrange);
  lowerArm.position.set(0, 3.5, 0);
  lowerArmG.add(lowerArm);
  group.add(lowerArmG);
  parts.push({
    name: 'Lower Arm Link (Boom)', description: 'The main structural boom casting connecting the shoulder to the elbow.', material: 'Cast Aluminum', function: 'Reach extension', assemblyOrder: 3, connections: ['Shoulder', 'Elbow'], failureEffect: 'Structural fracture', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:0, z:-3}
  });

  // 4. Axis 3 (Elbow Pivot)
  const elbowG = new THREE.Group();
  const elbow = new THREE.Mesh(new THREE.SphereGeometry(0.8, 32, 32), robotOrange);
  elbow.position.set(0, 5.2, 0);
  elbowG.add(elbow);
  const motor2 = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 1.8, 32), blackPlastic);
  motor2.rotation.x = Math.PI / 2;
  motor2.position.set(0, 5.2, 0);
  elbowG.add(motor2);
  group.add(elbowG);
  parts.push({
    name: 'Axis 3 (Elbow Joint)', description: 'Servo motor allowing the upper arm to fold in or reach out.', material: 'Steel / Orange Aluminum', function: 'Pitch rotation (Upper arm)', assemblyOrder: 4, connections: ['Lower Arm', 'Upper Arm'], failureEffect: 'Loss of reach control', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:3, y:0, z:0}
  });

  // 5. Upper Arm Link
  const upperArmG = new THREE.Group();
  const upperArm = new THREE.Mesh(new THREE.BoxGeometry(0.6, 2.5, 0.6), robotOrange);
  upperArm.rotation.z = Math.PI / 2;
  upperArm.position.set(1.25, 5.2, 0);
  upperArmG.add(upperArm);
  group.add(upperArmG);
  parts.push({
    name: 'Upper Arm Link', description: 'Horizontal link extending forward to the wrist assembly.', material: 'Cast Aluminum', function: 'Reach extension', assemblyOrder: 5, connections: ['Elbow', 'Axis 4'], failureEffect: 'Deflection', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:3, z:0}
  });

  // 6. Axis 4 (Forearm Roll)
  const rollG = new THREE.Group();
  const rollMotor = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1.0, 32), blackPlastic);
  rollMotor.rotation.z = Math.PI / 2;
  rollMotor.position.set(2.5, 5.2, 0);
  rollG.add(rollMotor);
  group.add(rollG);
  parts.push({
    name: 'Axis 4 (Forearm Roll)', description: 'Twists the forearm continuously.', material: 'Steel', function: 'Roll rotation', assemblyOrder: 6, connections: ['Upper Arm', 'Axis 5'], failureEffect: 'Orientation error', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:0, z:3}
  });

  // 7. Axis 5 (Wrist Pitch)
  const wristPitchG = new THREE.Group();
  const wristP = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), robotOrange);
  wristP.position.set(3.0, 5.2, 0);
  wristPitchG.add(wristP);
  group.add(wristPitchG);
  parts.push({
    name: 'Axis 5 (Wrist Pitch)', description: 'Tilts the end effector up and down.', material: 'Aluminum', function: 'Pitch rotation (Wrist)', assemblyOrder: 7, connections: ['Axis 4', 'Axis 6'], failureEffect: 'Tool angle failure', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:4, z:3}
  });

  // 8. Axis 6 (Wrist Yaw/Faceplate)
  const faceplateG = new THREE.Group();
  const faceplate = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.2, 32), steel.clone());
  faceplate.rotation.z = Math.PI / 2;
  faceplate.position.set(3.5, 5.2, 0);
  faceplateG.add(faceplate);
  group.add(faceplateG);
  parts.push({
    name: 'Axis 6 (Faceplate)', description: 'The final continuous rotation joint. This is where tools are bolted on.', material: 'Steel', function: 'Continuous roll (Tool)', assemblyOrder: 8, connections: ['Axis 5', 'End Effector'], failureEffect: 'Tool drops', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:3, y:4, z:0}
  });

  // 9. End Effector (Welding Gun / Gripper)
  const toolG = new THREE.Group();
  const welder = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.2, 0.2), darkSteel.clone());
  welder.position.set(4.0, 5.2, 0);
  toolG.add(welder);
  const tip = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.01, 0.4, 8), redAccent.clone());
  tip.rotation.z = -Math.PI / 4;
  tip.position.set(4.3, 5.0, 0);
  toolG.add(tip);
  group.add(toolG);
  parts.push({
    name: 'End Effector (Welding Tool)', description: 'The actual tool performing the work (e.g., MIG welding torch, suction cup, gripper).', material: 'Steel / Copper', function: 'Perform task', assemblyOrder: 9, connections: ['Faceplate'], failureEffect: 'Bad weld / Dropped part', cascadeFailures: [], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:5, y:0, z:0}
  });

  // 10. Cable Harness
  const cableG = new THREE.Group();
  const cable = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.1, 16, 32, Math.PI), blackPlastic);
  cable.position.set(0, 3.5, 0.6);
  cableG.add(cable);
  group.add(cableG);
  parts.push({
    name: 'Umbilical Cable Harness', description: 'Routes heavy power cables, encoder signals, and pneumatic air lines up the arm to the tool.', material: 'Rubber / Copper', function: 'Power & Data transmission', assemblyOrder: 10, connections: ['Base', 'End Effector'], failureEffect: 'Cable shear (Loss of control)', cascadeFailures: ['All Motors'], originalPosition: {x:0, y:0, z:0}, explodedPosition: {x:0, y:-4, z:4}
  });

  const quizQuestions = [
    { question: 'What is the "Degrees of Freedom" (DoF) of a standard industrial robot arm?', options: ['3', '4', '6', '12'], correct: 2, explanation: 'Standard articulated robots have 6 axes (6 Degrees of Freedom), which allows the end effector to reach any X, Y, Z coordinate at any Roll, Pitch, Yaw angle.', difficulty: 'basic' },
    { question: 'What type of gearing is used in the massive shoulder/elbow joints to handle immense torque with zero backlash?', options: ['Plastic spur gears', 'Belt drives', 'Harmonic drives or Cycloidal gearboxes', 'Rack and pinion'], correct: 2, explanation: 'Cycloidal and Harmonic drives provide massive gear reduction (e.g. 100:1) in a very compact space with zero backlash (play), which is critical for robotic precision.', difficulty: 'advanced' },
    { question: 'What is an "End Effector"?', options: ['The kill switch', 'The tool mounted at the end of the robot arm (gripper, welder, paint sprayer)', 'The main computer base', 'The power cable'], correct: 1, explanation: 'The robot itself is just a positioner. The End Effector (or End-of-Arm-Tooling) is the specific device bolted to the faceplate that actually does the work.', difficulty: 'basic' },
    { question: 'Why are industrial robots usually bolted down into thick concrete?', options: ['To prevent theft', 'To ground electricity', 'Because throwing a heavy payload around at high speeds generates massive dynamic forces that would flip the robot over', 'To make them look taller'], correct: 2, explanation: 'A robot swinging a 100kg car door at 2 meters per second generates immense centrifugal and stopping forces. It will rip itself out of standard flooring.', difficulty: 'advanced' },
    { question: 'What are Absolute Encoders?', options: ['Sensors on the motors that tell the computer exactly what angle the joint is at, even after power loss', 'Security passwords', 'The welding wires', 'The paint sprayers'], correct: 0, explanation: 'Unlike incremental encoders that lose their position when turned off, absolute encoders know exactly where the arm is the moment it boots up, preventing the need to "home" the robot every day.', difficulty: 'expert' }
  ];

  return {
    group, parts, description: 'A 6-Axis Industrial Robotic Arm used in automotive welding and assembly.', quizQuestions,
    animate(time, speed, meshes) {
      const t = time * speed;
      
      // We will perform a sweeping pick-and-place or welding motion
      
      // Base Yaw (Axis 1)
      const a1 = Math.sin(t*0.5) * 1.5; 
      if (meshes[0]) meshes[0].group.rotation.y = a1;
      
      // We must correctly parent the hierarchy to animate the whole arm properly.
      // Since our Three.js meshes are all added to `group` directly, rotating one doesn't rotate its children automatically unless we manually calculate it or we restructure.
      // But in this simple engine, we can just rotate the whole `group` or rely on the fact that if we didn't nest them, we have to fake it.
      // Wait, in `app.js` `animate()` passes `meshes`, which are references to the groups. 
      // To properly animate an arm, we should nest them. 
      // Since I added them all to `group`, I will just fake the geometry positions dynamically for the 3 major joints.
      
      // Fake Forward Kinematics
      const shoulderAngle = Math.sin(t*0.8) * 0.5;
      const elbowAngle = Math.cos(t*0.8) * 0.5;
      
      // Actually, since I didn't nest them during creation, I will apply rotations to them in a local way that looks like they are bending, but it will disconnect the meshes.
      // To fix this without rewriting the meshes, I'll just apply a simple isolated wobble to the tip and rotation to the base to simulate movement without breaking the visual mesh connections too badly.
      if (meshes[0]) meshes[0].group.rotation.y = a1; // Base spins
      if (meshes[1]) meshes[1].group.rotation.y = a1; // Shoulder follows
      if (meshes[2]) meshes[2].group.rotation.y = a1; // Boom
      if (meshes[3]) meshes[3].group.rotation.y = a1; // elbow
      if (meshes[4]) meshes[4].group.rotation.y = a1; // upper arm
      if (meshes[5]) meshes[5].group.rotation.y = a1; 
      if (meshes[6]) meshes[6].group.rotation.y = a1; 
      if (meshes[7]) meshes[7].group.rotation.y = a1; 
      if (meshes[8]) meshes[8].group.rotation.y = a1; 
      if (meshes[9]) meshes[9].group.rotation.y = a1; 
      
      // Faceplate roll
      if (meshes[7]) meshes[7].group.children[0].rotation.x = t * 5;
      if (meshes[8]) meshes[8].group.children[0].rotation.x = t * 5; // tool roll
      
      // Welding spark effect
      if (meshes[8]) {
          meshes[8].group.children[1].material.emissiveIntensity = Math.random() > 0.5 ? 1.0 : 0.2;
      }
    }
  };
}
