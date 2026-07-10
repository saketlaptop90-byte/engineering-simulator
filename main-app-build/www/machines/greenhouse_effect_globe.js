export function createGreenhouseEffectGlobe(THREE) {
  const group = new THREE.Group();

  // 1. Earth
  const earthGeo = new THREE.SphereGeometry(3, 32, 32);
  const earthMat = new THREE.MeshStandardMaterial({ color: 0x1e90ff, roughness: 0.6 });
  const earth = new THREE.Mesh(earthGeo, earthMat);
  group.add(earth);
  earth.userData = { id: 'earth', name: 'Earth Surface', description: 'Absorbs shortwave solar radiation and re-emits it as longwave infrared heat.' };

  // Simple continents
  const landMat = new THREE.MeshStandardMaterial({ color: 0x228b22 });
  for(let i=0; i<5; i++) {
    const land = new THREE.Mesh(new THREE.SphereGeometry(1.5, 16, 16), landMat);
    land.position.set((Math.random()-0.5)*4, (Math.random()-0.5)*4, (Math.random()-0.5)*4);
    land.position.normalize().multiplyScalar(3);
    land.lookAt(0,0,0);
    land.scale.z = 0.1;
    earth.add(land);
  }

  // 2. The Atmosphere (Greenhouse gas layer)
  const atmosGeo = new THREE.SphereGeometry(4, 32, 32);
  const atmosMat = new THREE.MeshBasicMaterial({ color: 0xaaaaaa, transparent: true, opacity: 0.3, side: THREE.BackSide });
  const atmosphere = new THREE.Mesh(atmosGeo, atmosMat);
  group.add(atmosphere);
  atmosphere.userData = { id: 'greenhouse_gases', name: 'Greenhouse Gases (CO2, CH4, H2O)', description: 'Allow visible sunlight to pass through, but block and absorb exiting infrared heat.' };

  // 3. The Sun
  const sunGeo = new THREE.SphereGeometry(1, 16, 16);
  const sunMat = new THREE.MeshBasicMaterial({ color: 0xffdd00 });
  const sun = new THREE.Mesh(sunGeo, sunMat);
  sun.position.set(15, 0, 0);
  group.add(sun);
  
  const sunLight = new THREE.DirectionalLight(0xffffff, 2);
  sunLight.position.copy(sun.position);
  group.add(sunLight);
  sun.userData = { id: 'sun', name: 'The Sun', description: 'Emits shortwave radiation (visible and UV light).' };

  // 4. Solar Radiation (Shortwave - Yellow arrows coming IN)
  const rayGroup = new THREE.Group();
  group.add(rayGroup);
  const rayGeo = new THREE.CylinderGeometry(0.05, 0.05, 2);
  const rayMat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  
  const inRays = [];
  for(let i=0; i<10; i++) {
    const ray = new THREE.Mesh(rayGeo, rayMat);
    ray.position.set(10, (Math.random()-0.5)*4, (Math.random()-0.5)*4);
    ray.rotation.z = Math.PI/2;
    rayGroup.add(ray);
    inRays.push(ray);
  }

  // 5. Infrared Heat (Longwave - Red arrows going OUT)
  const heatGroup = new THREE.Group();
  group.add(heatGroup);
  const heatGeo = new THREE.CylinderGeometry(0.1, 0.1, 1);
  const heatMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  
  const outRays = [];
  for(let i=0; i<15; i++) {
    const ray = new THREE.Mesh(heatGeo, heatMat);
    // Start at earth surface
    const v = new THREE.Vector3((Math.random()-0.5), (Math.random()-0.5), (Math.random()-0.5)).normalize();
    ray.position.copy(v.clone().multiplyScalar(3));
    ray.lookAt(v.clone().multiplyScalar(4)); // point outward
    ray.rotation.x += Math.PI/2;
    
    // Custom data to track reflection
    ray.userData = { dir: v, phase: 'rising', speed: 0.05 };
    
    heatGroup.add(ray);
    outRays.push(ray);
  }

  group.userData.animate = function(delta) {
    earth.rotation.y += 0.002;
    
    // Incoming solar rays
    inRays.forEach(r => {
      r.position.x -= 0.1;
      if (r.position.x < 3) {
        // Hits earth, reset
        r.position.x = 10;
        r.position.y = (Math.random()-0.5)*4;
        r.position.z = (Math.random()-0.5)*4;
      }
    });

    // Outgoing infrared rays (The Greenhouse Effect)
    outRays.forEach(r => {
      if (r.userData.phase === 'rising') {
        r.position.addScaledVector(r.userData.dir, r.userData.speed);
        
        // Hits atmosphere
        if (r.position.length() >= 4) {
          // 80% chance to be reflected/absorbed and sent back down
          if (Math.random() < 0.8) {
            r.userData.phase = 'falling';
            r.userData.dir.multiplyScalar(-1); // Reverse direction
            r.lookAt(r.position.clone().add(r.userData.dir));
            r.rotation.x += Math.PI/2;
          } else {
            // Escapes into space
            r.userData.phase = 'escaping';
          }
        }
      } else if (r.userData.phase === 'falling') {
        r.position.addScaledVector(r.userData.dir, r.userData.speed);
        
        // Hits earth again
        if (r.position.length() <= 3.1) {
          r.userData.phase = 'rising';
          r.userData.dir.multiplyScalar(-1); // Bounce back up
          r.lookAt(r.position.clone().add(r.userData.dir));
          r.rotation.x += Math.PI/2;
        }
      } else if (r.userData.phase === 'escaping') {
        r.position.addScaledVector(r.userData.dir, r.userData.speed);
        if (r.position.length() > 10) {
          // Reset at surface
          r.userData.dir = new THREE.Vector3((Math.random()-0.5), (Math.random()-0.5), (Math.random()-0.5)).normalize();
          r.position.copy(r.userData.dir.clone().multiplyScalar(3));
          r.lookAt(r.position.clone().add(r.userData.dir));
          r.rotation.x += Math.PI/2;
          r.userData.phase = 'rising';
        }
      }
    });
    
    // Visual effect of heat trapping
    atmosphere.material.opacity = 0.2 + Math.sin(Date.now() * 0.002) * 0.1;
  };

  group.userData.quiz = [
    { question: "Why do greenhouse gases trap heat?", options: ["Because they are hot gases", "They are transparent to incoming visible light, but opaque to outgoing infrared radiation", "They act like a giant mirror"], answer: 1 },
    { question: "Is the Greenhouse Effect completely unnatural and bad?", options: ["Yes, it only started during the Industrial Revolution", "No, it is a natural process that keeps Earth from freezing; human activity is just enhancing it too rapidly", "Yes, it causes the ozone hole"], answer: 1 }
  ];

  return group;
}
