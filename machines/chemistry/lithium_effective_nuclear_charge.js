import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

export function createLithiumEffectiveNuclearCharge() {
  const group = new THREE.Group();
  
  // Effective Nuclear Charge (Z_eff) Math Visualization (Remastered)
  
  // We will build a glowing 3D equation: Z (+3) - S (2) = Z_eff (+1)
  
  const textGroup = new THREE.Group();
  group.add(textGroup);
  
  // Add some visual particles behind the math
  const nuc = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), new THREE.MeshPhysicalMaterial({color: 0xff0000, transparent: true, opacity: 0.5}));
  nuc.position.set(-6, 0, -2);
  group.add(nuc);
  
  const core = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), new THREE.MeshPhysicalMaterial({color: 0x00ffff, transparent: true, opacity: 0.5}));
  core.position.set(0, 0, -2);
  group.add(core);
  
  const val = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), new THREE.MeshPhysicalMaterial({color: 0xff00ff, transparent: true, opacity: 0.5}));
  val.position.set(6, 0, -2);
  group.add(val);

  const loader = new FontLoader();
  loader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', function (font) {
      
      const createText = (str, color, x) => {
          const geo = new TextGeometry(str, { font: font, size: 1.5, depth: 0.2 });
          geo.computeBoundingBox();
          const offset = -0.5 * (geo.boundingBox.max.x - geo.boundingBox.min.x);
          const mesh = new THREE.Mesh(geo, new THREE.MeshPhysicalMaterial({color: color, metalness: 0.5, roughness: 0.2, emissive: color, emissiveIntensity: 0.5}));
          mesh.position.set(x + offset, -0.5, 0);
          textGroup.add(mesh);
          return mesh;
      };
      
      createText("Z (+3)", 0xff0000, -6);
      createText("-", 0xffffff, -3);
      createText("S (2)", 0x00ffff, 0);
      createText("=", 0xffffff, 3);
      createText("Z_eff (+1)", 0xff00ff, 7);
  });

  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(0, 5, 5);
  group.add(light, new THREE.AmbientLight(0x404040, 2));

  group.userData.animate = function(delta, time, speed) {
      // Gentle floating animation
      group.position.y = Math.sin(time * speed) * 0.2;
      group.rotation.x = Math.sin(time * speed * 0.5) * 0.1;
      
      nuc.scale.setScalar(1 + Math.sin(time*speed*3)*0.1);
      core.scale.setScalar(1 + Math.sin(time*speed*3 + 1)*0.1);
      val.scale.setScalar(1 + Math.sin(time*speed*3 + 2)*0.1);
  };

  return {
    group: group,
    description: "Effective Nuclear Charge (Z_eff) (Remastered). How much of the nucleus does the outermost electron actually 'feel'? We calculate this using the formula: Z_eff = Z - S. 

Z is the total nuclear charge (Lithium has 3 protons, so Z = +3). 
S is the number of shielding core electrons (Lithium has 2 core electrons). 

3 minus 2 equals +1! This means that despite the nucleus having a charge of +3, the outer valence electron only feels a weak pull of +1. This brilliantly simple math explains exactly why Lithium so easily gives away its outer electron to form batteries—it's barely holding onto it!",
    parts: [
      { name: "Z (+3)", material: "Atomic Number", function: "The total number of protons pulling inward." },
      { name: "S (2)", material: "Shielding Electrons", function: "The number of core electrons pushing outward." },
      { name: "Z_eff (+1)", material: "Effective Charge", function: "The net force actually felt by the valence electron." }
    ],
    quizQuestions: [
      { question: "Using the formula Z_eff = Z - S, why is Lithium so eager to give away its valence electron in chemical reactions?", options: ["Because Z_eff is negative", "Because the effective nuclear charge pulling on that electron is only +1, making it very weakly bound.", "Because it has too many protons", "Because the math is broken"], correct: 1, explanation: "If Z_eff is low, the atom holds onto its electron very weakly, making it a highly reactive metal!" }
    ]
  };
}