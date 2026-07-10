export function createBenzeneResonance(THREE) {
  const group = new THREE.Group();
  
  const cGeometry = new THREE.SphereGeometry(0.4, 32, 32);
  const cMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
  const hGeometry = new THREE.SphereGeometry(0.2, 32, 32);
  const hMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
  
  const radiusC = 2;
  const radiusH = 3;
  const carbons = [];
  
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3;
    
    // Carbon
    const cMesh = new THREE.Mesh(cGeometry, cMaterial);
    cMesh.position.set(Math.cos(angle) * radiusC, Math.sin(angle) * radiusC, 0);
    group.add(cMesh);
    carbons.push(cMesh);
    
    // Hydrogen
    const hMesh = new THREE.Mesh(hGeometry, hMaterial);
    hMesh.position.set(Math.cos(angle) * radiusH, Math.sin(angle) * radiusH, 0);
    group.add(hMesh);
  }

  // Pi electron cloud representation
  const piGeometry = new THREE.TorusGeometry(radiusC, 0.3, 16, 100);
  const piMaterial = new THREE.MeshStandardMaterial({
    color: 0x00aaff,
    transparent: true,
    opacity: 0.5
  });
  const piCloudTop = new THREE.Mesh(piGeometry, piMaterial);
  piCloudTop.position.set(0, 0, 0.6);
  group.add(piCloudTop);

  const piCloudBottom = new THREE.Mesh(piGeometry, piMaterial);
  piCloudBottom.position.set(0, 0, -0.6);
  group.add(piCloudBottom);

  // Animation: Cloud pulsates
  const times = [0, 1, 2];
  const scaleTrack1 = new THREE.VectorKeyframeTrack(
    piCloudTop.uuid + '.scale', times,
    [1, 1, 1,  1.1, 1.1, 1.1,  1, 1, 1]
  );
  const scaleTrack2 = new THREE.VectorKeyframeTrack(
    piCloudBottom.uuid + '.scale', times,
    [1, 1, 1,  1.1, 1.1, 1.1,  1, 1, 1]
  );

  const clip = new THREE.AnimationClip('Benzene_Resonance', 2, [scaleTrack1, scaleTrack2]);

  return { group, animationClips: [clip] };
}
