import { darkSteel, titanium, copper, gold } from '../utils/materials.js';

export function createGravitonTorpedoLauncher(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base Mounting
    const mountGeometry = new THREE.BoxGeometry(4, 2, 4);
    const mount = new THREE.Mesh(mountGeometry, darkSteel);
    group.add(mount);

    // Tubes
    const tubeGeometry = new THREE.CylinderGeometry(1, 1, 8, 32);
    const tubeGroup = new THREE.Group();
    tubeGroup.position.y = 2;
    tubeGroup.name = 'TubeGroup';
    group.add(tubeGroup);

    const tubeLeft = new THREE.Mesh(tubeGeometry, titanium);
    tubeLeft.rotation.x = Math.PI / 2;
    tubeLeft.position.set(-1.5, 0, 0);
    tubeGroup.add(tubeLeft);

    const tubeRight = new THREE.Mesh(tubeGeometry, titanium);
    tubeRight.rotation.x = Math.PI / 2;
    tubeRight.position.set(1.5, 0, 0);
    tubeGroup.add(tubeRight);

    // Torpedo (Hidden inside initially)
    const torpedoGeometry = new THREE.CapsuleGeometry(0.8, 3, 16, 16);
    const torpedoMaterial = new THREE.MeshStandardMaterial({ color: 0x222222, emissive: 0x5500ff, emissiveIntensity: 2 });
    const torpedoLeft = new THREE.Mesh(torpedoGeometry, torpedoMaterial);
    torpedoLeft.rotation.x = Math.PI / 2;
    torpedoLeft.position.set(-1.5, 0, 0);
    torpedoLeft.name = 'TorpedoLeft';
    tubeGroup.add(torpedoLeft);

    const torpedoRight = new THREE.Mesh(torpedoGeometry, torpedoMaterial);
    torpedoRight.rotation.x = Math.PI / 2;
    torpedoRight.position.set(1.5, 0, 0);
    torpedoRight.name = 'TorpedoRight';
    tubeGroup.add(torpedoRight);

    // Launch animation Left
    const posLeft = new THREE.VectorKeyframeTrack('TorpedoLeft.position', [0, 1, 2], [-1.5, 0, 0, -1.5, 0, 20, -1.5, 0, 0]);
    const scaleLeft = new THREE.VectorKeyframeTrack('TorpedoLeft.scale', [0, 1, 1.01, 2], [1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1]);
    const launchLeftClip = new THREE.AnimationClip('LaunchLeft', 2, [posLeft, scaleLeft]);
    animationClips.push(launchLeftClip);

    // Launch animation Right
    const posRight = new THREE.VectorKeyframeTrack('TorpedoRight.position', [0, 1, 2], [1.5, 0, 0, 1.5, 0, 20, 1.5, 0, 0]);
    const scaleRight = new THREE.VectorKeyframeTrack('TorpedoRight.scale', [0, 1, 1.01, 2], [1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1]);
    const launchRightClip = new THREE.AnimationClip('LaunchRight', 2, [posRight, scaleRight]);
    animationClips.push(launchRightClip);

    // Recoil
    const recoilTrack = new THREE.VectorKeyframeTrack('TubeGroup.position', [0, 0.2, 1], [0, 2, 0, 0, 2, -1, 0, 2, 0]);
    const recoilClip = new THREE.AnimationClip('LauncherRecoil', 1, [recoilTrack]);
    animationClips.push(recoilClip);

    return { group, animationClips };
}
