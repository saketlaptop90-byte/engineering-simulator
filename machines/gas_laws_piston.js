export function createGasLawsPiston(THREE) {
  const group = new THREE.Group();

  // A cylinder with a movable piston to demonstrate Boyle's, Charles', and Gay-Lussac's laws.

  const glassMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.9, opacity: 1, transparent: true, roughness: 0.1 });
  const metalMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8, roughness: 0.3 });

  // 1. The Cylinder
  const cylGeo = new THREE.CylinderGeometry(2, 2, 6, 32);
  const cylinder = new THREE.Mesh(cylGeo, glassMat);
  group.add(cylinder);

  // 2. The Piston
  const pistonGroup = new THREE.Group();
  group.add(pistonGroup);
  
  const pistonHead = new THREE.Mesh(new THREE.CylinderGeometry(1.95, 1.95, 0.4, 32), new THREE.MeshStandardMaterial({ color: 0x333333 }));
  pistonGroup.add(pistonHead);
  
  const pistonRod = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 5), metalMat);
  pistonRod.position.y = 2.5;
  pistonGroup.add(pistonRod);
  
  const pistonHandle = new THREE.Mesh(new THREE.BoxGeometry(2, 0.5, 0.5), metalMat);
  pistonHandle.position.y = 5;
  pistonGroup.add(pistonHandle);

  pistonGroup.userData = { id: 'piston', name: 'Movable Piston', description: 'Push down to decrease Volume (V) and increase Pressure (P). This demonstrates Boyle\'s Law (P1V1 = P2V2).' };

  // 3. Gas Particles
  const gasGroup = new THREE.Group();
  group.add(gasGroup);
  
  const pGeo = new THREE.SphereGeometry(0.15);
  const pMat = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
  const particles = [];
  
  const numParticles = 100;
  for(let i=0; i<numParticles; i++) {
    const p = new THREE.Mesh(pGeo, pMat);
    // Random positions inside cylinder (below piston)
    p.position.set((Math.random()-0.5)*3, -2 + Math.random()*2, (Math.random()-0.5)*3);
    gasGroup.add(p);
    // Give random velocity vectors
    const vx = (Math.random()-0.5);
    const vy = (Math.random()-0.5);
    const vz = (Math.random()-0.5);
    particles.push({ mesh: p, vel: new THREE.Vector3(vx, vy, vz).normalize() });
  }

  // 4. Heater (Bunsen Burner beneath)
  const burner = new THREE.Group();
  burner.position.set(0, -4, 0);
  group.add(burner);
  
  const bBase = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.2), metalMat);
  burner.add(bBase);
  const bTube = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 1.5), metalMat);
  bTube.position.y = 0.8;
  burner.add(bTube);
  
  const flame = new THREE.Mesh(new THREE.ConeGeometry(0.5, 1.5), new THREE.MeshBasicMaterial({ color: 0x0088ff, transparent: true, opacity: 0.8 }));
  flame.position.y = 2;
  burner.add(flame);
  burner.userData = { id: 'heater', name: 'Heat Source (Temperature)', description: 'Increasing Temperature (T) increases the kinetic energy of the particles. If the piston is locked, Pressure increases (Gay-Lussac). If free, Volume increases (Charles\' Law).' };

  // State variables
  let volume = 1.0; // 0.5 to 1.0 (multiplier for height)
  let temperature = 1.0; // 0.5 to 2.0 (multiplier for particle speed)

  group.userData.animate = function(delta) {
    const t = Date.now() * 0.001;
    
    // Simulate user experimenting: 
    // Periodically compress the piston, then heat it up
    const cycle = t % 10;
    
    if (cycle < 3) {
      // Compress (Boyle's Law)
      volume = 1.0 - (cycle / 3) * 0.6; // drops to 0.4
      temperature = 1.0;
      flame.scale.set(0,0,0);
    } else if (cycle < 5) {
      // Hold compressed
      volume = 0.4;
    } else if (cycle < 8) {
      // Heat up and expand (Charles' Law)
      flame.scale.set(1 + Math.random()*0.2, 1 + Math.random()*0.5, 1);
      temperature = 1.0 + ((cycle-5) / 3) * 1.0; // goes to 2.0
      volume = 0.4 + ((cycle-5) / 3) * 0.6; // expands back to 1.0
    } else {
      // Cool down
      flame.scale.set(0,0,0);
      temperature = 2.0 - ((cycle-8)/2)*1.0; // back to 1.0
      volume = 1.0;
    }

    // Update piston position based on volume
    // Cylinder is height 6 (-3 to 3). 
    // Volume 1.0 -> piston at y = 2
    // Volume 0.4 -> piston at y = -1.6
    const maxY = 2;
    const minY = -2.8;
    const pistonY = minY + volume * (maxY - minY);
    pistonGroup.position.y = pistonY;

    // Update particles
    const speed = 0.05 * temperature;
    
    particles.forEach(p => {
      p.mesh.position.addScaledVector(p.vel, speed);
      
      // Bounce off walls (radius 1.8 to keep inside)
      if (p.mesh.position.x*p.mesh.position.x + p.mesh.position.z*p.mesh.position.z > 1.8*1.8) {
        // Simple reflection toward center
        p.vel.x *= -1;
        p.vel.z *= -1;
        p.mesh.position.x = Math.max(-1.8, Math.min(1.8, p.mesh.position.x));
        p.mesh.position.z = Math.max(-1.8, Math.min(1.8, p.mesh.position.z));
      }
      
      // Bounce off floor (-2.8) and piston
      if (p.mesh.position.y < -2.8) {
        p.mesh.position.y = -2.8;
        p.vel.y *= -1;
      }
      if (p.mesh.position.y > pistonY - 0.2) {
        p.mesh.position.y = pistonY - 0.2;
        p.vel.y *= -1;
        
        // Color particles red if hitting fast (pressure visualization)
        if (temperature > 1.5 || volume < 0.6) {
          p.mesh.material.color.setHex(0xff0000);
        } else {
          p.mesh.material.color.setHex(0x00ff00);
        }
      }
    });

  };

  group.userData.quiz = [
    { question: "According to Boyle's Law, what happens to the Pressure of a gas if you decrease its Volume (squish it) at a constant temperature?", options: ["It decreases", "It stays the same", "It increases (Pressure and Volume are inversely proportional)"], answer: 2 },
    { question: "What actually IS gas pressure on a microscopic level?", options: ["The weight of the gas", "The force of billions of gas particles colliding with the walls of the container", "The magnetic repulsion of atoms"], answer: 1 }
  ];

  return group;
}
