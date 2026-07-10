import { materials as sharedMaterials } from '../utils/materials.js';

export function createXRayDiffractometer(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const materials = sharedMaterials || {
        metal: new THREE.MeshStandardMaterial({ color: 0xd0d0d0, metalness: 0.6, roughness: 0.3 }),
        darkMetal: new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.8, roughness: 0.5 }),
        glass: new THREE.MeshPhysicalMaterial({ color: 0x222222, transmission: 0.8, opacity: 1, transparent: true }),
        accent: new THREE.MeshStandardMaterial({ color: 0xaa0000 })
    };

    // Enclosure
    const enclosureGeo = new THREE.BoxGeometry(4, 3, 3);
    const enclosureMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, transparent: true, opacity: 0.2 });
    const enclosure = new THREE.Mesh(enclosureGeo, enclosureMat); // Make it semi-transparent so we can see inside
    enclosure.position.set(0, 1.5, 0);
    group.add(enclosure);

    // Goniometer Base
    const goniometerBaseGeo = new THREE.CylinderGeometry(0.8, 1.0, 0.5, 32);
    const goniometerBase = new THREE.Mesh(goniometerBaseGeo, materials.darkMetal);
    goniometerBase.position.set(0, 0.25, 0);
    group.add(goniometerBase);

    // Sample Stage
    const stageGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 32);
    const stage = new THREE.Mesh(stageGeo, materials.metal);
    stage.position.set(0, 1.5, 0);
    stage.rotation.x = Math.PI / 2; // Facing front
    group.add(stage);

    // Arms
    const sourceArmGroup = new THREE.Group();
    sourceArmGroup.position.set(0, 1.5, 0);
    
    const detectorArmGroup = new THREE.Group();
    detectorArmGroup.position.set(0, 1.5, 0);

    const armGeo = new THREE.BoxGeometry(0.1, 1.2, 0.2);
    
    const sourceArm = new THREE.Mesh(armGeo, materials.metal);
    sourceArm.position.set(0, 0.6, 0);
    sourceArmGroup.add(sourceArm);

    const sourceTubeGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.6, 16);
    const sourceTube = new THREE.Mesh(sourceTubeGeo, materials.accent);
    sourceTube.position.set(0, 1.2, 0);
    sourceTube.rotation.z = Math.PI / 2;
    sourceArmGroup.add(sourceTube);

    const detectorArm = new THREE.Mesh(armGeo, materials.metal);
    detectorArm.position.set(0, 0.6, 0);
    detectorArmGroup.add(detectorArm);

    const detectorGeo = new THREE.BoxGeometry(0.3, 0.4, 0.3);
    const detector = new THREE.Mesh(detectorGeo, materials.darkMetal);
    detector.position.set(0, 1.2, 0);
    detectorArmGroup.add(detector);

    group.add(sourceArmGroup);
    group.add(detectorArmGroup);

    // Initial rotations
    sourceArmGroup.rotation.z = -Math.PI / 4;
    detectorArmGroup.rotation.z = Math.PI / 4;

    // Animation (Theta - 2Theta scan)
    const times = [0, 5, 6, 10];
    const sourceTrack = new THREE.NumberKeyframeTrack(
        sourceArmGroup.uuid + '.rotation[z]',
        times,
        [
            -Math.PI / 8, -Math.PI / 2, -Math.PI / 2, -Math.PI / 8
        ]
    );

    const detectorTrack = new THREE.NumberKeyframeTrack(
        detectorArmGroup.uuid + '.rotation[z]',
        times,
        [
            Math.PI / 8, Math.PI / 2, Math.PI / 2, Math.PI / 8
        ]
    );

    // Stage rotation (theta)
    const stageTrack = new THREE.NumberKeyframeTrack(
        stage.uuid + '.rotation[y]',
        times,
        [
            Math.PI / 8, Math.PI / 2, Math.PI / 2, Math.PI / 8
        ]
    );

    const clip = new THREE.AnimationClip('XRD_Scan', 10, [sourceTrack, detectorTrack, stageTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
