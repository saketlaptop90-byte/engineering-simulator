import * as THREE from 'three';

export function createBerylliumYoungsModulus() {
  const group = new THREE.Group();
  
  // Visualize Be's incredible stiffness (287 GPa) vs Steel (200 GPa)
  // Two metal beams being bent by a heavy weight. The Be beam barely bends!
  
  // Steel Beam
  const steelGrp = new THREE.Group();
  steelGrp.position.z = -1.5;
  const sBeamGeo = new THREE.BoxGeometry(6, 0.3, 1);
  const sBeam = new THREE.Mesh(sBeamGeo, new THREE.MeshStandardMaterial({color: 0x555555, metalness: 0.9}));
  steelGrp.add(sBeam);
  const sLabel = new THREE.Mesh(new THREE.BoxGeometry(2, 0.5, 0.1), new THREE.MeshBasicMaterial({color: 0xffffff}));
  sLabel.position.set(-4, 0, 0);
  steelGrp.add(sLabel);
  group.add(steelGrp);
  
  // Beryllium Beam
  const beGrp = new THREE.Group();
  beGrp.position.z = 1.5;
  const beBeamGeo = new THREE.BoxGeometry(6, 0.3, 1);
  const beBeam = new THREE.Mesh(beBeamGeo, new THREE.MeshStandardMaterial({color: 0x88aaff, metalness: 0.9}));
  beGrp.add(beBeam);
  const beLabel = new THREE.Mesh(new THREE.BoxGeometry(2, 0.5, 0.1), new THREE.MeshBasicMaterial({color: 0xffffff}));
  beLabel.position.set(-4, 0, 0);
  beGrp.add(beLabel);
  group.add(beGrp);
  
  // The Weights (1 Ton anvils)
  const wGeo = new THREE.BoxGeometry(1, 1, 1);
  const wMat = new THREE.MeshStandardMaterial({color: 0x111111});
  const w1 = new THREE.Mesh(wGeo, wMat); w1.position.y = 0.65; steelGrp.add(w1);
  const w2 = new THREE.Mesh(wGeo, wMat); w2.position.y = 0.65; beGrp.add(w2);
  
  // Supports
  const suppMat = new THREE.MeshStandardMaterial({color: 0x884400});
  group.add(new THREE.Mesh(new THREE.BoxGeometry(0.5, 2, 5), suppMat).translateX(-2.8).translateY(-1.1));
  group.add(new THREE.Mesh(new THREE.BoxGeometry(0.5, 2, 5), suppMat).translateX(2.8).translateY(-1.1));

  group.add(new THREE.AmbientLight(0xffffff, 0.6));
  const light = new THREE.DirectionalLight(0xffffff, 1.5);
  light.position.set(5, 5, 5);
  group.add(light);

  group.userData.animate = function(delta, time) {
      group.rotation.y = Math.sin(time*0.5)*0.3;
      group.rotation.x = 0.2;
      
      const t = time % 4; // 4s cycle
      let force = 0;
      
      if(t < 1) {
          force = 0; // Weights hovering above
          w1.position.y = 2;
          w2.position.y = 2;
      } else if (t < 2) {
          // Weights drop
          const drop = (t-1);
          w1.position.y = 2 - drop*1.35;
          w2.position.y = 2 - drop*1.35;
          force = Math.sin(drop * Math.PI/2); // smooth apply
      } else if (t < 3) {
          force = 1.0; // Holding max force
      } else {
          // Weights lift off
          const lift = (t-3);
          w1.position.y = 0.65 + lift*1.35;
          w2.position.y = 0.65 + lift*1.35;
          force = 1.0 - Math.sin(lift * Math.PI/2);
      }
      
      // BEND LOGIC (Simple vertex manipulation to bow the beams)
      // Steel bends more (less stiff) than Beryllium
      const steelDef = -0.8 * force; // max bend down 0.8
      const beDef = -0.2 * force;   // max bend down 0.2 (much stiffer!)
      
      const applyBend = (geo, maxDeflection) => {
          const pos = geo.attributes.position;
          for(let i=0; i<pos.count; i++) {
              const x = pos.getX(i);
              // parabolic bend based on X distance from center (0) to edge (3)
              // y = a * x^2 + c
              const normalizedX = x / 3;
              const drop = maxDeflection * (1 - (normalizedX * normalizedX));
              
              // Original Y is either 0.15 or -0.15 (thickness)
              const originalY = i % 2 === 0 ? 0.15 : -0.15; // Rough approximation for this box geo
              // To do this perfectly we need to read the original untransformed Y, 
              // but for a simple box we can just rely on the fact that we apply the drop dynamically
              
              // For a true dynamic vertex update we should store the base geometry, 
              // but for this visual a simple scale/shear trick or bending the whole group is easier.
          }
      };
      
      // Let's use a simpler visual trick since we can't easily deep-copy the geometry on the fly here
      // We will just scale/bend the mesh Y position and rotation to fake the bow
      
      // Fake parabolic bend using a parent group
      sBeam.scale.y = 1 - (force * 0.2); // compress slightly
      sBeam.position.y = steelDef / 2; // drop center
      w1.position.y = (force > 0 ? 0.65 + steelDef : w1.position.y);
      
      beBeam.scale.y = 1 - (force * 0.05);
      beBeam.position.y = beDef / 2;
      w2.position.y = (force > 0 ? 0.65 + beDef : w2.position.y);
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
