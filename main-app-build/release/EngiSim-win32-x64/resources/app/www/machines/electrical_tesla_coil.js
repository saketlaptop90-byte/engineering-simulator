import {
  steel, rubber, wireCoil, ceramic, chrome, whitePlastic
} from '../utils/materials.js';

export function createTeslaCoil(THREE) {
  const group = new THREE.Group();
  
  // Base
  const baseGeo = new THREE.BoxGeometry(4, 0.5, 4);
  const base = new THREE.Mesh(baseGeo, rubber);
  base.position.y = 0.25;
  group.add(base);

  // Primary Coil (thick turns)
  const primaryGeo = new THREE.TorusGeometry(1.5, 0.1, 16, 32);
  for (let i = 0; i < 5; i++) {
    const turn = new THREE.Mesh(primaryGeo, wireCoil);
    turn.position.y = 0.6 + i * 0.25;
    turn.rotation.x = Math.PI / 2;
    group.add(turn);
  }

  // Secondary Coil (tall cylinder)
  const secondaryGeo = new THREE.CylinderGeometry(0.5, 0.5, 6, 32);
  const secondary = new THREE.Mesh(secondaryGeo, whitePlastic);
  secondary.position.y = 3.5;
  group.add(secondary);

  // Toroid (top)
  const toroidGeo = new THREE.TorusGeometry(1.2, 0.4, 32, 64);
  const toroid = new THREE.Mesh(toroidGeo, chrome);
  toroid.position.y = 6.8;
  toroid.rotation.x = Math.PI / 2;
  group.add(toroid);

  // Lightning Arcs
  const arcsGroup = new THREE.Group();
  arcsGroup.position.y = 6.8;
  
  const arcMaterial = new THREE.MeshBasicMaterial({ color: 0x88ccff, transparent: true, opacity: 0.8 });
  const arcMeshes = [];
  
  for (let i = 0; i < 6; i++) {
    const arcGeo = new THREE.CylinderGeometry(0.02, 0.05, 3 + Math.random() * 2, 8);
    // Shift geometry so it scales from the base
    arcGeo.translate(0, (3 + Math.random() * 2)/2, 0);

    const arc = new THREE.Mesh(arcGeo, arcMaterial);
    
    // Position randomly around the toroid
    const angle = (i / 6) * Math.PI * 2;
    arc.position.set(Math.cos(angle) * 1.2, 0, Math.sin(angle) * 1.2);
    
    // Random outward rotation
    const axis = new THREE.Vector3(Math.random()-0.5, Math.random()-0.5, Math.random()-0.5).normalize();
    arc.quaternion.setFromAxisAngle(axis, Math.random() * Math.PI);
    
    arc.name = `arc_${i}`;
    arcsGroup.add(arc);
    arcMeshes.push(arc);
  }
  group.add(arcsGroup);

  // Animations: Arcs flickering (scale)
  const tracks = [];
  arcMeshes.forEach((arc, i) => {
    const times = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];
    const scales = [];
    for (let t = 0; t < times.length; t++) {
      const s = Math.random() > 0.4 ? 1 + Math.random() : 0.001; // flicker
      scales.push(s, s, s);
    }
    const scaleTrack = new THREE.VectorKeyframeTrack(`${arc.name}.scale`, times, scales);
    tracks.push(scaleTrack);
  });

  const clip = new THREE.AnimationClip('TeslaFlicker', 1.0, tracks);

  return { group, animationClips: [clip] };
}
