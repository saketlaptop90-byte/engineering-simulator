import { darkSteel, brass, glass, paintedMetal } from '../utils/materials.js';

export function createSubmersible(THREE) {
    const group = new THREE.Group();

    // Main Body
    const bodyGeo = new THREE.BoxGeometry(4, 3, 3);
    const body = new THREE.Mesh(bodyGeo, paintedMetal);
    group.add(body);

    // Front Glass Dome
    const domeGeo = new THREE.SphereGeometry(1.5, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    domeGeo.rotateZ(Math.PI / 2);
    const dome = new THREE.Mesh(domeGeo, glass);
    dome.position.set(2, 0, 0);
    group.add(dome);

    // Top Equipment Rack
    const rackGeo = new THREE.BoxGeometry(3, 0.5, 2);
    const rack = new THREE.Mesh(rackGeo, darkSteel);
    rack.position.set(0, 1.75, 0);
    group.add(rack);

    // Thrusters
    const thrusters = [];
    const thrusterPositions = [
        [-2, 0, 1.8], [-2, 0, -1.8], // rear side thrusters
        [0, -1.8, 1.2], [0, -1.8, -1.2], // bottom vertical thrusters
        [1, 1.8, 1.2], [1, 1.8, -1.2] // top vertical thrusters
    ];

    thrusterPositions.forEach((pos, idx) => {
        const tGroup = new THREE.Group();
        tGroup.position.set(...pos);

        const casing = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.8, 16), darkSteel);
        if (idx < 2) casing.rotation.z = Math.PI / 2; // rear pushers

        const prop = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.1, 0.2), brass);
        if (idx < 2) prop.rotation.z = Math.PI / 2; // rear pushers
        
        tGroup.add(casing);
        tGroup.add(prop);
        group.add(tGroup);
        thrusters.push({ group: tGroup, prop, idx });
    });

    // Manipulator Arms
    const armGroup1 = new THREE.Group();
    armGroup1.position.set(2, -1, 1);
    const armBase1 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 2), darkSteel);
    armBase1.position.set(1, 0, 0);
    armBase1.rotation.z = Math.PI / 2;
    armGroup1.add(armBase1);
    group.add(armGroup1);

    const armGroup2 = new THREE.Group();
    armGroup2.position.set(2, -1, -1);
    const armBase2 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 2), darkSteel);
    armBase2.position.set(1, 0, 0);
    armBase2.rotation.z = Math.PI / 2;
    armGroup2.add(armBase2);
    group.add(armBase2);

    // Animations
    const tracks = [];
    
    // Thruster animations
    thrusters.forEach(t => {
        const axis = t.idx < 2 ? 'x' : 'y';
        tracks.push(new THREE.NumberKeyframeTrack(
            `${t.prop.uuid}.rotation[${axis}]`,
            [0, 1],
            [0, Math.PI * 2]
        ));
    });

    // Arm animations
    tracks.push(new THREE.NumberKeyframeTrack(
        `${armGroup1.uuid}.rotation[y]`,
        [0, 2, 4],
        [0, Math.PI / 4, 0]
    ));
    tracks.push(new THREE.NumberKeyframeTrack(
        `${armGroup2.uuid}.rotation[y]`,
        [0, 2, 4],
        [0, -Math.PI / 4, 0]
    ));

    const clip = new THREE.AnimationClip('ROVAction', 4, tracks);

    return { group, animationClips: [clip] };
}
