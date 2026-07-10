import * as THREE from 'three';
export function createLithiumGlass() {
  const group = new THREE.Group();
  
  // Lithium Glass (Zero Thermal Expansion) (Remastered)
  
  const plateGeo = new THREE.BoxGeometry(6, 0.2, 6);
  // Left side: Normal Glass
  const normalGlass = new THREE.Mesh(
      plateGeo,
      new THREE.MeshPhysicalMaterial({color: 0x88ccff, transmission: 0.9, opacity: 1, roughness: 0.1, ior: 1.5})
  );
  normalGlass.position.set(-3.5, 0, 0);
  group.add(normalGlass);
  
  // Right side: Lithium Glass (Corningware)
  const liGlass = new THREE.Mesh(
      plateGeo,
      new THREE.MeshPhysicalMaterial({color: 0xffffff, transmission: 0.9, opacity: 1, roughness: 0.1, ior: 1.5})
  );
  liGlass.position.set(3.5, 0, 0);
  group.add(liGlass);
  
  // Fire underneath both
  const createFire = (x) => {
      const g = new THREE.Group();
      const fMat = new THREE.MeshBasicMaterial({color: 0xff4400, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending});
      for(let i=0; i<5; i++) {
          const flame = new THREE.Mesh(new THREE.ConeGeometry(0.5, 2, 8), fMat);
          flame.position.set(x + (Math.random()-0.5)*2, -1.5, (Math.random()-0.5)*2);
          g.add(flame);
      }
      return g;
  };
  const fire1 = createFire(-3.5); group.add(fire1);
  const fire2 = createFire(3.5); group.add(fire2);
  
  // Cracks in the normal glass!
  const crackMat = new THREE.MeshBasicMaterial({color: 0xffffff});
  const crack = new THREE.Group();
  for(let i=0; i<10; i++) {
      const line = new THREE.Mesh(new THREE.BoxGeometry(3, 0.21, 0.05), crackMat);
      line.rotation.y = Math.random() * Math.PI;
      line.position.set(-3.5 + (Math.random()-0.5)*2, 0, (Math.random()-0.5)*2);
      crack.add(line);
  }
  crack.visible = false;
  group.add(crack);
  
  // Labels
  const makeLabel = (textHex, x) => {
      const g = new THREE.Group();
      const plate = new THREE.Mesh(new THREE.BoxGeometry(4, 0.5, 0.1), new THREE.MeshBasicMaterial({color: textHex}));
      plate.position.set(x, -3, 0);
      g.add(plate);
      return g;
  };
  group.add(makeLabel(0x88ccff, -3.5)); // Normal
  group.add(makeLabel(0xffffff, 3.5)); // Lithium

  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(0, 5, 5);
  group.add(light, new THREE.AmbientLight(0x404040, 2));

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.1;
      group.rotation.x = 0.2;
      
      const cycle = (time * speed) % 4;
      
      // Fire flicker
      fire1.scale.setScalar(1 + Math.sin(time*speed*10)*0.1);
      fire2.scale.setScalar(1 + Math.sin(time*speed*10)*0.1);
      
      if (cycle < 2) {
          // Heating up
          crack.visible = false;
          // Normal glass expands wildly and warps!
          normalGlass.scale.x = 1 + (cycle * 0.1);
          normalGlass.scale.z = 1 + (cycle * 0.1);
          
          // Lithium glass stays perfectly rigid! (Zero Thermal Expansion)
          liGlass.scale.set(1, 1, 1);
      } else {
          // SHATTER!
          crack.visible = true;
          normalGlass.scale.x = 1.2;
          normalGlass.scale.z = 1.2;
      }
  };

  return {
    group: group,
    description: "Lithium Glass (Thermal Shock) (Remastered). On the left is normal window glass. On the right is Lithium-Aluminosilicate glass. When you heat normal glass, its atoms vibrate and push each other apart, causing the glass to physically expand and warp. If it expands unevenly, it shatters! (Thermal Shock). However, adding Lithium to the glass creates a crystal structure with a 'Negative' thermal expansion coefficient that perfectly cancels out the glass's positive expansion. The result? A glass with exactly ZERO thermal expansion! You can take Lithium glass out of a freezer and drop it into a fire, and it won't break. This is what glass stovetops are made of!",
    parts: [
      { name: "Blue Glass (Left)", material: "Normal Glass", function: "Expands when heated, causing it to crack and shatter." },
      { name: "White Glass (Right)", material: "Lithium Glass", function: "Zero thermal expansion. Immune to temperature changes." }
    ],
    quizQuestions: [
      { question: "Why doesn't a glass stovetop (made of Lithium glass) shatter when you put cold water on a hot burner?", options: ["It is incredibly thick", "Adding Lithium gives the glass a thermal expansion coefficient of ZERO, meaning it does not shrink or grow when the temperature changes.", "The water boils too fast", "It is made of diamond"], correct: 1, explanation: "Zero thermal expansion means no internal stress is created during rapid temperature changes, making it immune to 'thermal shock'!" }
    ]
  };
}