import { metals, plastics, rubbers } from '../utils/materials.js';

export function createInductiveLoopDetector(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Road surface segment
    const roadGeometry = new THREE.PlaneGeometry(6, 6);
    const road = new THREE.Mesh(roadGeometry, rubbers?.asphalt || new THREE.MeshStandardMaterial({ color: 0x333333 }));
    road.rotation.x = -Math.PI / 2;
    group.add(road);

    // Loop wire cut
    const loopGeometry = new THREE.RingGeometry(1.9, 2, 4);
    const loop = new THREE.Mesh(loopGeometry, metals?.copper || new THREE.MeshBasicMaterial({ color: 0xb87333 }));
    loop.rotation.x = -Math.PI / 2;
    loop.rotation.z = Math.PI / 4;
    loop.position.y = 0.01;
    group.add(loop);

    // Magnetic field visualization (invisible initially)
    const fieldGeometry = new THREE.TorusGeometry(2, 0.2, 16, 100);
    const fieldMaterial = new THREE.MeshBasicMaterial({ color: 0x00aaff, wireframe: true, transparent: true, opacity: 0 });
    const field = new THREE.Mesh(fieldGeometry, fieldMaterial);
    field.rotation.x = -Math.PI / 2;
    field.position.y = 0.5;
    group.add(field);

    // Animation: Vehicle passing over loop (field pulse)
    const times = [0, 1, 1.5, 2, 3];
    const opacityValues = [0, 0, 0.8, 0, 0];
    const scaleValues = [
        1, 1, 1,
        1, 1, 1,
        1.5, 1.5, 1.5,
        1, 1, 1,
        1, 1, 1
    ];

    const opacityTrack = new THREE.NumberKeyframeTrack(`${field.uuid}.material.opacity`, times, opacityValues);
    const scaleTrack = new THREE.VectorKeyframeTrack(`${field.uuid}.scale`, times, scaleValues);

    const clip = new THREE.AnimationClip('DetectVehicle', 3, [opacityTrack, scaleTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
