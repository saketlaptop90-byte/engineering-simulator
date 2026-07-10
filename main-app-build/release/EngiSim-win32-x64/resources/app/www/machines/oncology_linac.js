export function createLinac(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base
    const baseGeo = new THREE.BoxGeometry(2, 0.5, 2);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x888888 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 0.25;
    group.add(base);

    // Gantry Stand
    const standGeo = new THREE.BoxGeometry(1, 3, 1);
    const standMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
    const stand = new THREE.Mesh(standGeo, standMat);
    stand.position.set(0, 2, -0.5);
    group.add(stand);

    // Rotating Gantry
    const gantryGroup = new THREE.Group();
    gantryGroup.position.set(0, 3, 0);

    const gantryArmGeo = new THREE.CylinderGeometry(0.5, 0.5, 2, 32);
    const gantryArm = new THREE.Mesh(gantryArmGeo, standMat);
    gantryArm.rotation.x = Math.PI / 2;
    gantryGroup.add(gantryArm);

    const headGeo = new THREE.BoxGeometry(0.8, 0.8, 1);
    const headMat = new THREE.MeshStandardMaterial({ color: 0xdddddd });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.set(0, 0, 1.5);
    gantryGroup.add(head);

    group.add(gantryGroup);

    // Patient Table
    const tableGeo = new THREE.BoxGeometry(0.8, 0.1, 2.5);
    const tableMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const table = new THREE.Mesh(tableGeo, tableMat);
    table.position.set(0, 1, 1);
    group.add(table);

    // Animation
    const times = [0, 2, 4];
    const values = [0, 0, 0,  Math.PI, 0, 0,  2 * Math.PI, 0, 0];
    const trackName = gantryGroup.uuid + '.rotation';
    const rotationTrack = new THREE.VectorKeyframeTrack(trackName, times, values);
    const clip = new THREE.AnimationClip('GantryRotation', 4, [rotationTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
