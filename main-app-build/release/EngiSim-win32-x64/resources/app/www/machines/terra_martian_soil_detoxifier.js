import { darkSteel, aluminum, glass } from '../utils/materials.js';

export function createMartianSoilDetoxifier(THREE) {
    const group = new THREE.Group();
    group.name = 'Martian Soil Detoxifier';

    // Base Vehicle
    const baseGeom = new THREE.BoxGeometry(6, 2, 10);
    const base = new THREE.Mesh(baseGeom, darkSteel);
    base.position.y = 1;
    group.add(base);

    // Drill Component
    const drillGroup = new THREE.Group();
    drillGroup.name = 'DrillAssembly';
    drillGroup.position.set(0, 1, 5);

    const drillArmGeom = new THREE.CylinderGeometry(0.5, 0.5, 4);
    const drillArm = new THREE.Mesh(drillArmGeom, aluminum);
    drillArm.rotation.x = Math.PI / 2;
    drillArm.position.z = 2;
    drillGroup.add(drillArm);

    const drillBitGeom = new THREE.ConeGeometry(1, 3, 8);
    const drillBit = new THREE.Mesh(drillBitGeom, darkSteel);
    drillBit.rotation.x = -Math.PI / 2;
    drillBit.position.z = 4.5;
    drillBit.name = 'DrillBit';
    drillGroup.add(drillBit);

    group.add(drillGroup);

    // Toxin separator tank
    const tankGeom = new THREE.CylinderGeometry(1.5, 1.5, 4, 16);
    const tank = new THREE.Mesh(tankGeom, glass);
    tank.position.set(0, 4, -2);
    tank.rotation.z = Math.PI / 2;
    group.add(tank);

    // Animation: Drill rotating and moving
    const times = [0, 2, 4];
    const rotateValues = [0, Math.PI * 10, Math.PI * 20];
    const rotateTrack = new THREE.NumberKeyframeTrack('DrillBit.rotation[z]', times, rotateValues);

    const moveValues = [0, 1, 5, 0, -1, 5, 0, 1, 5];
    const moveTrack = new THREE.VectorKeyframeTrack('DrillAssembly.position', times, moveValues);

    const clip = new THREE.AnimationClip('Detoxify', 4, [rotateTrack, moveTrack]);

    return { group, animationClips: [clip] };
}
