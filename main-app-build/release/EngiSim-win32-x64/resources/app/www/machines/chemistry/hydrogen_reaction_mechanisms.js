import * as THREE from 'three';
export function createHydrogenReactionMechanisms() {
  const group = new THREE.Group();
  
  // H2 and Cl2 reaction (Radical substitution)
  // Initiation (Photon breaking Cl2)
  const photon = new THREE.ArrowHelper(new THREE.Vector3(0,-1,0), new THREE.Vector3(0,3,0), 1, 0xff00ff);
  group.add(photon);

  const cl1 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16,16), new THREE.MeshBasicMaterial({color: 0x00ff00}));
  const cl2 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16,16), new THREE.MeshBasicMaterial({color: 0x00ff00}));
  group.add(cl1, cl2);

  const h1 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16,16), new THREE.MeshBasicMaterial({color: 0xffffff}));
  const h2 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16,16), new THREE.MeshBasicMaterial({color: 0xffffff}));
  group.add(h1, h2);

  group.userData.animate = function(delta, time, speed) {
      const cycle = (time * speed) % 8;
      
      if(cycle < 2) {
          // Intact molecules
          cl1.position.set(-2.5, 1, 0); cl2.position.set(-1.5, 1, 0);
          h1.position.set(1.5, 0, 0); h2.position.set(2.1, 0, 0);
          photon.visible = true; photon.position.set(-2, 3-cycle, 0);
      } else if (cycle < 4) {
          // Photon breaks Cl2 (Initiation)
          photon.visible = false;
          const t = cycle - 2;
          cl1.position.set(-2.5 - t, 1, 0);
          cl2.position.set(-1.5 + t*2, 1 - t*0.5, 0); // one cl moves toward H2
          h1.position.set(1.5, 0, 0); h2.position.set(2.1, 0, 0);
      } else if (cycle < 6) {
          // Propagation (Cl hits H2)
          const t = cycle - 4;
          cl1.position.set(-4.5, 1, 0);
          
          cl2.position.set(0.5, 0, 0);
          h1.position.set(1.5, 0, 0);
          // HCl forms, H radical escapes
          if (t > 1) {
              h2.position.set(2.1 + (t-1)*2, (t-1)*2, 0);
          }
      } else {
          // Done
      }
  };

  return {
    group: group,
    description: "Reaction Mechanisms (Free Radical Chain Reaction). When mixed with Chlorine gas, Hydrogen will explode if exposed to UV light. The light breaks Cl2 into radicals (Initiation), which smash into H2 to form HCl and an H radical (Propagation), causing a runaway chain reaction.",
    parts: [
      { name: "UV Photon", material: "Magenta Arrow", function: "Provides activation energy to homolytically cleave the Cl-Cl bond." },
      { name: "Cl Radical", material: "Green Sphere", function: "Extremely reactive atom with an unpaired electron." },
      { name: "HCl + H Radical", material: "Products", function: "Forms Hydrochloric acid and a new H radical to continue the chain." }
    ],
    quizQuestions: [
      { question: "In the reaction between H2 and Cl2 triggered by UV light, what is the role of the UV photon?", options: ["It heats up the glass container", "It breaks the H-H bond", "It breaks the Cl-Cl bond to create reactive chlorine radicals (Initiation)", "It turns the gases into liquids"], correct: 2, explanation: "The Cl-Cl bond is weaker than the H-H bond and absorbs UV light strongly. The photon cleaves the Cl2 molecule into two highly reactive Chlorine radicals, initiating the explosive chain reaction." }
    ]
  };
}