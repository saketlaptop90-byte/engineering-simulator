import * as THREE from 'three';
export function createLithiumAlkaliMetalGroup() {
  const group = new THREE.Group();
  
  // A vertical column showing Li, Na, K
  const li = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 16), new THREE.MeshBasicMaterial({color: 0xff00ff})); li.position.set(0, 3, 0);
  const na = new THREE.Mesh(new THREE.SphereGeometry(1.5, 16, 16), new THREE.MeshBasicMaterial({color: 0x00ffff})); na.position.set(0, 0, 0);
  const k = new THREE.Mesh(new THREE.SphereGeometry(2, 16, 16), new THREE.MeshBasicMaterial({color: 0xffff00})); k.position.set(0, -3.5, 0);
  
  group.add(li, na, k);

  // 1 Valence electron orbiting each
  const l_e = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16,16), new THREE.MeshBasicMaterial({color: 0xffffff})); li.add(l_e);
  const n_e = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16,16), new THREE.MeshBasicMaterial({color: 0xffffff})); na.add(n_e);
  const k_e = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16,16), new THREE.MeshBasicMaterial({color: 0xffffff})); k.add(k_e);

  // Connecting vertical line (The Group)
  const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,4,0), new THREE.Vector3(0,-5,0)]), new THREE.LineBasicMaterial({color: 0xffffff, transparent:true, opacity:0.3}));
  group.add(line);

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = Math.sin(time*speed*0.5)*0.2;
      
      l_e.position.set(Math.cos(time*speed*3)*1.2, 0, Math.sin(time*speed*3)*1.2);
      n_e.position.set(Math.cos(time*speed*2.5)*1.8, 0, Math.sin(time*speed*2.5)*1.8);
      k_e.position.set(Math.cos(time*speed*2)*2.3, 0, Math.sin(time*speed*2)*2.3);
  };

  return {
    group: group,
    description: "The Alkali Metals (Group 1). The periodic table is arranged in columns called 'Groups'. Lithium is the top element of Group 1 (under Hydrogen). Below it are Sodium (Na) and Potassium (K). What do they all have in common? They ALL have exactly 1 valence electron! Because they have the same outer shell setup, they all react in the exact same ways (just with increasing violence as they get bigger).",
    parts: [
      { name: "Magenta Sphere", material: "Lithium", function: "Smallest alkali metal." },
      { name: "Cyan Sphere", material: "Sodium", function: "Bigger, more reactive." },
      { name: "Yellow Sphere", material: "Potassium", function: "Even bigger, explosive reactivity." },
      { name: "Single Orbiting Dots", material: "1 Valence Electron", function: "The defining characteristic of the entire group." }
    ],
    quizQuestions: [
      { question: "Why do Lithium, Sodium, and Potassium have nearly identical chemical reactions?", options: ["They are all the same color", "They all have exactly 1 valence electron, which dictates their chemical behavior", "They all have the same number of protons", "They don't; they are completely different"], correct: 1, explanation: "Elements in the same column (Group) on the periodic table share the same valence electron configuration. Since chemistry is just the trading of outer electrons, they behave like chemical siblings." }
    ]
  };
}