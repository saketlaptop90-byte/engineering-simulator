export function createAntibodyBinding(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Antigen
    const antigenGeometry = new THREE.IcosahedronGeometry(3, 1);
    const antigenMaterial = new THREE.MeshStandardMaterial({
        color: 0xff4500,
        roughness: 0.6,
        metalness: 0.2
    });
    const antigen = new THREE.Mesh(antigenGeometry, antigenMaterial);
    group.add(antigen);

    // Antibody
    const antibodyGroup = new THREE.Group();
    
    const fcRegionGeo = new THREE.CylinderGeometry(0.2, 0.2, 2);
    const fabRegionGeo = new THREE.CylinderGeometry(0.2, 0.2, 2);
    
    const abMaterial = new THREE.MeshStandardMaterial({
        color: 0x00bfff,
        roughness: 0.4,
        metalness: 0.3
    });

    const fc = new THREE.Mesh(fcRegionGeo, abMaterial);
    fc.position.y = -1;
    antibodyGroup.add(fc);

    const fab1 = new THREE.Mesh(fabRegionGeo, abMaterial);
    fab1.position.set(-0.7, 0.7, 0);
    fab1.rotation.z = Math.PI / 4;
    antibodyGroup.add(fab1);

    const fab2 = new THREE.Mesh(fabRegionGeo, abMaterial);
    fab2.position.set(0.7, 0.7, 0);
    fab2.rotation.z = -Math.PI / 4;
    antibodyGroup.add(fab2);

    antibodyGroup.position.set(0, 8, 0);
    group.add(antibodyGroup);

    // Animation: Antibody binds to antigen
    const times = [0, 2];
    const values = [
        0, 8, 0,
        0, 3.5, 0
    ];

    const track = new THREE.VectorKeyframeTrack(
        antibodyGroup.uuid + '.position', times, values
    );

    const clip = new THREE.AnimationClip('Binding', 2, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
