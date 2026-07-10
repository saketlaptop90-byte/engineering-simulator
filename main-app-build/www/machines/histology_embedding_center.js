export function createHistologyEmbeddingCenter(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Main console
    const consoleGeo = new THREE.BoxGeometry(3, 1, 2);
    const consoleMat = new THREE.MeshStandardMaterial({ color: 0xf0f0f0, roughness: 0.6 });
    const consoleMesh = new THREE.Mesh(consoleGeo, consoleMat);
    group.add(consoleMesh);

    // Wax reservoir
    const reservoirGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.8, 32);
    const reservoirMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 0.2 });
    const reservoir = new THREE.Mesh(reservoirGeo, reservoirMat);
    reservoir.position.set(-0.8, 0.5, -0.4);
    group.add(reservoir);

    // Hot plate
    const plateGeo = new THREE.BoxGeometry(1.2, 0.1, 1);
    const plateMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.9 });
    const plate = new THREE.Mesh(plateGeo, plateMat);
    plate.position.set(0.6, 0.55, 0);
    group.add(plate);

    // Dispenser nozzle
    const nozzleGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.3, 16);
    const nozzleMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8 });
    const nozzle = new THREE.Mesh(nozzleGeo, nozzleMat);
    nozzle.position.set(-0.3, 1.0, 0);
    nozzle.rotation.z = -0.5;
    group.add(nozzle);

    // Animation (Dispensing wax drop scaling)
    const dropGeo = new THREE.SphereGeometry(0.05, 16, 16);
    const dropMat = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });
    const drop = new THREE.Mesh(dropGeo, dropMat);
    drop.position.set(-0.2, 0.8, 0);
    group.add(drop);

    const times = [0, 0.5, 1];
    const values = [1, 1, 1,   2, 2, 2,   0, 0, 0];
    const dropTrack = new THREE.VectorKeyframeTrack('.scale', times, values);
    
    // Drop falling
    const timesPos = [0, 0.5, 1];
    const valuesPos = [-0.2, 0.8, 0,   -0.2, 0.6, 0,   -0.2, 0.55, 0];
    const dropPosTrack = new THREE.VectorKeyframeTrack('.position', timesPos, valuesPos);

    const clip = new THREE.AnimationClip('DispenseWax', 1, [dropTrack, dropPosTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
