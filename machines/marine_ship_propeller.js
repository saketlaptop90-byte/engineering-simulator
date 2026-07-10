import * as materials from '../utils/materials.js';

export function createShipPropellerShaft(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Long drive shaft
    const shaftGeo = new THREE.CylinderGeometry(0.5, 0.5, 8, 32);
    shaftGeo.rotateZ(Math.PI / 2);
    const shaft = new THREE.Mesh(shaftGeo, materials.steel);
    shaft.name = "PropellerShaft";
    group.add(shaft);

    // Propeller Hub
    const hubGeo = new THREE.CylinderGeometry(0.8, 1, 1.5, 32);
    hubGeo.rotateZ(Math.PI / 2);
    const hub = new THREE.Mesh(hubGeo, materials.brass);
    hub.position.set(4, 0, 0);
    shaft.add(hub);

    // Blades
    const bladeGeo = new THREE.BoxGeometry(0.2, 3, 1.5);
    // Skew the blade to look like a propeller
    const positionAttribute = bladeGeo.attributes.position;
    for (let i = 0; i < positionAttribute.count; i++) {
        const y = positionAttribute.getY(i);
        if (y > 0) {
            positionAttribute.setZ(i, positionAttribute.getZ(i) + 0.5);
            positionAttribute.setX(i, positionAttribute.getX(i) + 0.5);
        } else {
            positionAttribute.setZ(i, positionAttribute.getZ(i) - 0.5);
            positionAttribute.setX(i, positionAttribute.getX(i) - 0.5);
        }
    }
    bladeGeo.computeVertexNormals();

    const numBlades = 5;
    for (let i = 0; i < numBlades; i++) {
        const angle = (i / numBlades) * Math.PI * 2;
        const blade = new THREE.Mesh(bladeGeo, materials.brass);
        blade.position.set(0, Math.cos(angle) * 1.5, Math.sin(angle) * 1.5);
        blade.rotation.x = angle;
        hub.add(blade);
    }

    // Support bearings
    const bearingGeo = new THREE.TorusGeometry(0.8, 0.3, 16, 32);
    bearingGeo.rotateY(Math.PI / 2);
    const bearing1 = new THREE.Mesh(bearingGeo, materials.castIron);
    bearing1.position.set(-2, 0, 0);
    group.add(bearing1);
    
    const bearing2 = new THREE.Mesh(bearingGeo, materials.castIron);
    bearing2.position.set(2, 0, 0);
    group.add(bearing2);

    // Base mounts for bearings
    const mountGeo = new THREE.BoxGeometry(1, 1.5, 2);
    const mount1 = new THREE.Mesh(mountGeo, materials.darkSteel || materials.castIron);
    mount1.position.set(-2, -1.5, 0);
    group.add(mount1);
    
    const mount2 = new THREE.Mesh(mountGeo, materials.darkSteel || materials.castIron);
    mount2.position.set(2, -1.5, 0);
    group.add(mount2);

    // Animation: Continuous rotation
    const times = [0, 1, 2];
    const xAxis = new THREE.Vector3(1, 0, 0);
    const q1 = new THREE.Quaternion().setFromAxisAngle(xAxis, 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(xAxis, Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(xAxis, Math.PI * 2);

    const spinTrack = new THREE.QuaternionKeyframeTrack(
        `PropellerShaft.quaternion`,
        times,
        [q1.x, q1.y, q1.z, q1.w, q2.x, q2.y, q2.z, q2.w, q3.x, q3.y, q3.z, q3.w]
    );

    const clip = new THREE.AnimationClip('SpinPropeller', 2, [spinTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
