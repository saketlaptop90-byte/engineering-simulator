import { blackPlastic, aluminum, glass, wood } from '../utils/materials.js';

export function createFlashbulbSynchronizer(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Flash Handle
    const handleGeom = new THREE.CylinderGeometry(0.15, 0.15, 2, 16);
    const handle = new THREE.Mesh(handleGeom, aluminum);
    handle.position.set(0, -1, 0);
    group.add(handle);

    // Reflector
    const reflectorGeom = new THREE.SphereGeometry(1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const reflector = new THREE.Mesh(reflectorGeom, aluminum);
    reflector.rotation.x = -Math.PI / 2;
    reflector.position.set(0, 0, -0.2);
    group.add(reflector);

    // Flash Bulb
    const bulbGeom = new THREE.SphereGeometry(0.3, 16, 16);
    const bulbMat = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.8, emissive: 0x000000 });
    const bulb = new THREE.Mesh(bulbGeom, bulbMat);
    bulb.position.set(0, 0, 0);
    group.add(bulb);

    // Sync Cord
    const cordCurve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(0, -1, 0),
        new THREE.Vector3(-1, -2, 1),
        new THREE.Vector3(-2, -0.5, 1)
    );
    const cordGeom = new THREE.TubeGeometry(cordCurve, 20, 0.05, 8, false);
    const cord = new THREE.Mesh(cordGeom, blackPlastic);
    group.add(cord);

    // Camera Connector
    const connGeom = new THREE.BoxGeometry(0.2, 0.2, 0.4);
    const connector = new THREE.Mesh(connGeom, aluminum);
    connector.position.set(-2, -0.5, 1.2);
    group.add(connector);

    // Animation: Flash firing
    const times = [0, 0.5, 0.55, 0.7, 2];
    const emissiveColors = [
        0, 0, 0,
        0, 0, 0,
        1, 1, 1, // Flash!
        0.2, 0.2, 0.2,
        0, 0, 0
    ];

    const flashTrack = new THREE.ColorKeyframeTrack(`${bulb.uuid}.material.emissive`, times, emissiveColors);
    
    const clip = new THREE.AnimationClip('FlashFire', 2, [flashTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
