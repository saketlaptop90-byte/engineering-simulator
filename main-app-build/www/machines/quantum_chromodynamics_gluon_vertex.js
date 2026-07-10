export function createGluonVertex(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Central vertex
    const vertexMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xaaaaaa, roughness: 0.1 });
    const vertex = new THREE.Mesh(new THREE.SphereGeometry(0.4, 32, 32), vertexMat);
    group.add(vertex);

    // Three incoming/outgoing gluons
    const gluonMat1 = new THREE.MeshStandardMaterial({ color: 0xff00ff, emissive: 0x880088, wireframe: true });
    const gluonMat2 = new THREE.MeshStandardMaterial({ color: 0xffff00, emissive: 0x888800, wireframe: true });
    const gluonMat3 = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x008888, wireframe: true });

    const g1 = new THREE.Mesh(new THREE.TorusGeometry(2, 0.3, 16, 100), gluonMat1);
    g1.position.set(0, 2.5, 0);
    g1.rotation.y = Math.PI / 2;
    g1.name = 'Gluon1';
    
    const g2 = new THREE.Mesh(new THREE.TorusGeometry(2, 0.3, 16, 100), gluonMat2);
    g2.rotation.z = Math.PI * 2/3;
    g2.position.set(Math.sin(Math.PI * 2/3)*2.5, Math.cos(Math.PI * 2/3)*2.5, 0);
    g2.rotation.x = Math.PI / 2;
    g2.name = 'Gluon2';

    const g3 = new THREE.Mesh(new THREE.TorusGeometry(2, 0.3, 16, 100), gluonMat3);
    g3.rotation.z = Math.PI * 4/3;
    g3.position.set(Math.sin(Math.PI * 4/3)*2.5, Math.cos(Math.PI * 4/3)*2.5, 0);
    g3.rotation.x = Math.PI / 2;
    g3.name = 'Gluon3';

    group.add(g1, g2, g3);

    // Color charges moving along the gluons
    const charge = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff }));
    charge.name = 'ChargeExchange';
    group.add(charge);

    // Animation: color charge moves between the branches
    const times = [0, 1, 2, 3];
    const pos = [
        0, 4.5, 0, // Top
        Math.sin(Math.PI * 2/3)*4.5, Math.cos(Math.PI * 2/3)*4.5, 0, // Bottom right
        Math.sin(Math.PI * 4/3)*4.5, Math.cos(Math.PI * 4/3)*4.5, 0, // Bottom left
        0, 4.5, 0 // Top again
    ];
    
    const track = new THREE.VectorKeyframeTrack('ChargeExchange.position', times, pos);
    
    const clip = new THREE.AnimationClip('VertexInteraction', 3, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
