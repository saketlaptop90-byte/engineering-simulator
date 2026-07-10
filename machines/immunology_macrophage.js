export function createMacrophage(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Macrophage cell body
    const bodyGeometry = new THREE.SphereGeometry(5, 32, 32);
    const bodyMaterial = new THREE.MeshStandardMaterial({
        color: 0x8a2be2,
        roughness: 0.7,
        metalness: 0.1,
        transparent: true,
        opacity: 0.9
    });
    const cellBody = new THREE.Mesh(bodyGeometry, bodyMaterial);
    group.add(cellBody);

    // Pathogen (bacteria)
    const pathogenGeometry = new THREE.CapsuleGeometry(1, 2, 8, 8);
    const pathogenMaterial = new THREE.MeshStandardMaterial({
        color: 0x32cd32,
        roughness: 0.8,
        metalness: 0.1
    });
    const pathogen = new THREE.Mesh(pathogenGeometry, pathogenMaterial);
    pathogen.position.set(10, 0, 0);
    group.add(pathogen);

    // Animation: Pathogen being engulfed
    const duration = 4;
    const times = [0, 2, 4];
    const values = [
        10, 0, 0,
        5, 0, 0,
        2, 0, 0
    ];
    
    const scaleValues = [
        1, 1, 1,
        1, 1, 1,
        0, 0, 0
    ];

    const positionTrack = new THREE.VectorKeyframeTrack(
        pathogen.uuid + '.position', times, values
    );
    const scaleTrack = new THREE.VectorKeyframeTrack(
        pathogen.uuid + '.scale', times, scaleValues
    );

    const clip = new THREE.AnimationClip('Phagocytosis', duration, [positionTrack, scaleTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
