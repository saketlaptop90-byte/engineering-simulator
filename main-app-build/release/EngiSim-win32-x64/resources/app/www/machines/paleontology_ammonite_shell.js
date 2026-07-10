export function createAmmoniteShell(THREE) {
    const group = new THREE.Group();
    
    const shellMat = new THREE.MeshStandardMaterial({ 
        color: 0xa08060, 
        roughness: 0.7,
        metalness: 0.1
    });

    const segments = 60;
    for (let i = 0; i < segments; i++) {
        const t = i / segments;
        const angle = t * Math.PI * 6; // 3 turns
        const radius = 0.2 + t * 3;
        
        const rGeo = new THREE.TorusGeometry(radius, 0.1 + t * 0.8, 16, 32, Math.PI * 0.2);
        const mesh = new THREE.Mesh(rGeo, shellMat);
        
        mesh.rotation.z = angle;
        group.add(mesh);
    }

    // Base rock
    const rockMat = new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.9 });
    const rockGeo = new THREE.DodecahedronGeometry(4, 1);
    const rock = new THREE.Mesh(rockGeo, rockMat);
    rock.position.z = -1;
    rock.scale.set(1, 1, 0.2);
    group.add(rock);

    const animationClips = [];
    return { group, animationClips };
}
