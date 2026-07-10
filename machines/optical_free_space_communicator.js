import * as materials from '../utils/materials.js';

export function createFreeSpaceOpticalCommunicator(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const txGroup = new THREE.Group();
    txGroup.position.set(-5, 0, 0);
    
    const txBodyGeo = new THREE.BoxGeometry(1.5, 1.5, 2);
    const txBody = new THREE.Mesh(txBodyGeo, materials.metalMaterial || new THREE.MeshStandardMaterial({color: 0x444444}));
    txGroup.add(txBody);

    const txLensGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.2, 32);
    const txLens = new THREE.Mesh(txLensGeo, materials.glassMaterial || new THREE.MeshStandardMaterial({color: 0x88ccff, transparent: true, opacity: 0.5}));
    txLens.rotation.x = Math.PI / 2;
    txLens.position.set(0, 0, 1.1);
    txGroup.add(txLens);
    group.add(txGroup);

    const rxGroup = new THREE.Group();
    rxGroup.position.set(5, 0, 0);
    rxGroup.rotation.y = Math.PI;

    const rxBodyGeo = new THREE.BoxGeometry(1.5, 1.5, 2);
    const rxBody = new THREE.Mesh(rxBodyGeo, materials.metalMaterial || new THREE.MeshStandardMaterial({color: 0x444444}));
    rxGroup.add(rxBody);

    const rxLensGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.2, 32);
    const rxLens = new THREE.Mesh(rxLensGeo, materials.glassMaterial || new THREE.MeshStandardMaterial({color: 0x88ccff, transparent: true, opacity: 0.5}));
    rxLens.rotation.x = Math.PI / 2;
    rxLens.position.set(0, 0, 1.1);
    rxGroup.add(rxLens);
    group.add(rxGroup);

    const beamGeo = new THREE.CylinderGeometry(0.2, 0.2, 10, 16);
    beamGeo.translate(0, 5, 0);
    const beam = new THREE.Mesh(beamGeo, new THREE.MeshBasicMaterial({color: 0xffaa00, transparent: true, opacity: 0.8}));
    beam.name = "OpticalBeam";
    beam.position.set(-5, 0, 0);
    beam.rotation.z = -Math.PI / 2;
    group.add(beam);

    const opacityTrack = new THREE.NumberKeyframeTrack(
        'OpticalBeam.material.opacity',
        [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
        [0.8, 0.1, 0.9, 0.2, 0.8, 0.1, 1.0, 0.2, 0.9, 0.1, 0.8]
    );

    const txScaleTrack = new THREE.VectorKeyframeTrack(
        'OpticalBeam.scale',
        [0, 0.5, 1.0],
        [1, 1, 1,  1.2, 1, 1.2,  1, 1, 1]
    );

    const clip = new THREE.AnimationClip('TransmitData', 1, [opacityTrack, txScaleTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
