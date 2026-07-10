import * as materials from '../utils/materials.js';

export function createReverseOsmosisFilter(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Main Housing
    const housingGeom = new THREE.CylinderGeometry(1.5, 1.5, 8, 32);
    const housing = new THREE.Mesh(housingGeom, materials.whitePlastic);
    housing.rotation.z = Math.PI / 2;
    group.add(housing);

    // End Caps
    const capGeom = new THREE.CylinderGeometry(1.6, 1.6, 0.5, 32);
    const leftCap = new THREE.Mesh(capGeom, materials.darkSteel);
    leftCap.position.x = -4;
    leftCap.rotation.z = Math.PI / 2;
    group.add(leftCap);

    const rightCap = new THREE.Mesh(capGeom, materials.darkSteel);
    rightCap.position.x = 4;
    rightCap.rotation.z = Math.PI / 2;
    group.add(rightCap);

    // Pump Motor
    const motorGeom = new THREE.CylinderGeometry(0.8, 0.8, 2, 16);
    const motor = new THREE.Mesh(motorGeom, materials.castIron);
    motor.position.set(-5, 0, 0);
    motor.rotation.z = Math.PI / 2;
    group.add(motor);

    // Pump Fan inside motor housing
    const fanGroup = new THREE.Group();
    fanGroup.name = 'ro_fanGroup';
    for (let i = 0; i < 6; i++) {
        const blade = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.1, 0.4), materials.plastic);
        blade.rotation.x = Math.PI / 4;
        blade.rotation.y = (i * Math.PI) / 3;
        fanGroup.add(blade);
    }
    fanGroup.position.set(-5.5, 0, 0);
    fanGroup.rotation.y = Math.PI / 2;
    group.add(fanGroup);

    // Pipes
    const pipeGeom = new THREE.CylinderGeometry(0.3, 0.3, 3, 16);
    const inletPipe = new THREE.Mesh(pipeGeom, materials.steel);
    inletPipe.position.set(-3, 2.5, 0);
    group.add(inletPipe);

    const outletPipe = new THREE.Mesh(pipeGeom, materials.steel);
    outletPipe.position.set(3, -2.5, 0);
    group.add(outletPipe);

    const brinePipe = new THREE.Mesh(pipeGeom, materials.redAccent);
    brinePipe.position.set(3, 0, 2.5);
    brinePipe.rotation.x = Math.PI / 2;
    group.add(brinePipe);
    
    // Pulsing Water Indicator (simulated with a translucent cylinder that scales)
    const waterIndicatorGeom = new THREE.CylinderGeometry(0.35, 0.35, 2.8, 16);
    const waterIndicator = new THREE.Mesh(waterIndicatorGeom, materials.blueAccent);
    waterIndicator.position.copy(inletPipe.position);
    waterIndicator.material = materials.blueAccent.clone();
    waterIndicator.material.transparent = true;
    waterIndicator.material.opacity = 0.6;
    waterIndicator.name = 'ro_waterIndicator';
    group.add(waterIndicator);

    // Animations
    const fanTrack = new THREE.NumberKeyframeTrack(
        `ro_fanGroup.rotation[z]`,
        [0, 1, 2],
        [0, Math.PI * 4, Math.PI * 8]
    );
    
    const pulseTrack = new THREE.VectorKeyframeTrack(
        `ro_waterIndicator.scale`,
        [0, 0.5, 1, 1.5, 2],
        [1, 1, 1,   1.2, 1, 1.2,   1, 1, 1,   1.2, 1, 1.2,   1, 1, 1]
    );

    const clip = new THREE.AnimationClip('RO_Operation', 2, [fanTrack, pulseTrack]);
    animationClips.push(clip);

    group.userData.animatedObjects = [fanGroup, waterIndicator];

    return { group, animationClips };
}
