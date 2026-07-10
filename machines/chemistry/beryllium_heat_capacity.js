import * as THREE from 'three';

export function createBerylliumHeatCapacity() {
  const group = new THREE.Group();
  
  // Visualize Be's massive heat capacity (1825 J/kgK) by showing it soaking up thermal energy
  // A cube of Beryllium absorbing red "heat particles" and storing them as vibrational energy
  
  const cube = new THREE.Mesh(
      new THREE.BoxGeometry(3, 3, 3),
      new THREE.MeshPhysicalMaterial({color: 0x88aaff, transparent: true, opacity: 0.6, metalness: 0.5})
  );
  group.add(cube);
  
  // Flame/Heat source at bottom
  const heatSource = new THREE.Mesh(
      new THREE.ConeGeometry(1, 2, 16),
      new THREE.MeshBasicMaterial({color: 0xff5500, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending})
  );
  heatSource.position.y = -3;
  group.add(heatSource);
  
  // Heat particles (energy being absorbed)
  const particles = [];
  for(let i=0; i<30; i++) {
      const p = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), new THREE.MeshBasicMaterial({color: 0xff0000}));
      group.add(p);
      particles.push({
          mesh: p, 
          x: (Math.random()-0.5)*2.5, 
          y: -2.5 + Math.random()*5, 
          z: (Math.random()-0.5)*2.5
      });
  }

  // Internal vibrational lattice to show stored energy
  const innerVibe = new THREE.Mesh(
      new THREE.BoxGeometry(2.5, 2.5, 2.5),
      new THREE.MeshBasicMaterial({color: 0xff5500, wireframe: true, transparent: true, opacity: 0})
  );
  cube.add(innerVibe);

  group.add(new THREE.AmbientLight(0xffffff, 0.8));

  group.userData.animate = function(delta, time) {
      group.rotation.y += delta * 0.2;
      group.rotation.x = Math.sin(time*0.5)*0.1;
      
      const t = time % 5; // 5s loop
      const heatLevel = t / 5; // 0 to 1
      
      // Flame flickers
      heatSource.scale.set(1 + Math.sin(time*20)*0.1, 1 + Math.random()*0.2, 1 + Math.cos(time*15)*0.1);
      
      // Particles flow up from flame into block
      particles.forEach(p => {
          p.y += delta * 3;
          if (p.y > 1.5) {
              p.y = -2.5; // recycle
          }
          p.mesh.position.set(p.x, p.y, p.z);
          // Fade out as they get absorbed
          p.mesh.material.transparent = true;
          p.mesh.material.opacity = Math.max(0, 1 - (p.y + 1.5)/3);
      });
      
      // Block changes color and wireframe vibrates to show stored energy
      cube.material.color.setHex(0x88aaff).lerp(new THREE.Color(0xffaa55), heatLevel);
      
      innerVibe.material.opacity = heatLevel;
      innerVibe.scale.setScalar(1 + Math.sin(time*50)*0.02*heatLevel); // violent shaking as it gets hotter
  };


  group.userData.info = {
    "Name": "Beryllium",
    "Symbol": "Be",
    "Atomic Number": "4",
    "Crystal Structure": "Beryllium crystallizes in a Hexagonal Close-Packed (HCP) structure at room temperature. It has an unusually low c/a ratio, making it highly anisotropic.",
    "Allotropes": "Alpha-Beryllium (HCP) is stable up to 1250°C. Above this, it transitions to Beta-Beryllium, which has a Body-Centered Cubic (BCC) structure before melting at 1287°C.",
    "Heat Capacity": "Beryllium has the highest specific heat capacity of any metal (1825 J/(kg·K)), making it an excellent heat sink for aerospace applications.",
    "Thermal Conductivity": "It is an excellent conductor of heat (216 W/(m·K)), rivaling aluminum, despite being much lighter and stronger.",
    "Young's Modulus": "Beryllium is incredibly stiff! Its Young's modulus is 287 GPa, which is 50% higher than steel but at one-quarter of the weight."
  };

  return group;
}
