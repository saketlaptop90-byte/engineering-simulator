export function createProtonStructure(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Proton boundary (Bag Model)
    const boundaryMat = new THREE.MeshStandardMaterial({
        color: 0xaaaaff,
        transparent: true,
        opacity: 0.15,
        roughness: 0.1,
        metalness: 0.1,
        side: THREE.DoubleSide
    });
    const boundary = new THREE.Mesh(new THREE.SphereGeometry(3.5, 64, 64), boundaryMat);
    group.add(boundary);

    // Valence quarks (up, up, down)
    const upMat1 = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0x550000 }); // Red
    const upMat2 = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x005500 }); // Green
    const downMat = new THREE.MeshStandardMaterial({ color: 0x0000ff, emissive: 0x000055 }); // Blue

    const u1 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), upMat1);
    u1.name = 'UpQuark1';
    const u2 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), upMat2);
    u2.name = 'UpQuark2';
    const d1 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), downMat);
    d1.name = 'DownQuark';

    group.add(u1, u2, d1);

    // Sea quarks & Gluons
    const sea = new THREE.Group();
    sea.name = 'SeaParticles';
    const seaMat = new THREE.MeshStandardMaterial({ color: 0xffff00, emissive: 0x888800 });
    for(let i=0; i<50; i++) {
        const g = new THREE.Mesh(new THREE.SphereGeometry(Math.random()*0.1+0.05, 8, 8), seaMat);
        const r = Math.random() * 3;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        g.position.set(r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi));
        sea.add(g);
    }
    group.add(sea);

    // Animations - quarks moving
    const times = [0, 1, 2, 3, 4];
    const u1Pos = [1.5, 1.5, 0,  -1.5, 1.5, 1.5,  -1.5, -1.5, 0,  1.5, -1.5, -1.5,  1.5, 1.5, 0];
    const u2Pos = [-1.5, -1.5, 0,  1.5, -1.5, -1.5,  1.5, 1.5, 0,  -1.5, 1.5, 1.5,  -1.5, -1.5, 0];
    const dPos =  [0, 0, 1.5,   0, 0, -1.5,  0, 0, 1.5,   0, 0, -1.5,   0, 0, 1.5];

    const u1Track = new THREE.VectorKeyframeTrack('UpQuark1.position', times, u1Pos);
    const u2Track = new THREE.VectorKeyframeTrack('UpQuark2.position', times, u2Pos);
    const dTrack = new THREE.VectorKeyframeTrack('DownQuark.position', times, dPos);

    const seaRotTrack = new THREE.VectorKeyframeTrack('SeaParticles.rotation', times, [
        0,0,0, 0,Math.PI/2,0, 0,Math.PI,0, 0,Math.PI*1.5,0, 0,Math.PI*2,0
    ]);

    const clip = new THREE.AnimationClip('ProtonDynamics', 4, [u1Track, u2Track, dTrack, seaRotTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
