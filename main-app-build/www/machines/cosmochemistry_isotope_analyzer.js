export function createIsotopeAnalyzer(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base
    const baseGeo = new THREE.BoxGeometry(4, 0.5, 4);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.8, roughness: 0.2 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 0.25;
    group.add(base);

    // Main Chamber
    const chamberGeo = new THREE.CylinderGeometry(1.5, 1.5, 3, 32);
    const chamberMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.9, roughness: 0.1, transparent: true, opacity: 0.7 });
    const chamber = new THREE.Mesh(chamberGeo, chamberMat);
    chamber.position.y = 2;
    group.add(chamber);

    // Laser Source
    const laserGeo = new THREE.BoxGeometry(0.5, 1, 0.5);
    const laserMat = new THREE.MeshStandardMaterial({ color: 0xff0000, metalness: 0.5, roughness: 0.5 });
    const laser = new THREE.Mesh(laserGeo, laserMat);
    laser.position.set(0, 3.5, 0);
    group.add(laser);

    // Sample Holder
    const holderGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.2, 16);
    const holderMat = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.7, roughness: 0.3 });
    const holder = new THREE.Mesh(holderGeo, holderMat);
    holder.position.y = 1;
    group.add(holder);

    // Sample (Meteorite piece)
    const sampleGeo = new THREE.DodecahedronGeometry(0.2, 1);
    const sampleMat = new THREE.MeshStandardMaterial({ color: 0x4a4a4a, metalness: 0.3, roughness: 0.9 });
    const sample = new THREE.Mesh(sampleGeo, sampleMat);
    sample.position.y = 1.2;
    group.add(sample);

    // Laser Beam (Animated)
    const beamGeo = new THREE.CylinderGeometry(0.02, 0.02, 2.3, 8);
    const beamMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.position.y = 2.35;
    group.add(beam);

    // Animation for laser pulsing
    const trackName = `${beam.uuid}.scale[x]`;
    const trackNameZ = `${beam.uuid}.scale[z]`;
    const times = [0, 0.1, 0.2, 0.5, 1];
    const values = [1, 3, 1, 0.1, 1];
    const trackX = new THREE.NumberKeyframeTrack(trackName, times, values);
    const trackZ = new THREE.NumberKeyframeTrack(trackNameZ, times, values);
    
    const clip = new THREE.AnimationClip('LaserPulse', 1, [trackX, trackZ]);
    animationClips.push(clip);

    return { group, animationClips };
}
