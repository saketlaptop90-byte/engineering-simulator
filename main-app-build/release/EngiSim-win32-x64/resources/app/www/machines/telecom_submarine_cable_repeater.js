import * as materials from '../utils/materials.js';

export function createSubmarineCableRepeater(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Main cylindrical housing
    const housingGeo = new THREE.CylinderGeometry(0.8, 0.8, 6, 32);
    const housing = new THREE.Mesh(housingGeo, materials.copper);
    housing.rotation.z = Math.PI / 2;
    group.add(housing);

    // End cones (Jointing chambers)
    const coneGeo = new THREE.CylinderGeometry(0.3, 0.8, 1.5, 32);
    const leftCone = new THREE.Mesh(coneGeo, materials.steel);
    leftCone.rotation.z = -Math.PI / 2;
    leftCone.position.x = -3.75;
    group.add(leftCone);

    const rightCone = new THREE.Mesh(coneGeo, materials.steel);
    rightCone.rotation.z = Math.PI / 2;
    rightCone.position.x = 3.75;
    group.add(rightCone);

    // Articulated Cable Strain Reliefs
    const leftCableGroup = new THREE.Group();
    leftCableGroup.position.x = -4.5;
    group.add(leftCableGroup);

    const rightCableGroup = new THREE.Group();
    rightCableGroup.position.x = 4.5;
    group.add(rightCableGroup);

    const segmentCount = 6;
    const segmentGeo = new THREE.CylinderGeometry(0.35, 0.3, 0.5, 16);
    
    const leftJoints = [];
    const rightJoints = [];

    let currentLeft = leftCableGroup;
    let currentRight = rightCableGroup;

    for (let i = 0; i < segmentCount; i++) {
        // Left side
        const leftJoint = new THREE.Group();
        leftJoint.position.x = -0.4;
        currentLeft.add(leftJoint);
        const lSeg = new THREE.Mesh(segmentGeo, materials.blackPlastic);
        lSeg.rotation.z = -Math.PI / 2;
        lSeg.position.x = -0.25;
        leftJoint.add(lSeg);
        leftJoints.push(leftJoint);
        currentLeft = leftJoint;

        // Right side
        const rightJoint = new THREE.Group();
        rightJoint.position.x = 0.4;
        currentRight.add(rightJoint);
        const rSeg = new THREE.Mesh(segmentGeo, materials.blackPlastic);
        rSeg.rotation.z = Math.PI / 2;
        rSeg.position.x = 0.25;
        rightJoint.add(rSeg);
        rightJoints.push(rightJoint);
        currentRight = rightJoint;
    }

    const tracks = [];
    const times = [0, 2, 4, 6, 8];
    
    leftJoints.forEach((joint, idx) => {
        const delay = idx * 0.2;
        const maxBend = 0.1;
        const values = [
            0,
            Math.sin(2 - delay) * maxBend,
            Math.sin(4 - delay) * maxBend,
            Math.sin(6 - delay) * maxBend,
            0
        ];
        tracks.push(new THREE.NumberKeyframeTrack(`${joint.uuid}.rotation[z]`, times, values));
    });

    rightJoints.forEach((joint, idx) => {
        const delay = idx * 0.2;
        const maxBend = 0.1;
        const values = [
            0,
            Math.sin(2 - delay) * maxBend,
            Math.sin(4 - delay) * maxBend,
            Math.sin(6 - delay) * maxBend,
            0
        ];
        tracks.push(new THREE.NumberKeyframeTrack(`${joint.uuid}.rotation[z]`, times, values));
    });

    const clip = new THREE.AnimationClip('OceanCurrents', 8, tracks);
    animationClips.push(clip);

    return { group, animationClips };
}
