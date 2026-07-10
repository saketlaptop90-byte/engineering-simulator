// ═══════════════════════════════════════════════════════════════════
// EngiSim 3D — Shared Materials Library
// PBR-like materials for mechanical parts
// ═══════════════════════════════════════════════════════════════════



// ─── Metal Materials ───
export const steel = new THREE.MeshStandardMaterial({
  color: 0x8899aa, metalness: 0.85, roughness: 0.25,
  name: 'Steel'
});



export const blackPlastic = new THREE.MeshStandardMaterial({
  color: 0x1a1a1a, metalness: 0.2, roughness: 0.8,
  name: 'Black Plastic'
});

export const castIron = new THREE.MeshStandardMaterial({
  color: 0x5a5a5a, metalness: 0.6, roughness: 0.6,
  name: 'Cast Iron'
});

export const aluminum = new THREE.MeshStandardMaterial({
  color: 0xc0c8d0, metalness: 0.8, roughness: 0.2,
  name: 'Aluminum'
});

export const copper = new THREE.MeshStandardMaterial({
  color: 0xb87333, metalness: 0.9, roughness: 0.3,
  name: 'Copper'
});

export const brass = new THREE.MeshStandardMaterial({
  color: 0xd4a844, metalness: 0.85, roughness: 0.25,
  name: 'Brass'
});

export const gold = new THREE.MeshStandardMaterial({
  color: 0xffd700, metalness: 1.0, roughness: 0.15,
  name: 'Gold'
});


export const chrome = new THREE.MeshStandardMaterial({
  color: 0xdee4ea, metalness: 0.95, roughness: 0.05,
  envMapIntensity: 1.5, name: 'Chrome'
});

export const darkSteel = new THREE.MeshStandardMaterial({
  color: 0x3a3f4a, metalness: 0.7, roughness: 0.45,
  name: 'Dark Steel'
});

export const titanium = new THREE.MeshStandardMaterial({
  color: 0x878d96, metalness: 0.75, roughness: 0.35,
  name: 'Titanium'
});

export const lead = new THREE.MeshStandardMaterial({
  color: 0x6b6b78, metalness: 0.5, roughness: 0.7,
  name: 'Lead'
});

// ─── Non-Metal Materials ───
export const rubber = new THREE.MeshStandardMaterial({
  color: 0x1a1a1a, metalness: 0.0, roughness: 0.95,
  name: 'Rubber'
});

export const plastic = new THREE.MeshStandardMaterial({
  color: 0x2a2a3a, metalness: 0.0, roughness: 0.5,
  name: 'Plastic'
});

export const whitePlastic = new THREE.MeshStandardMaterial({
  color: 0xe8e8ee, metalness: 0.0, roughness: 0.4,
  name: 'White Plastic'
});

export const ceramic = new THREE.MeshStandardMaterial({
  color: 0xf0e6d0, metalness: 0.05, roughness: 0.3,
  name: 'Ceramic'
});

export const glass = new THREE.MeshStandardMaterial({
  color: 0x88ccff, metalness: 0.1, roughness: 0.05,
  transparent: true, opacity: 0.35,
  name: 'Glass'
});

export const greenPCB = new THREE.MeshStandardMaterial({
  color: 0x1a6b1a, metalness: 0.2, roughness: 0.6,
  name: 'PCB'
});

export const insulation = new THREE.MeshStandardMaterial({
  color: 0x8b4513, metalness: 0.0, roughness: 0.8,
  name: 'Insulation'
});

export const carbonFiber = new THREE.MeshStandardMaterial({
  color: 0x222233, metalness: 0.4, roughness: 0.5,
  name: 'Carbon Fiber'
});

// ─── Accent Colors for part differentiation ───
export const redAccent = new THREE.MeshStandardMaterial({
  color: 0xcc3333, metalness: 0.3, roughness: 0.5, name: 'Red'
});
export const blueAccent = new THREE.MeshStandardMaterial({
  color: 0x3366cc, metalness: 0.3, roughness: 0.5, name: 'Blue'
});
export const orangeAccent = new THREE.MeshStandardMaterial({
  color: 0xdd7722, metalness: 0.3, roughness: 0.5, name: 'Orange'
});
export const yellowAccent = new THREE.MeshStandardMaterial({
  color: 0xccaa22, metalness: 0.3, roughness: 0.5, name: 'Yellow'
});
export const greenAccent = new THREE.MeshStandardMaterial({
  color: 0x33aa55, metalness: 0.3, roughness: 0.5, name: 'Green'
});
export const purpleAccent = new THREE.MeshStandardMaterial({
  color: 0x8844bb, metalness: 0.3, roughness: 0.5, name: 'Purple'
});

// ─── Special Materials ───
export const electrolyte = new THREE.MeshStandardMaterial({
  color: 0x446688, metalness: 0.1, roughness: 0.2,
  transparent: true, opacity: 0.45,
  name: 'Electrolyte'
});

export const fire = new THREE.MeshStandardMaterial({
  color: 0xff6600, emissive: 0xff4400, emissiveIntensity: 0.8,
  metalness: 0.0, roughness: 0.5,
  name: 'Fire/Combustion'
});

export const wireCoil = new THREE.MeshStandardMaterial({
  color: 0xcc7733, metalness: 0.7, roughness: 0.35,
  name: 'Wire Coil'
});

// ─── Transparent / Wireframe for ghost mode ───
export const ghostMaterial = new THREE.MeshStandardMaterial({
  color: 0x4488cc, metalness: 0.1, roughness: 0.3,
  transparent: true, opacity: 0.08, wireframe: true,
  name: 'Ghost'
});

export const damagedOverlay = new THREE.MeshStandardMaterial({
  color: 0xff2222, emissive: 0xff0000, emissiveIntensity: 0.6,
  metalness: 0.3, roughness: 0.5,
  transparent: true, opacity: 0.6,
  name: 'Damaged'
});

// ─── Helper to clone material with a different color ───
export function tinted(baseMat, color) {
  const m = baseMat.clone();
  m.color = new THREE.Color(color);
  return m;
}

// ─── All materials indexed by name ───
export const allMaterials = {
  steel, castIron, aluminum, copper, brass, chrome, darkSteel, titanium, lead,
  rubber, plastic, whitePlastic, ceramic, glass, greenPCB, insulation, carbonFiber,
  redAccent, blueAccent, orangeAccent, yellowAccent, greenAccent, purpleAccent,
  electrolyte, fire, wireCoil, ghostMaterial, damagedOverlay
};
