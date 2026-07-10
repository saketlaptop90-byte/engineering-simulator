import { materials } from '../utils/materials.js';

export function createMaglevTrainTrackSegment(THREE) {
    const group = new THREE.Group();
    group.name = 'MaglevTrack';
    const animationClips = [];

    const guidewayGeo = new THREE.BoxGeometry(10, 2, 40);
    const guidewayMat = materials.concrete || new THREE.MeshStandardMaterial({ color: 0x999999, roughness: 0.8 });
    const guideway = new THREE.Mesh(guidewayGeo, guidewayMat);
    guideway.position.y = 1;
    group.add(guideway);

    const beamGeo = new THREE.BoxGeometry(2, 3, 40);
    const beamMat = materials.steel || new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.6 });
    
    const leftBeam = new THREE.Mesh(beamGeo, beamMat);
    leftBeam.position.set(-4, 3.5, 0);
    group.add(leftBeam);

    const rightBeam = new THREE.Mesh(beamGeo, beamMat);
    rightBeam.position.set(4, 3.5, 0);
    group.add(rightBeam);

    const coilGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.2, 16);
    coilGeo.rotateZ(Math.PI / 2);
    const coilMat = materials.copper || new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 0.8, roughness: 0.4 });
    
    const coilsGroup = new THREE.Group();
    coilsGroup.name = 'CoilsGroup';
    for(let z = -19; z <= 19; z += 2) {
        const leftCoil = new THREE.Mesh(coilGeo, coilMat.clone());
        leftCoil.position.set(-2.9, 3.5, z);
        leftCoil.name = `LeftCoil_${z}`;
        coilsGroup.add(leftCoil);

        const rightCoil = new THREE.Mesh(coilGeo, coilMat.clone());
        rightCoil.position.set(2.9, 3.5, z);
        rightCoil.name = `RightCoil_${z}`;
        coilsGroup.add(rightCoil);
    }
    group.add(coilsGroup);

    const tracks = [];
    coilsGroup.children.forEach((coil, index) => {
        const times = [0, (index % 10) * 0.1, ((index % 10) * 0.1) + 0.2, 2];
        const values = [0,0,0, 0,1,0.5, 1,0.5,0, 0,0,0];
        tracks.push(new THREE.ColorKeyframeTrack(`${coil.name}.material.emissive`, times, values));
    });

    const clip = new THREE.AnimationClip('MagneticPulse', 2, tracks);
    animationClips.push(clip);

    return { group, animationClips };
}
