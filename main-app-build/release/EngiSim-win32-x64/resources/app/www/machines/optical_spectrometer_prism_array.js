import { getMaterials } from '../utils/materials.js';

export function createSpectrometerPrismArray(THREE) {
    const group = new THREE.Group();
    const materials = getMaterials(THREE);
    
    // Base platform
    const baseGeo = new THREE.CylinderGeometry(8, 8, 0.5, 64);
    const base = new THREE.Mesh(baseGeo, materials.metal);
    group.add(base);

    // Light Source / Collimator
    const collimatorGroup = new THREE.Group();
    collimatorGroup.position.set(-6, 1, 0);
    group.add(collimatorGroup);

    const tubeGeo = new THREE.CylinderGeometry(0.5, 0.5, 3, 32);
    const collimatorTube = new THREE.Mesh(tubeGeo, materials.plastic);
    collimatorTube.rotation.z = Math.PI / 2;
    collimatorGroup.add(collimatorTube);

    // White light beam
    const whiteBeamGeo = new THREE.CylinderGeometry(0.1, 0.1, 4);
    const whiteBeamMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });
    const whiteBeam = new THREE.Mesh(whiteBeamGeo, whiteBeamMat);
    whiteBeam.rotation.z = Math.PI / 2;
    whiteBeam.position.x = 3.5;
    collimatorGroup.add(whiteBeam);

    // Prism Platform
    const prismPlatformGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.5, 32);
    const prismPlatform = new THREE.Mesh(prismPlatformGeo, materials.chrome);
    prismPlatform.position.set(0, 0.5, 0);
    prismPlatform.name = "prismPlatform";
    group.add(prismPlatform);

    // Prism
    const prismGeo = new THREE.CylinderGeometry(1, 1, 1.5, 3);
    const prism = new THREE.Mesh(prismGeo, materials.glass);
    prism.position.set(0, 1, 0);
    prismPlatform.add(prism);

    // Detector Array
    const detectorGroup = new THREE.Group();
    detectorGroup.position.set(6, 1, -3);
    detectorGroup.rotation.y = -Math.PI / 6;
    group.add(detectorGroup);

    const detectorBase = new THREE.Mesh(new THREE.BoxGeometry(0.5, 2, 6), materials.plastic);
    detectorGroup.add(detectorBase);

    // Dispersed Beams
    const colors = [0xff0000, 0xffa500, 0xffff00, 0x00ff00, 0x0000ff, 0x4b0082, 0xee82ee];
    const dispersedBeams = new THREE.Group();
    dispersedBeams.position.set(0, 1, 0);
    dispersedBeams.name = "dispersedBeams";
    group.add(dispersedBeams);

    for (let i = 0; i < colors.length; i++) {
        const length = 7;
        const beamGeo = new THREE.CylinderGeometry(0.02, 0.15, length);
        const beamMat = new THREE.MeshBasicMaterial({ color: colors[i], transparent: true, opacity: 0 });
        // Origin is at 0,1,0
        // Translate geometry so origin is at end
        beamGeo.translate(0, length / 2, 0);
        const beam = new THREE.Mesh(beamGeo, beamMat);
        beam.name = `beam_${i}`;
        
        // Rotate to point towards detector
        const spread = (i - colors.length / 2) * 0.08;
        beam.rotation.z = -Math.PI / 2; // Lay flat
        beam.rotation.x = -Math.PI / 6 + spread; // Point slightly back
        
        dispersedBeams.add(beam);
    }

    // Animation: Rotating prism and beams appearing
    const times = [0, 2, 4, 6];
    const rotationValues = [0, Math.PI / 12, 0, -Math.PI / 12];
    const platformTrack = new THREE.NumberKeyframeTrack(`${prismPlatform.name}.rotation[y]`, times, rotationValues);
    
    // Beam opacity animation (fade in and out based on prism angle)
    const opacityTimes = [0, 1, 2, 3, 4, 5, 6];
    const opacityValues = [0.1, 0.8, 1.0, 0.8, 0.1, 0.4, 0.1];
    
    const tracks = [platformTrack];
    for (let i = 0; i < colors.length; i++) {
        tracks.push(new THREE.NumberKeyframeTrack(`${dispersedBeams.children[i].name}.material.opacity`, opacityTimes, opacityValues));
    }

    const clip = new THREE.AnimationClip('Dispersion', 6, tracks);

    return { group, animationClips: [clip] };
}
