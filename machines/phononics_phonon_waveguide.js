export function createPhononWaveguide(THREE) {
    const group = new THREE.Group();
    const material = new THREE.MeshStandardMaterial({ color: 0x44cc44, transparent: true, opacity: 0.8 });
    const blockGeo = new THREE.BoxGeometry(10, 1, 4);
    const base = new THREE.Mesh(blockGeo, material);
    group.add(base);

    const defectMat = new THREE.MeshStandardMaterial({ color: 0xffaa00 });
    const defectGeo = new THREE.BoxGeometry(10, 1.1, 0.5);
    const defect = new THREE.Mesh(defectGeo, defectMat);
    group.add(defect);

    const animationClips = [];
    const times = [0, 1, 2];
    const values = [1, 1, 1, 1.1, 1.1, 1.1, 1, 1, 1];
    const track = new THREE.VectorKeyframeTrack('.scale', times, values);
    const clip = new THREE.AnimationClip('pulse', 2, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
