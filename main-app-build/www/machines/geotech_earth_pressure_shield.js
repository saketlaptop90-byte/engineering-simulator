import { materials } from '../utils/materials.js';

export function createEarthPressureBalanceShield(THREE) {
    const group = new THREE.Group();
    group.name = "EarthPressureShield";
    const animationClips = [];

    // Main body (Cylinder)
    const bodyGeo = new THREE.CylinderGeometry(4, 4, 12, 32);
    const body = new THREE.Mesh(bodyGeo, materials.metal);
    body.rotation.z = Math.PI / 2; // Horizontal
    body.position.y = 4;
    group.add(body);

    // Cutter head
    const cutterGroup = new THREE.Group();
    cutterGroup.name = "CutterGroup";
    cutterGroup.position.set(6, 4, 0);
    
    const cutterBaseGeo = new THREE.CylinderGeometry(4.1, 4.1, 0.5, 32);
    const cutterBase = new THREE.Mesh(cutterBaseGeo, materials.darkMetal);
    cutterBase.rotation.z = Math.PI / 2;
    cutterGroup.add(cutterBase);

    // Cutter spokes
    for (let i = 0; i < 4; i++) {
        const spokeGeo = new THREE.BoxGeometry(0.6, 8, 0.4);
        const spoke = new THREE.Mesh(spokeGeo, materials.yellowMetal);
        spoke.rotation.x = i * (Math.PI / 4);
        cutterGroup.add(spoke);
    }

    group.add(cutterGroup);

    // Screw conveyor
    const conveyorGeo = new THREE.CylinderGeometry(0.8, 0.8, 8, 16);
    const conveyor = new THREE.Mesh(conveyorGeo, materials.metal);
    conveyor.rotation.z = Math.PI / 2.2;
    conveyor.position.set(-2, 2, 0);
    group.add(conveyor);

    // Animation: Cutter head rotation
    const duration = 10;
    
    const rotationTimes = [0, duration];
    const rotValues = [0, Math.PI * 10];
    const rotTrack = new THREE.NumberKeyframeTrack("CutterGroup.rotation[x]", rotationTimes, rotValues);

    const digClip = new THREE.AnimationClip("Dig", duration, [rotTrack]);
    animationClips.push(digClip);

    return { group, animationClips };
}
