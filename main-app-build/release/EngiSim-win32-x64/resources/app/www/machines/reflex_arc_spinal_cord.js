export function createReflexArc(THREE) {
  const group = new THREE.Group();

  // 1. Skin (Receptor)
  const skinGroup = new THREE.Group();
  skinGroup.position.set(-4, 0, 0);
  group.add(skinGroup);
  
  const skinMat = new THREE.MeshStandardMaterial({ color: 0xffccaa, roughness: 0.9 });
  const skin = new THREE.Mesh(new THREE.BoxGeometry(1, 4, 4), skinMat);
  skinGroup.add(skin);
  skin.userData = { id: 'receptor', name: 'Pain Receptor (Nociceptor)', description: 'Detects a painful stimulus (like a flame or pin) and generates an action potential.' };

  // The stimulus (A flame)
  const flame = new THREE.Mesh(new THREE.ConeGeometry(0.3, 1), new THREE.MeshBasicMaterial({ color: 0xff4400 }));
  flame.position.set(-1, -1, 0);
  flame.rotation.z = -Math.PI/4;
  skinGroup.add(flame);

  // 2. Spinal Cord Cross Section (Center)
  const spineGroup = new THREE.Group();
  group.add(spineGroup);
  
  const spineGeo = new THREE.CylinderGeometry(2, 2, 1, 32);
  const spineMat = new THREE.MeshStandardMaterial({ color: 0xeeddcc });
  const spine = new THREE.Mesh(spineGeo, spineMat);
  spine.rotation.x = Math.PI/2;
  spineGroup.add(spine);
  
  // Grey Matter (Butterfly shape inside)
  const greyMat = new THREE.MeshStandardMaterial({ color: 0x887777 });
  const greyHorns = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.5, 1.1), greyMat);
  const greyWings = new THREE.Mesh(new THREE.BoxGeometry(0.5, 2.5, 1.1), greyMat);
  spineGroup.add(greyHorns, greyWings);
  greyWings.userData = { id: 'spinal_cord', name: 'Spinal Cord (Grey Matter)', description: 'The integration center. For reflexes, the signal bypasses the brain entirely and is processed right here in the spine for maximum speed.' };

  // 3. Muscle (Effector)
  const muscleGroup = new THREE.Group();
  muscleGroup.position.set(-4, -3, 0);
  group.add(muscleGroup);

  const muscleMat = new THREE.MeshStandardMaterial({ color: 0xcc2222 });
  const muscle = new THREE.Mesh(new THREE.CapsuleGeometry(0.8, 2, 8, 8), muscleMat);
  muscle.rotation.z = Math.PI/2;
  muscleGroup.add(muscle);
  muscle.userData = { id: 'effector', name: 'Effector Muscle', description: 'Receives the motor command and contracts instantly to pull your hand away from the flame.' };

  // 4. The Neurons (Wiring)
  const wireMat = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 });
  const neuronRadius = 0.15;

  // Sensory Neuron (Skin -> Spine dorsal root)
  const sensoryCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-3.5, 0, 0),
    new THREE.Vector3(-2, 1, 0),
    new THREE.Vector3(-0.5, 1, 0)
  ]);
  const sensoryWire = new THREE.Mesh(new THREE.TubeGeometry(sensoryCurve, 16, 0.05, 8, false), new THREE.MeshBasicMaterial({ color: 0x00aaff }));
  group.add(sensoryWire);
  
  // Cell body (Dorsal root ganglion)
  const drg = new THREE.Mesh(new THREE.SphereGeometry(0.3), new THREE.MeshBasicMaterial({ color: 0x00aaff }));
  drg.position.set(-2, 1, 0);
  group.add(drg);
  drg.userData = { id: 'sensory_neuron', name: 'Sensory Neuron (Afferent)', description: 'Carries the pain signal FROM the skin TO the spinal cord.' };

  // Interneuron (Inside Spine)
  const interCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.5, 1, 0),
    new THREE.Vector3(0.5, 0, 0),
    new THREE.Vector3(-0.5, -1, 0)
  ]);
  const interWire = new THREE.Mesh(new THREE.TubeGeometry(interCurve, 16, 0.05, 8, false), new THREE.MeshBasicMaterial({ color: 0xffff00 }));
  group.add(interWire);
  
  const interBody = new THREE.Mesh(new THREE.SphereGeometry(0.2), new THREE.MeshBasicMaterial({ color: 0xffff00 }));
  interBody.position.set(0.5, 0, 0);
  group.add(interBody);
  interBody.userData = { id: 'interneuron', name: 'Interneuron', description: 'A tiny bridge inside the spinal cord that immediately routes the sensory signal directly to a motor neuron.' };

  // Motor Neuron (Spine ventral root -> Muscle)
  const motorCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.5, -1, 0),
    new THREE.Vector3(-2, -2, 0),
    new THREE.Vector3(-3.5, -3, 0)
  ]);
  const motorWire = new THREE.Mesh(new THREE.TubeGeometry(motorCurve, 16, 0.05, 8, false), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
  group.add(motorWire);

  const motorBody = new THREE.Mesh(new THREE.SphereGeometry(0.25), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
  motorBody.position.set(-0.5, -1, 0);
  group.add(motorBody);
  motorBody.userData = { id: 'motor_neuron', name: 'Motor Neuron (Efferent)', description: 'Carries the action command FROM the spinal cord TO the muscle.' };

  // Action Potential Animation (Sparks traveling the arc)
  const sparkGeo = new THREE.SphereGeometry(0.15);
  const sparkMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const spark = new THREE.Mesh(sparkGeo, sparkMat);
  group.add(spark);

  let p = 0; // 0 to 3 for the 3 neurons

  group.userData.animate = function(delta) {
    const t = Date.now() * 0.005;

    // Flame flicker
    flame.scale.y = 1 + Math.sin(t*2)*0.2;
    flame.scale.x = 1 + Math.cos(t*3)*0.1;

    // Spark travels the arc
    p += 0.05;
    if (p > 3.5) {
      p = 0; // Reset
      muscle.scale.set(1, 1, 1); // Reset muscle
    }

    if (p < 1) {
      // Sensory
      sensoryCurve.getPointAt(p, spark.position);
      spark.material.color.setHex(0x00ffff);
    } else if (p < 2) {
      // Inter
      interCurve.getPointAt(p - 1, spark.position);
      spark.material.color.setHex(0xffff00);
    } else if (p < 3) {
      // Motor
      motorCurve.getPointAt(p - 2, spark.position);
      spark.material.color.setHex(0xff0000);
    } else {
      // Hit muscle!
      spark.position.set(-100,-100,-100); // hide
      muscle.scale.set(1.5, 0.8, 1.5); // Contract instantly
    }
  };

  group.userData.quiz = [
    { question: "Why are reflexes so much faster than normal voluntary movements?", options: ["Because sensory neurons are thicker", "Because the signal is processed in the spinal cord and skips the brain entirely", "Because you expect the pain"], answer: 1 },
    { question: "Which neuron carries the command back to the muscle?", options: ["The Afferent Sensory Neuron", "The Efferent Motor Neuron", "The Interneuron"], answer: 1 }
  ];

  return group;
}
