import * as THREE from 'three';
export function createBoronNeutrons() {
  const group = new THREE.Group();
  
  // 6 Neutrons (The Glue) - Ultra High Quality
  
  const neutronMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff, metalness: 1.0, roughness: 0.3, clearcoat: 1.0
  });
  
  const neutrons = [];
  for(let i=0; i<6; i++) {
      const n = new THREE.Mesh(new THREE.SphereGeometry(0.6, 64, 64), neutronMat);
      
      const angle = i * Math.PI*2/6;
      n.position.set(Math.cos(angle)*1.5, Math.sin(angle)*1.5, (Math.random()-0.5)*0.5);
      
      group.add(n);
      neutrons.push({mesh: n, phase: Math.random()*Math.PI*2});
  }
  
  // The "Glue" - A procedural volumetric cloud binding them
  const glueGrp = new THREE.Group();
  group.add(glueGrp);
  
  // Instead of static meshes, we use a dense particle system to simulate the nuclear fluid (pions/gluons)
  const gGeo = new THREE.BufferGeometry();
  const numParticles = 1000;
  const gPos = new Float32Array(numParticles * 3);
  const gVel = [];
  for(let i=0; i<numParticles; i++) {
      gPos[i*3] = (Math.random()-0.5)*3;
      gPos[i*3+1] = (Math.random()-0.5)*3;
      gPos[i*3+2] = (Math.random()-0.5)*3;
      gVel.push(new THREE.Vector3((Math.random()-0.5)*0.1, (Math.random()-0.5)*0.1, (Math.random()-0.5)*0.1));
  }
  gGeo.setAttribute('position', new THREE.BufferAttribute(gPos, 3));
  const gMat = new THREE.PointsMaterial({color: 0x00ffff, size: 0.1, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending});
  const glueParticles = new THREE.Points(gGeo, gMat);
  glueGrp.add(glueParticles);
  
  const pLight = new THREE.PointLight(0x00ffff, 4, 15);
  group.add(pLight);

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.2;
      group.rotation.x = Math.sin(time*speed*0.1)*0.2;
      
      // Jiggle neutrons
      neutrons.forEach(n => {
          n.mesh.scale.setScalar(1 + Math.sin(time*speed*8 + n.phase)*0.03);
      });
      
      // Swarm the glue particles around the neutrons
      const posAttr = glueParticles.geometry.attributes.position.array;
      for(let i=0; i<numParticles; i++) {
          const pt = new THREE.Vector3(posAttr[i*3], posAttr[i*3+1], posAttr[i*3+2]);
          const vel = gVel[i];
          
          // Attraction to the center
          const pull = new THREE.Vector3(0,0,0).sub(pt).multiplyScalar(0.005);
          vel.add(pull);
          
          // Random walk (quantum fluctuation)
          vel.x += (Math.random()-0.5)*0.05;
          vel.y += (Math.random()-0.5)*0.05;
          vel.z += (Math.random()-0.5)*0.05;
          
          vel.multiplyScalar(0.9); // friction
          pt.add(vel);
          
          posAttr[i*3] = pt.x;
          posAttr[i*3+1] = pt.y;
          posAttr[i*3+2] = pt.z;
      }
      glueParticles.geometry.attributes.position.needsUpdate = true;
      
      pLight.intensity = 4 + Math.sin(time*speed*10)*1;
  };

  return {
    group: group,
    description: "The 6 Neutrons (The Glue - Remastered). Boron-11 requires 6 neutrons to remain perfectly stable. This upgraded model visualizes the 'Strong Nuclear Force' as a dynamic, flowing quantum fluid (the cyan particle swarm). Neutrons have no electrical charge (they are neutral), so they don't repel anything. Instead, they act as massive anchors, continuously exchanging mesons (the glowing particles) with protons and other neutrons to generate a force so overwhelmingly powerful that it easily crushes the electrical repulsion of the protons.",
    parts: [
      { name: "Silver Spheres", material: "Neutrons", function: "Heavy, neutral particles adding mass and stability." },
      { name: "Cyan Particle Swarm", material: "Strong Nuclear Force", function: "The strongest force in the universe, holding the nucleus together." }
    ],
    quizQuestions: [
      { question: "Why is the Strong Nuclear Force represented as a swarming cloud between the particles?", options: ["Because it is made of water", "Because the Strong Force is transmitted by constantly tossing virtual particles (like pions and gluons) back and forth", "Because it is an illusion", "Because it represents gravity"], correct: 1, explanation: "In quantum mechanics, forces are carried by particles! The strong force holding the nucleus together is literally the continuous, rapid-fire exchange of particles (gluons/mesons) between the nucleons." }
    ]
  };
}