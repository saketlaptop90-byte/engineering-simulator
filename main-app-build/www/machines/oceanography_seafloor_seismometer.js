export function createSeafloorSeismometer(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const housingMat = new THREE.MeshStandardMaterial({ color: 0xdd8800, metalness: 0.3, roughness: 0.7 });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x88ccff, transparent: true, opacity: 0.6, roughness: 0.1 });

    // Glass Sphere
    const sphereGeo = new THREE.SphereGeometry(2, 32, 32);
    const sphere = new THREE.Mesh(sphereGeo, glassMat);
    sphere.position.y = 2;
    group.add(sphere);

    // Internal components
    const coreGeo = new THREE.CylinderGeometry(0.5, 0.5, 1.5, 16);
    const coreMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.9, roughness: 0.2 });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.position.y = 2;
    group.add(core);

    const blinkerGeo = new THREE.SphereGeometry(0.2, 16, 16);
    const blinkerMat = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000 });
    const blinker = new THREE.Mesh(blinkerGeo, blinkerMat);
    blinker.position.set(0, 3, 0);
    blinker.name = 'seismoBlinker';
    group.add(blinker);

    // Base frame
    const frameGeo = new THREE.TorusGeometry(2.2, 0.1, 16, 6);
    frameGeo.rotateX(Math.PI / 2);
    const frame = new THREE.Mesh(frameGeo, housingMat);
    frame.position.y = 0.5;
    group.add(frame);

    const frameGeo2 = new THREE.TorusGeometry(2.2, 0.1, 16, 6);
    frameGeo2.rotateX(Math.PI / 2);
    const frame2 = new THREE.Mesh(frameGeo2, housingMat);
    frame2.position.y = 3.5;
    group.add(frame2);

    // Pillars
    for (let i = 0; i < 6; i++) {
        const pillarGeo = new THREE.CylinderGeometry(0.05, 0.05, 3, 8);
        const pillar = new THREE.Mesh(pillarGeo, housingMat);
        const angle = (i * Math.PI * 2) / 6;
        pillar.position.set(Math.cos(angle) * 2.2, 2, Math.sin(angle) * 2.2);
        group.add(pillar);
    }

    // Blinking animation
    const blinkTrack = new THREE.ColorKeyframeTrack(
        'seismoBlinker.material.emissive',
        [0, 0.5, 1],
        [1, 0, 0, 0, 0, 0, 1, 0, 0] // RGB values for red, black, red
    );
    const blinkClip = new THREE.AnimationClip('Blink', 1, [blinkTrack]);
    animationClips.push(blinkClip);

    return { group, animationClips };
}
