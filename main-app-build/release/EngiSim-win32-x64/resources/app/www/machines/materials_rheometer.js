import { getMaterial } from '../utils/materials.js';

export function createRheometer(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base
    const baseGeo = new THREE.BoxGeometry(2, 0.5, 3);
    const baseMat = getMaterial('metal_light', THREE) || new THREE.MeshStandardMaterial({ color: 0xdddddd });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 0.25;
    group.add(base);

    // Stand
    const standGeo = new THREE.BoxGeometry(0.5, 4, 0.5);
    const stand = new THREE.Mesh(standGeo, baseMat);
    stand.position.set(0, 2.5, -1);
    group.add(stand);

    // Head
    const headGeo = new THREE.BoxGeometry(1.5, 1, 2);
    const head = new THREE.Mesh(headGeo, baseMat);
    head.position.set(0, 4, 0);
    group.add(head);

    // Lower Plate
    const lowerPlateGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.2, 32);
    const plateMat = getMaterial('steel', THREE) || new THREE.MeshStandardMaterial({ color: 0xaaaaaa, roughness: 0.2, metalness: 0.8 });
    const lowerPlate = new THREE.Mesh(lowerPlateGeo, plateMat);
    lowerPlate.position.set(0, 0.6, 0.5);
    group.add(lowerPlate);

    // Upper Plate / Bob
    const upperPlateGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.2, 32);
    const upperPlate = new THREE.Mesh(upperPlateGeo, plateMat);
    upperPlate.position.set(0, 1.2, 0.5);
    upperPlate.name = 'UpperPlate';
    group.add(upperPlate);

    // Spindle shaft
    const shaftGeo = new THREE.CylinderGeometry(0.1, 0.1, 2.5, 16);
    const shaft = new THREE.Mesh(shaftGeo, plateMat);
    shaft.position.set(0, 2.5, 0.5);
    shaft.name = 'Shaft';
    group.add(shaft);

    // Sample material
    const sampleGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.4, 32);
    const sampleMat = getMaterial('fluid_viscous', THREE) || new THREE.MeshPhysicalMaterial({ color: 0x0055ff, transmission: 0.5, opacity: 0.8, transparent: true });
    const sample = new THREE.Mesh(sampleGeo, sampleMat);
    sample.position.set(0, 0.9, 0.5);
    sample.name = 'SampleFluid';
    group.add(sample);

    // Animation: Rotation and oscillation
    const times = [0, 1, 2, 3, 4];
    
    // Creating quaternions for rotation
    const q0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 1.5);
    const q4 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 2);

    const values = [
        ...q0.toArray(),
        ...q1.toArray(),
        ...q2.toArray(),
        ...q3.toArray(),
        ...q4.toArray()
    ];

    const plateTrack = new THREE.QuaternionKeyframeTrack(`${upperPlate.name}.quaternion`, times, values);
    const shaftTrack = new THREE.QuaternionKeyframeTrack(`${shaft.name}.quaternion`, times, values);
    
    // Sample deformation (twisting visual via scale as approximation)
    const sampleScaleValues = [
        1, 1, 1,
        1.05, 0.9, 1.05,
        1, 1, 1,
        1.05, 0.9, 1.05,
        1, 1, 1
    ];
    const sampleScaleTrack = new THREE.VectorKeyframeTrack(`${sample.name}.scale`, times, sampleScaleValues);

    const clip = new THREE.AnimationClip('RheometerShear', 4, [plateTrack, shaftTrack, sampleScaleTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
