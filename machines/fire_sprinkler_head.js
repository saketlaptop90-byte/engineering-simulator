import { brass, redAccent, blueAccent } from '../utils/materials.js';

export function createFireSprinklerHead(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const baseGeom = new THREE.CylinderGeometry(0.5, 0.5, 0.8, 16);
    const base = new THREE.Mesh(baseGeom, brass);
    base.position.y = 0.4;
    group.add(base);

    const frameGeom = new THREE.CylinderGeometry(0.1, 0.1, 1.2, 8);
    const arm1 = new THREE.Mesh(frameGeom, brass);
    arm1.position.set(0.4, -0.2, 0);
    arm1.rotation.z = Math.PI / 8;
    const arm2 = new THREE.Mesh(frameGeom, brass);
    arm2.position.set(-0.4, -0.2, 0);
    arm2.rotation.z = -Math.PI / 8;
    group.add(arm1);
    group.add(arm2);

    const defGeom = new THREE.CylinderGeometry(0.6, 0.6, 0.05, 16);
    const deflector = new THREE.Mesh(defGeom, brass);
    deflector.position.y = -0.8;
    group.add(deflector);

    const bulbGeom = new THREE.CapsuleGeometry(0.12, 0.5, 8, 16);
    const bulb = new THREE.Mesh(bulbGeom, redAccent);
    bulb.position.y = -0.2;
    bulb.name = "SprinklerBulb";
    group.add(bulb);

    const waterGeom = new THREE.ConeGeometry(1.5, 3, 16);
    const water = new THREE.Mesh(waterGeom, blueAccent);
    water.position.y = -2;
    water.name = "WaterSpray";
    water.scale.set(0.01, 0.01, 0.01);
    group.add(water);

    const bulbScale = new THREE.VectorKeyframeTrack('SprinklerBulb.scale', [0, 0.5, 0.6], [1,1,1, 1,1,1, 0.01,0.01,0.01]);
    const waterScale = new THREE.VectorKeyframeTrack('WaterSpray.scale', [0.6, 1.0], [0.01,0.01,0.01, 1,1,1]);
    
    const clip = new THREE.AnimationClip('ActivateSprinkler', 2, [bulbScale, waterScale]);
    animationClips.push(clip);

    return { group, animationClips };
}
