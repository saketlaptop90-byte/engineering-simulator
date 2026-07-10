import * as materials from '../utils/materials.js';

export function createStenterFrame(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const frameMat = materials.frameMaterial || new THREE.MeshStandardMaterial({ color: 0x2d3748 });
    const fabricMat = materials.fabricMaterial || new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide });

    // Chamber
    const chamberGeo = new THREE.BoxGeometry(8, 2, 4);
    const chamber = new THREE.Mesh(chamberGeo, frameMat);
    chamber.position.set(0, 1.5, 0);
    group.add(chamber);

    // Fabric strip (moving through)
    // We'll simulate movement by animating UVs in the application, but we can also animate the physical position of some rollers.
    const fabricGeo = new THREE.PlaneGeometry(12, 3);
    const fabric = new THREE.Mesh(fabricGeo, fabricMat);
    fabric.rotation.x = -Math.PI / 2;
    fabric.position.set(0, 1.5, 0);
    group.add(fabric);

    // Conveyor Rollers
    const rollers = [];
    for (let i = -5; i <= 5; i += 2) {
        const rollerGroup = new THREE.Group();
        rollerGroup.position.set(i, 1.4, 0);
        
        const rollerGeo = new THREE.CylinderGeometry(0.2, 0.2, 3.5, 16);
        const roller = new THREE.Mesh(rollerGeo, materials.rollerMaterial || new THREE.MeshStandardMaterial({color: 0x888888}));
        roller.rotation.x = Math.PI / 2;
        rollerGroup.add(roller);
        
        group.add(rollerGroup);
        rollers.push(rollerGroup);
    }

    // Animation
    const duration = 1;
    const times = [];
    const tracks = [];

    for (let i = 0; i <= 10; i++) {
        times.push((i / 10) * duration);
    }

    rollers.forEach((rollerGroup) => {
        const values = [];
        for (let i = 0; i <= 10; i++) {
            const angle = (i / 10) * Math.PI * 2;
            const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), angle);
            values.push(q.x, q.y, q.z, q.w);
        }
        tracks.push(new THREE.QuaternionKeyframeTrack(`${rollerGroup.uuid}.quaternion`, times, values));
    });

    const clip = new THREE.AnimationClip('StenterConveyor', duration, tracks);
    animationClips.push(clip);

    return { group, animationClips };
}
