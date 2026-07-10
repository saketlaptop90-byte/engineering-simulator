export function createPetCtScanner(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Scanner Ring
    const ringGeo = new THREE.TorusGeometry(1.5, 0.5, 16, 100);
    const ringMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.y = 1.5;
    group.add(ring);

    // Base of scanner
    const baseGeo = new THREE.BoxGeometry(3.5, 1, 1.5);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0xcccccc });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 0.5;
    group.add(base);

    // Patient Bed
    const bedGroup = new THREE.Group();
    const bedGeo = new THREE.BoxGeometry(0.8, 0.1, 3);
    const bedMat = new THREE.MeshStandardMaterial({ color: 0x444455 });
    const bed = new THREE.Mesh(bedGeo, bedMat);
    bed.position.y = 1;
    bedGroup.add(bed);
    
    // Bed Base
    const bedBaseGeo = new THREE.BoxGeometry(0.6, 0.9, 1);
    const bedBase = new THREE.Mesh(bedBaseGeo, baseMat);
    bedBase.position.set(0, 0.45, 2);
    group.add(bedBase);

    group.add(bedGroup);

    // Animation: bed moving in and out
    const times = [0, 2, 4];
    const values = [0, 0, 2,  0, 0, -1,  0, 0, 2];
    const trackName = bedGroup.uuid + '.position';
    const posTrack = new THREE.VectorKeyframeTrack(trackName, times, values);
    const clip = new THREE.AnimationClip('BedSlide', 4, [posTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
