export function createHistologyMicrotome(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base
    const baseGeo = new THREE.BoxGeometry(2, 0.5, 3);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.5 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    group.add(base);

    // Wheel
    const wheelGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.2, 32);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.7 });
    const wheel = new THREE.Mesh(wheelGeo, wheelMat);
    wheel.position.set(1.1, 0.8, 0);
    wheel.rotation.z = Math.PI / 2;
    group.add(wheel);

    // Blade holder
    const holderGeo = new THREE.BoxGeometry(1.5, 0.8, 0.5);
    const holderMat = new THREE.MeshStandardMaterial({ color: 0x999999, metalness: 0.8, roughness: 0.2 });
    const holder = new THREE.Mesh(holderGeo, holderMat);
    holder.position.set(0, 0.65, 1);
    group.add(holder);

    // Animation (Wheel rotation)
    const times = [0, 1, 2];
    const values = [0, Math.PI, 2 * Math.PI];
    const wheelTrack = new THREE.NumberKeyframeTrack('.rotation[x]', times, values);
    const clip = new THREE.AnimationClip('TurnWheel', 2, [wheelTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
