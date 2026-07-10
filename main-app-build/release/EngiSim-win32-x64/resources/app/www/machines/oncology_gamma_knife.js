export function createGammaKnife(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Main Unit
    const bodyGeo = new THREE.SphereGeometry(1.5, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, side: THREE.DoubleSide });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 1;
    body.rotation.x = Math.PI / 2;
    group.add(body);

    const baseGeo = new THREE.BoxGeometry(3, 1, 3);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0xbbbbbb });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 0.5;
    group.add(base);

    // Patient Bed
    const bedGroup = new THREE.Group();
    const bedGeo = new THREE.BoxGeometry(0.8, 0.1, 2.5);
    const bedMat = new THREE.MeshStandardMaterial({ color: 0x334455 });
    const bed = new THREE.Mesh(bedGeo, bedMat);
    bed.position.y = 1;
    bedGroup.add(bed);

    // Head Frame
    const frameGeo = new THREE.TorusGeometry(0.2, 0.02, 16, 100);
    const frameMat = new THREE.MeshStandardMaterial({ color: 0xc0c0c0 });
    const frame = new THREE.Mesh(frameGeo, frameMat);
    frame.position.set(0, 1.1, -1);
    bedGroup.add(frame);

    group.add(bedGroup);

    // Animation
    const times = [0, 2, 4];
    const values = [0, 0, 2,  0, 0, 0,  0, 0, 2];
    const posTrack = new THREE.VectorKeyframeTrack(bedGroup.uuid + '.position', times, values);
    const clip = new THREE.AnimationClip('GammaKnifeBed', 4, [posTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
