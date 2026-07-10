import * as THREE from 'three';

export function createBerylliumAllotropes() {
  const group = new THREE.Group();
  
  // Visualizing the phase transition from Alpha (HCP) to Beta (BCC) at 1250°C
  
  const atomGeo = new THREE.SphereGeometry(0.3, 16, 16);
  
  const alphaMat = new THREE.MeshStandardMaterial({color: 0x88aaff, metalness: 0.8}); // Blueish
  const betaMat = new THREE.MeshStandardMaterial({color: 0xffaa00, metalness: 0.8});  // Orange/Hot
  
  const alphaGroup = new THREE.Group();
  const betaGroup = new THREE.Group();
  alphaGroup.position.x = -2.5;
  betaGroup.position.x = 2.5;
  group.add(alphaGroup); group.add(betaGroup);
  
  // Build Alpha (HCP simplified)
  const a = 1.0; const c = 1.6;
  alphaGroup.add(new THREE.Mesh(atomGeo, alphaMat).translateY(-c/2));
  alphaGroup.add(new THREE.Mesh(atomGeo, alphaMat).translateY(c/2));
  for(let i=0; i<6; i++) {
      const angle = (Math.PI/3)*i;
      alphaGroup.add(new THREE.Mesh(atomGeo, alphaMat).translateX(Math.cos(angle)*a).translateZ(Math.sin(angle)*a).translateY(-c/2));
      alphaGroup.add(new THREE.Mesh(atomGeo, alphaMat).translateX(Math.cos(angle)*a).translateZ(Math.sin(angle)*a).translateY(c/2));
  }
  
  // Build Beta (BCC)
  const b = 1.5;
  betaGroup.add(new THREE.Mesh(atomGeo, betaMat)); // Center
  for(let x=-1; x<=1; x+=2) {
      for(let y=-1; y<=1; y+=2) {
          for(let z=-1; z<=1; z+=2) {
              const m = new THREE.Mesh(atomGeo, betaMat);
              m.position.set(x*b/2, y*b/2, z*b/2);
              betaGroup.add(m);
          }
      }
  }

  // Thermometer Graphic in middle
  const tempGroup = new THREE.Group();
  const tBg = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 4), new THREE.MeshBasicMaterial({color: 0x333333, transparent: true, opacity: 0.5}));
  tempGroup.add(tBg);
  const tFill = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
  tFill.position.y = -1.5;
  tempGroup.add(tFill);
  group.add(tempGroup);

  group.add(new THREE.AmbientLight(0xffffff, 0.6));
  const light = new THREE.DirectionalLight(0xffffff, 1.5);
  light.position.set(0, 5, 5);
  group.add(light);

  group.userData.animate = function(delta, time) {
      alphaGroup.rotation.y += delta * 0.5;
      betaGroup.rotation.y += delta * 0.5;
      
      const t = time % 6; // 6s cycle
      
      // Simulate heating up from 0 to 1400 C
      let temp = 0;
      if (t < 3) {
          temp = t / 3 * 1400; // heat up
      } else {
          temp = (6 - t) / 3 * 1400; // cool down
      }
      
      // Update thermometer visually
      const fillHeight = (temp / 1400) * 3.8 + 0.2;
      tFill.scale.y = fillHeight;
      tFill.position.y = -2 + fillHeight/2;
      
      // Transition logic
      if (temp < 1250) {
          // Alpha phase
          alphaGroup.visible = true;
          betaGroup.visible = false;
          tFill.material.color.setHex(0x00aaff); // cool blue
      } else {
          // Beta phase (> 1250 C)
          alphaGroup.visible = false;
          betaGroup.visible = true;
          tFill.material.color.setHex(0xffaa00); // hot orange
          
          // Thermal jiggle
          betaGroup.position.y = Math.sin(time*50)*0.05;
      }
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
