import * as materials from '../utils/materials.js';

export function createPneumaticValvePositioner(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Main pipe
    const pipeGeo = new THREE.CylinderGeometry(1, 1, 6, 16);
    pipeGeo.rotateZ(Math.PI / 2);
    const pipe = new THREE.Mesh(pipeGeo, materials.castIron);
    group.add(pipe);

    // Valve body
    const bodyGeo = new THREE.SphereGeometry(1.5, 16, 16);
    const body = new THREE.Mesh(bodyGeo, materials.castIron);
    group.add(body);

    // Stem and actuator housing
    const stemGeo = new THREE.CylinderGeometry(0.2, 0.2, 3, 16);
    const stem = new THREE.Mesh(stemGeo, materials.steel);
    stem.position.y = 2.5;
    group.add(stem);

    const housingGeo = new THREE.CylinderGeometry(1.5, 1.5, 1.5, 16);
    const housing = new THREE.Mesh(housingGeo, materials.bluePaint || materials.steel);
    housing.position.y = 4.5;
    group.add(housing);

    // Positioner unit
    const positionerGeo = new THREE.BoxGeometry(1, 1.5, 1);
    const positioner = new THREE.Mesh(positionerGeo, materials.yellowAccent || materials.brass);
    positioner.position.set(1.5, 3, 0);
    group.add(positioner);

    // Air tubes
    const tubeGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.5, 8);
    tubeGeo.rotateZ(Math.PI / 4);
    const tube = new THREE.Mesh(tubeGeo, materials.rubber || materials.darkSteel);
    tube.position.set(1, 4, 0);
    group.add(tube);

    // Animation: Stem moving up and down
    stem.name = "ValveStem";
    const times = [0, 2, 4];
    const stemTrack = new THREE.VectorKeyframeTrack(
        `ValveStem.position`,
        times,
        [0, 2.5, 0, 0, 3.2, 0, 0, 2.5, 0]
    );

    const clip = new THREE.AnimationClip('OperateValve', 4, [stemTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
