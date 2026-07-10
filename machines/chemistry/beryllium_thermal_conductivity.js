import * as THREE from 'three';

export function createBerylliumThermalConductivity() {
  const group = new THREE.Group();
  
  // Show heat rapidly propagating across a lattice of atoms
  // Be has high thermal conductivity (216 W/mK)
  
  const atoms = [];
  const spacing = 1.0;
  const matCold = new THREE.MeshStandardMaterial({color: 0x0055ff, metalness: 0.8});
  const matHot = new THREE.MeshStandardMaterial({color: 0xff2200, metalness: 0.8});
  
  for(let x=0; x<6; x++) {
      for(let y=0; y<3; y++) {
          const atom = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), matCold.clone());
          atom.position.set(x*spacing - 2.5, y*spacing - 1, 0);
          group.add(atom);
          atoms.push({mesh: atom, gridX: x, temp: 0});
      }
  }

  // Heat laser on the left side
  const laser = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.2, 4),
      new THREE.MeshBasicMaterial({color: 0xff0000, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending})
  );
  laser.rotation.z = Math.PI/2;
  laser.position.set(-4.5, -0.5, 0);
  group.add(laser);

  group.add(new THREE.AmbientLight(0xffffff, 0.6));
  group.add(new THREE.DirectionalLight(0xffffff, 1).translateY(5));

  group.userData.animate = function(delta, time) {
      const loop = time % 4; // 4s cycle
      
      if(loop < 0.2) {
          // Reset
          atoms.forEach(a => a.temp = 0);
      }
      
      const wavePos = loop * 6 - 1; // heat wave travels left to right
      
      atoms.forEach(a => {
          if (a.gridX < wavePos) {
              a.temp += delta * 5; // heat up
          } else {
              a.temp -= delta * 1; // cool down slightly
          }
          
          a.temp = THREE.MathUtils.clamp(a.temp, 0, 1);
          
          a.mesh.material.color.setHex(0x0055ff).lerp(new THREE.Color(0xffaa00), a.temp);
          // High temp atoms vibrate
          a.mesh.position.z = Math.sin(time*40 + a.gridX)*0.1 * a.temp;
      });
      
      // Laser pulses
      laser.scale.set(1 + Math.sin(time*20)*0.2, 1, 1 + Math.sin(time*20)*0.2);
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
