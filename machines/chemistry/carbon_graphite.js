import * as THREE from 'three';
export function createCarbonGraphite(scene, renderer, camera) {
    const group = new THREE.Group();
    const hexRadius = 1;
    const shape = new THREE.Shape();
    for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const hx = hexRadius * Math.cos(angle);
        const hy = hexRadius * Math.sin(angle);
        if (i === 0) shape.moveTo(hx, hy);
        else shape.lineTo(hx, hy);
    }
    shape.closePath();
    const geo = new THREE.ShapeGeometry(shape);
    const mat = new THREE.MeshStandardMaterial({ color: 0x222222, side: THREE.DoubleSide, wireframe: true });
    
    for(let z = -1; z <= 1; z++) {
        for(let x = -2; x <= 2; x++) {
            for(let y = -2; y <= 2; y++) {
                const mesh = new THREE.Mesh(geo, mat);
                mesh.position.set(x * 1.5, y * 1.732 + (x % 2 === 0 ? 0 : 0.866), z * 2);
                group.add(mesh);
            }
        }
    }
    return {
        group,
        update: () => {
            group.rotation.y += 0.01;
        }
    };
}
