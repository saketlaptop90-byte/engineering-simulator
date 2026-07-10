import * as THREE from 'three';
export function createTachyonObserver() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({color: 0x888888}));
    group.add(mesh);
    return { group, animationClips: [] };
}