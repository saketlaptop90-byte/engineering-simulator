import { aluminum, carbonFiber, chrome, glass, steel } from '../utils/materials.js';

export function createCentrifugeAccommodationModule(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Central Hub
    const hubGeo = new THREE.CylinderGeometry(5, 5, 30, 32);
    const hub = new THREE.Mesh(hubGeo, steel);
    group.add(hub);

    // Rotating Section
    const rotatingGroup = new THREE.Group();
    group.add(rotatingGroup);

    // Rotating Hub Ring
    const ringGeo = new THREE.TorusGeometry(6, 1.5, 16, 32);
    const ring = new THREE.Mesh(ringGeo, chrome);
    ring.rotation.x = Math.PI / 2;
    rotatingGroup.add(ring);

    // Truss Arms
    const armCount = 4;
    const armLength = 40;
    for (let i = 0; i < armCount; i++) {
        const armGroup = new THREE.Group();
        armGroup.rotation.y = (i * Math.PI * 2) / armCount;

        // Arm structure
        const armGeo = new THREE.CylinderGeometry(1, 1, armLength, 16);
        const arm = new THREE.Mesh(armGeo, carbonFiber);
        arm.rotation.z = Math.PI / 2;
        arm.position.x = armLength / 2 + 5;
        armGroup.add(arm);

        // Habitat Pod at the end of the arm
        const podGeo = new THREE.CapsuleGeometry(4, 10, 16, 32);
        const pod = new THREE.Mesh(podGeo, aluminum);
        pod.rotation.z = Math.PI / 2;
        pod.position.x = armLength + 5;
        
        // Window on pod
        const windowGeo = new THREE.PlaneGeometry(8, 3);
        const windowMesh = new THREE.Mesh(windowGeo, glass);
        windowMesh.position.set(armLength + 5, 4.1, 0);
        windowMesh.rotation.x = -Math.PI / 2;
        
        armGroup.add(pod);
        armGroup.add(windowMesh);

        rotatingGroup.add(armGroup);
    }

    // Animation: Centrifuge Rotation
    const rotationTrack = new THREE.NumberKeyframeTrack(`${rotatingGroup.uuid}.rotation[y]`, [0, 8], [0, Math.PI * 2]);
    const rotationClip = new THREE.AnimationClip('Spin', 8, [rotationTrack]);
    animationClips.push(rotationClip);

    return { group, animationClips };
}
