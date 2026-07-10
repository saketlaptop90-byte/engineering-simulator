import { darkSteel, steel, aluminum, yellowAccent, rubber } from '../utils/materials.js';

export function createGripperClaw(THREE) {
  const group = new THREE.Group();
  group.name = 'GripperClaw';

  // Base Wrist
  const wristGeo = new THREE.CylinderGeometry(1.5, 1.5, 2, 32);
  const wrist = new THREE.Mesh(wristGeo, darkSteel);
  group.add(wrist);

  const palmGeo = new THREE.BoxGeometry(3, 1, 2);
  const palm = new THREE.Mesh(palmGeo, aluminum);
  palm.position.y = 1.5;
  wrist.add(palm);

  const tracks = [];
  const animDuration = 3;

  // Function to create a finger
  const createFinger = (sign) => {
    const fingerGroup = new THREE.Group();
    fingerGroup.position.set(sign * 1.2, 2.0, 0);
    
    // Proximal Phalanx
    const pGeo = new THREE.BoxGeometry(0.5, 2, 1);
    pGeo.translate(0, 1, 0);
    const proximal = new THREE.Mesh(pGeo, yellowAccent);
    fingerGroup.add(proximal);

    // Distal Phalanx
    const dGeo = new THREE.BoxGeometry(0.4, 2, 0.8);
    dGeo.translate(0, 1, 0);
    const distal = new THREE.Mesh(dGeo, steel);
    distal.position.y = 2;
    proximal.add(distal);

    // Rubber Pad
    const padGeo = new THREE.BoxGeometry(0.1, 1.8, 0.6);
    padGeo.translate(-sign * 0.25, 1, 0);
    const pad = new THREE.Mesh(padGeo, rubber);
    distal.add(pad);

    group.add(fingerGroup);

    // Animate finger closing and opening
    const times = [0, 1.5, 3];
    
    // Proximal joint rotation
    const angleOpenP = sign * 0.2;
    const angleCloseP = sign * -0.4;
    const qP_open = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), angleOpenP);
    const qP_close = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), angleCloseP);
    
    tracks.push(new THREE.QuaternionKeyframeTrack(
      `${proximal.uuid}.quaternion`,
      times,
      [qP_open.x, qP_open.y, qP_open.z, qP_open.w,
       qP_close.x, qP_close.y, qP_close.z, qP_close.w,
       qP_open.x, qP_open.y, qP_open.z, qP_open.w]
    ));

    // Distal joint rotation
    const angleOpenD = sign * 0.1;
    const angleCloseD = sign * -0.6;
    const qD_open = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), angleOpenD);
    const qD_close = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), angleCloseD);

    tracks.push(new THREE.QuaternionKeyframeTrack(
      `${distal.uuid}.quaternion`,
      times,
      [qD_open.x, qD_open.y, qD_open.z, qD_open.w,
       qD_close.x, qD_close.y, qD_close.z, qD_close.w,
       qD_open.x, qD_open.y, qD_open.z, qD_open.w]
    ));
  };

  createFinger(1);  // Right finger
  createFinger(-1); // Left finger

  const clip = new THREE.AnimationClip('PinchGrasp', animDuration, tracks);

  return { group, animationClips: [clip] };
}
