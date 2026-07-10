import { steel, darkSteel, orangeAccent, titanium } from '../utils/materials.js';

export function createTBMCutterhead(THREE) {
  const group = new THREE.Group();
  
  const faceGroup = new THREE.Group();
  faceGroup.name = "FaceGroup";
  group.add(faceGroup);
  
  const faceGeometry = new THREE.CylinderGeometry(5, 5, 1, 32);
  const face = new THREE.Mesh(faceGeometry, darkSteel);
  face.rotation.x = Math.PI / 2;
  faceGroup.add(face);
  
  const centerGeometry = new THREE.ConeGeometry(1.5, 2, 16);
  const centerCutter = new THREE.Mesh(centerGeometry, steel);
  centerCutter.position.y = 1;
  centerCutter.rotation.x = -Math.PI / 2;
  face.add(centerCutter);

  const discGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16);
  for (let r = 1.5; r < 4.8; r += 0.8) {
    const numDiscs = Math.floor(r * 3);
    for (let i = 0; i < numDiscs; i++) {
      const angle = (i / numDiscs) * Math.PI * 2;
      const disc = new THREE.Mesh(discGeometry, titanium);
      disc.position.set(Math.cos(angle) * r, 0.6, Math.sin(angle) * r);
      disc.rotation.x = Math.PI / 2;
      disc.rotation.z = angle;
      face.add(disc);
    }
  }

  const shieldGeometry = new THREE.CylinderGeometry(5.2, 5.2, 3, 32, 1, true);
  const shield = new THREE.Mesh(shieldGeometry, orangeAccent);
  shield.rotation.x = Math.PI / 2;
  shield.position.z = -1;
  group.add(shield);

  const q0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), 0);
  const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), Math.PI);
  const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), Math.PI * 2);
  
  const track = new THREE.QuaternionKeyframeTrack('FaceGroup.quaternion', [0, 2, 4], [
    ...q0.toArray(), ...q1.toArray(), ...q2.toArray()
  ]);

  const clip = new THREE.AnimationClip('Rotate', 4, [track]);

  return { group, animationClips: [clip] };
}

// Auto-generated missing stub
export function createTunnelBoringMachine() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
