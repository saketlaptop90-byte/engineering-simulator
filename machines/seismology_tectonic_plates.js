export function createTectonicPlates(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Magma base
    const magmaGeo = new THREE.BoxGeometry(6, 1, 4);
    const magmaMat = new THREE.MeshStandardMaterial({ color: 0xff4500, emissive: 0xaa2200, roughness: 0.8 });
    const magma = new THREE.Mesh(magmaGeo, magmaMat);
    magma.position.y = -0.5;
    group.add(magma);

    // Plate 1
    const plate1Geo = new THREE.BoxGeometry(2.9, 0.5, 4);
    const plate1Mat = new THREE.MeshStandardMaterial({ color: 0x8b4513, roughness: 1.0 });
    const plate1 = new THREE.Mesh(plate1Geo, plate1Mat);
    plate1.position.set(-1.5, 0.25, 0);
    plate1.name = "Plate1";
    group.add(plate1);

    // Plate 2
    const plate2Geo = new THREE.BoxGeometry(2.9, 0.5, 4);
    const plate2Mat = new THREE.MeshStandardMaterial({ color: 0x8b4513, roughness: 1.0 });
    const plate2 = new THREE.Mesh(plate2Geo, plate2Mat);
    plate2.position.set(1.5, 0.25, 0);
    plate2.name = "Plate2";
    group.add(plate2);

    // Animation: Subduction / collision
    const times = [0, 2, 4];
    const p1Pos = [-1.5, 0.25, 0, -1.4, 0.25, 0, -1.5, 0.25, 0];
    const p2Pos = [1.5, 0.25, 0, 1.4, 0.4, 0, 1.5, 0.25, 0];
    
    const track1Named = new THREE.VectorKeyframeTrack('Plate1.position', times, p1Pos);
    const track2Named = new THREE.VectorKeyframeTrack('Plate2.position', times, p2Pos);

    const clip = new THREE.AnimationClip('TectonicCollision', 4, [track1Named, track2Named]);
    animationClips.push(clip);

    return { group, animationClips };
}
