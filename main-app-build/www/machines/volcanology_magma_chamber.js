export function createMagmaChamber(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Magma chamber body
    const chamberGeometry = new THREE.SphereGeometry(3, 32, 32);
    const chamberMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xff2200, 
        emissive: 0x881100,
        transparent: true,
        opacity: 0.9
    });
    const chamber = new THREE.Mesh(chamberGeometry, chamberMaterial);
    group.add(chamber);

    // Magma conduits
    const conduitGeometry = new THREE.CylinderGeometry(0.5, 0.8, 5, 16);
    const conduitMaterial = new THREE.MeshStandardMaterial({ color: 0xff3300, emissive: 0xaa2200 });
    const conduit = new THREE.Mesh(conduitGeometry, conduitMaterial);
    conduit.position.y = 4;
    group.add(conduit);

    // Animation for magma pulsing
    const scaleTrackName = chamber.uuid + '.scale';
    const times = [0, 2, 4];
    const values = [1, 1, 1, 1.1, 1.1, 1.1, 1, 1, 1];
    const track = new THREE.VectorKeyframeTrack(scaleTrackName, times, values);
    const clip = new THREE.AnimationClip('MagmaPulse', 4, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
