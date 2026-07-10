export function createHopfFibration(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const numCircles = 12;
    for (let i = 0; i < numCircles; i++) {
        const phi = (i / numCircles) * Math.PI;
        
        const geometry = new THREE.TorusGeometry(2, 0.05, 16, 100);
        const material = new THREE.MeshStandardMaterial({
            color: new THREE.Color().setHSL(i / numCircles, 1, 0.5),
            metalness: 0.4,
            roughness: 0.6
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        
        mesh.rotation.x = Math.PI / 2;
        mesh.rotation.y = phi;
        mesh.position.z = Math.sin(phi) * 1.5;
        mesh.position.x = Math.cos(phi) * 1.5;
        
        group.add(mesh);
    }

    const tracks = [];
    const times = [0, 8];
    const values = [0, 0, 0, 0, Math.PI * 2, 0];
    const rotationTrack = new THREE.VectorKeyframeTrack('.rotation', times, values);
    tracks.push(rotationTrack);

    const clip = new THREE.AnimationClip('HopfRotation', 8, tracks);
    animationClips.push(clip);

    return { group, animationClips };
}
