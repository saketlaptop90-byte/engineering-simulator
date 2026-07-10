import { materials } from '../utils/materials.js';

export function createHubble(THREE) {
  const group = new THREE.Group();
  group.name = "HubbleSpaceTelescope";

  const hubbleBody = new THREE.Group();
  group.add(hubbleBody);

  // Main tube
  const tubeGeom = new THREE.CylinderGeometry(2, 2, 10, 32);
  const tubeMat = materials.aluminum || new THREE.MeshStandardMaterial({ color: 0xdddddd });
  const tube = new THREE.Mesh(tubeGeom, tubeMat);
  tube.rotation.x = Math.PI / 2;
  hubbleBody.add(tube);

  // Aperture door
  const doorGeom = new THREE.CylinderGeometry(2, 2, 0.2, 32);
  const door = new THREE.Mesh(doorGeom, tubeMat);
  
  const doorPivot = new THREE.Group();
  doorPivot.position.set(0, 2, 5);
  door.position.set(0, 2, 0); // Offset from pivot
  door.rotation.x = Math.PI / 2;
  doorPivot.add(door);
  hubbleBody.add(doorPivot);

  // Solar panels
  const panelGeom = new THREE.BoxGeometry(12, 0.1, 3);
  const panelMat = materials.glass || new THREE.MeshStandardMaterial({ color: 0x1122aa });
  
  const leftPanel = new THREE.Mesh(panelGeom, panelMat);
  leftPanel.position.set(-8, 0, -2);
  hubbleBody.add(leftPanel);
  
  const rightPanel = new THREE.Mesh(panelGeom, panelMat);
  rightPanel.position.set(8, 0, -2);
  hubbleBody.add(rightPanel);

  // Antennae
  const antGeom = new THREE.CylinderGeometry(0.05, 0.05, 4);
  const antMat = materials.darkSteel || new THREE.MeshStandardMaterial({ color: 0x333333 });
  const antenna1 = new THREE.Mesh(antGeom, antMat);
  antenna1.position.set(0, -2.5, -3);
  hubbleBody.add(antenna1);

  // Animation: opening door and rotating panels
  const animationClips = [];
  
  const doorTrackName = `${doorPivot.uuid}.rotation[x]`;
  const times = [0, 3, 6];
  const doorValues = [0, -Math.PI / 1.5, 0];
  const doorTrack = new THREE.NumberKeyframeTrack(doorTrackName, times, doorValues);
  
  const leftPanelTrackName = `${leftPanel.uuid}.rotation[x]`;
  const rightPanelTrackName = `${rightPanel.uuid}.rotation[x]`;
  const panelValues = [0, Math.PI, Math.PI * 2];
  const lpTrack = new THREE.NumberKeyframeTrack(leftPanelTrackName, times, panelValues);
  const rpTrack = new THREE.NumberKeyframeTrack(rightPanelTrackName, times, panelValues);

  const clip = new THREE.AnimationClip('Operate', 6, [doorTrack, lpTrack, rpTrack]);
  animationClips.push(clip);

  return { group, animationClips };
}
