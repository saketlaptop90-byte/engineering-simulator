import * as THREE from 'three';
import * as materials from '../utils/materials.js';

export function default() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), materials.ghostMaterial || new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}