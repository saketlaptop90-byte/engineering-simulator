import { steel, darkSteel, copper, concrete } from '../utils/materials.js';

export function createSluiceGate(THREE) {
    const group = new THREE.Group();
    group.name = 'SluiceGateMechanism';

    // Concrete Walls
    const wallLeftGeo = new THREE.BoxGeometry(2, 8, 4);
    const wallLeft = new THREE.Mesh(wallLeftGeo, concrete);
    wallLeft.position.set(-3, 0, 0);
    group.add(wallLeft);

    const wallRightGeo = new THREE.BoxGeometry(2, 8, 4);
    const wallRight = new THREE.Mesh(wallRightGeo, concrete);
    wallRight.position.set(3, 0, 0);
    group.add(wallRight);

    const baseGeo = new THREE.BoxGeometry(8, 1, 6);
    const base = new THREE.Mesh(baseGeo, concrete);
    base.position.set(0, -4.5, 0);
    group.add(base);

    // The Gate
    const gateGeo = new THREE.BoxGeometry(4.2, 6, 0.5);
    const gate = new THREE.Mesh(gateGeo, darkSteel);
    gate.name = 'GatePanel';
    gate.position.set(0, -1, 0);
    group.add(gate);

    // Lifting Mechanism (Rack and Pinion)
    const rackGeo = new THREE.BoxGeometry(0.2, 8, 0.2);
    const rack1 = new THREE.Mesh(rackGeo, steel);
    rack1.position.set(-1.5, 3, 0);
    gate.add(rack1);

    const rack2 = new THREE.Mesh(rackGeo, steel);
    rack2.position.set(1.5, 3, 0);
    gate.add(rack2);

    const gearGeo = new THREE.CylinderGeometry(0.5, 0.5, 4.5, 16);
    const gearShaft = new THREE.Mesh(gearGeo, copper);
    gearShaft.name = 'GearShaft';
    gearShaft.rotation.z = Math.PI / 2;
    gearShaft.position.set(0, 4.5, 0.3);
    group.add(gearShaft);

    // Water flow indication
    const waterGeo = new THREE.BoxGeometry(4, 3, 3);
    const waterMat = new THREE.MeshBasicMaterial({ color: 0x0088ff, transparent: true, opacity: 0.5 });
    const water = new THREE.Mesh(waterGeo, waterMat);
    water.name = 'FlowingWater';
    water.position.set(0, -3, 2);
    water.scale.y = 0.1;
    group.add(water);

    // Animations
    const openGateClip = new THREE.AnimationClip('OpenGate', 5, [
        new THREE.NumberKeyframeTrack('GatePanel.position[y]', [0, 2.5, 5], [-1, 3, -1]),
        new THREE.NumberKeyframeTrack('GearShaft.rotation[x]', [0, 2.5, 5], [0, Math.PI * 4, 0]),
        new THREE.NumberKeyframeTrack('FlowingWater.scale[y]', [0, 2.5, 5], [0.1, 1, 0.1]),
        new THREE.NumberKeyframeTrack('FlowingWater.position[y]', [0, 2.5, 5], [-3.9, -2.5, -3.9])
    ]);

    return { group, animationClips: [openGateClip] };
}
