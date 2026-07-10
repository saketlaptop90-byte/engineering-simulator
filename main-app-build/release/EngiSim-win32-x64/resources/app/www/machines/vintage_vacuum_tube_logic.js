import { wood, brass, copper, darkSteel, glass } from '../utils/materials.js';

export function createVacuumTubeLogicGate(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base
    const baseGeom = new THREE.CylinderGeometry(1.5, 1.5, 1, 32);
    const base = new THREE.Mesh(baseGeom, darkSteel);
    group.add(base);

    // Pins
    for(let i = 0; i < 8; i++) {
        const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1), brass);
        pin.position.set(Math.cos(i * Math.PI / 4) * 1, -0.5, Math.sin(i * Math.PI / 4) * 1);
        group.add(pin);
    }

    // Glass bulb
    const bulbGeom = new THREE.CapsuleGeometry(1.4, 3, 16, 32);
    const bulbMat = glass.clone();
    bulbMat.transparent = true;
    bulbMat.opacity = 0.3;
    const bulb = new THREE.Mesh(bulbGeom, bulbMat);
    bulb.position.y = 2.5;
    group.add(bulb);

    // Internal structure
    const heaterGeom = new THREE.CylinderGeometry(0.2, 0.2, 2.5);
    const heaterMat = new THREE.MeshBasicMaterial({ color: 0x331100 });
    const heater = new THREE.Mesh(heaterGeom, heaterMat);
    heater.position.y = 2.5;
    group.add(heater);

    const glowGeom = new THREE.CylinderGeometry(0.3, 0.3, 2.6, 16);
    const glowMat = new THREE.MeshBasicMaterial({ color: 0xff6600, transparent: true, opacity: 0.6 });
    const glow = new THREE.Mesh(glowGeom, glowMat);
    glow.position.y = 2.5;
    glow.name = "tube_glow";
    group.add(glow);

    const gridGeom = new THREE.CylinderGeometry(0.5, 0.5, 2, 16, 1, true);
    const gridMat = new THREE.MeshStandardMaterial({ color: 0x888888, wireframe: true });
    const grid = new THREE.Mesh(gridGeom, gridMat);
    grid.position.y = 2.5;
    group.add(grid);

    const plateGeom = new THREE.CylinderGeometry(0.8, 0.8, 1.8, 16, 1, true);
    const plate = new THREE.Mesh(plateGeom, darkSteel);
    plate.position.y = 2.5;
    group.add(plate);

    // Wires inside connecting to base
    for(let i = 0; i < 4; i++) {
        const innerWire = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.5), copper);
        innerWire.position.set(Math.cos(i * Math.PI / 2) * 0.5, 1, Math.sin(i * Math.PI / 2) * 0.5);
        group.add(innerWire);
    }

    // Animation: Heater glowing pulse using scale of the glow mesh
    const track = new THREE.VectorKeyframeTrack(
        `${glow.name}.scale`,
        [0, 1, 2],
        [1, 1, 1,   1.5, 1, 1.5,   1, 1, 1]
    );

    const clip = new THREE.AnimationClip('TubePulse', 2, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
