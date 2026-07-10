import materials from '../utils/materials.js';

export function createSteamGenerator(THREE) {
  const group = new THREE.Group();
  
  const shellMat = materials?.shell || new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 0.4, roughness: 0.3, transparent: true, opacity: 0.3 });
  const tubeMat = materials?.tube || new THREE.MeshStandardMaterial({ color: 0xff4422, metalness: 0.7, roughness: 0.2 });
  const steamMat = materials?.steam || new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 });

  // Shell
  const shell = new THREE.Mesh(new THREE.CylinderGeometry(4, 4, 20, 32), shellMat);
  group.add(shell);

  // U-Tubes
  const tubesGroup = new THREE.Group();
  for (let i = 0.5; i <= 3; i+=0.5) {
    const path = new THREE.Path();
    path.lineTo(0, 8);
    path.absarc(0, 8, i, 0, Math.PI, false);
    path.lineTo(-i*2, 0); 
    
    // Convert path to 3D curve
    const points = path.getPoints(20).map(p => new THREE.Vector3(p.x + i, p.y - 8, 0));
    const curve = new THREE.CatmullRomCurve3(points);
    const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.1, 8, false);
    
    // Add multiple angles for tubes
    for (let angle = 0; angle < Math.PI; angle += Math.PI/4) {
      const tube = new THREE.Mesh(tubeGeo, tubeMat);
      tube.rotation.y = angle;
      tubesGroup.add(tube);
    }
  }
  group.add(tubesGroup);

  // Steam visual
  const steamGroup = new THREE.Group();
  steamGroup.name = "Steam";
  const steam = new THREE.Mesh(new THREE.CylinderGeometry(3.8, 3.8, 5, 32), steamMat);
  steam.position.y = 7;
  steamGroup.add(steam);
  group.add(steamGroup);

  const animationClips = [];
  // Steam rising / pulsing
  const times = [0, 2, 4];
  const values = [7, 7, 7,  7.5, 7.5, 7.5,  7, 7, 7];
  const track = new THREE.VectorKeyframeTrack('Steam.position', times, values);
  const clip = new THREE.AnimationClip('SteamGeneration', 4, [track]);
  animationClips.push(clip);

  return { group, animationClips };
}
